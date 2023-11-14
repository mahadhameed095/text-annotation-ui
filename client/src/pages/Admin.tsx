import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useRef, useState, useMemo } from "react"
import { Annotation, Document, User } from "../../api.ts";
import { useAuth } from "@/context";
import { checkForServerError, bytesToBase64 } from "@/lib/utils.ts";
import { useToast } from "@/components/ui/use-toast.ts";
import Papa from "papaparse";
import pako from 'pako';
import Spinner from "@/components/Spinner.tsx";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar.tsx";

type User = {
  profile: string | undefined,
  id: string,
  name : string | undefined;
  email : string | undefined;
  approved: boolean;
  total : number;
  islamic : number;
  non_islamic : number;
  hateful : number;
}

type UserSchema = {
  id: string;
  role: "ADMIN" | "USER";
  approved: boolean;
  name?: string | undefined;
  profile?: string | undefined;
  email?: string | undefined;
  phone_number?: string | undefined;
}[]

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "profile",
    header: () => <div className="text-center"></div>,
    cell: ({ row }) => <div className="text-center">
      <Avatar className="h-8 w-8">
        <AvatarImage src={row.getValue('profile')} alt="@shadcn" />
      </Avatar>
    </div> 
  },
  {
    accessorKey: "id",
    header: () => <div className="text-center">id</div>,
    cell: ({ row }) => <div className="max-w-[60px] overflow-hidden overflow-ellipsis text-center">{row.getValue('id')}</div> 
  },
  {
    accessorKey: "name",
    header : "Name"
  },
  {
    accessorKey: "email",
    header: () => <div className="text-center">Email</div>,
    cell: ({ row }) => <div className="text-center">{row.getValue('email')}</div> 
  },
  {
    accessorKey : "total",
    header: () => <div className="text-center">Annotated</div>,
    cell: ({ row }) => <div className="text-center font-semibold">{row.getValue('total')}</div> 
  },
  {
    accessorKey : "islamic",
    header: () => <div className="text-center">Islamic</div>,
    cell: ({ row }) => <div className="text-center font-semibold">{row.getValue('islamic')}</div> 
  },
  {
    accessorKey : "non_islamic",
    header: () => <div className="text-center">Non-Islamic</div>,
    cell: ({ row }) => <div className="text-center font-semibold">{row.getValue('non_islamic')}</div> 
  },
  {
    accessorKey : "hateful",
    header: () => <div className="text-center">Hateful</div>,
    cell: ({ row }) => <div className="text-center font-semibold">{row.getValue('hateful')}</div> 
  },
];


export default function Admin() {
  const [_, setIsAuthenticated] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const {user} = useAuth();
  const {toast} = useToast();
  const navigate = useNavigate();


  function approveUser(userId: string) {
    console.log(user?.token)
    if (user) {
      User.approve({
        headers : {
          authorization : `BEARER ${user.token}`
        },
        body: {
          id: userId
        }
      }).then(({status}) => {
        if (status == 200) {
          const updatedUsers = users.map(user =>
            user.id === userId ? { ...user, approved: true } : user
          );
          setUsers(updatedUsers);
        }
      }).catch((error: any) => {
        console.log(error);
      })
    }
  }
  
  const data = useMemo(() => {
    return users.filter(user => user.approved)
  }, [users]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    user ? setIsAuthenticated(true) : navigate("/login");
  }, [])

  const uploadDocuments = async (file: File) => {
    if (!user) return;
    if (file.type !== "text/csv") {
      toast({
        title: "Invalid File Type",
        variant: "destructive"
      })
      return;
    };
    if (file.size >= 104857600) {
      toast({
        title: "File Size Limit Exceeded",
        variant: "destructive",
        description: "<100mb limit"
      })
      return;
    };

    Papa.parse(file, {
      complete: async (results) => {
        if (results.data.length === 0) {
          toast({
            title : 'The CSV is empty'
          });
          return;
        }
        if(!results.meta.fields?.includes('text')){
          toast({
            title: "Incorrect file format",
            variant: "destructive",
            description: `'text' field is missing`
          });
          return; 
        }
        const validated = results.data.map((item : any) => ({ text : item.text, metadata : item.metadata}));
        const jsonResults = JSON.stringify(validated);
        const compressedResults = bytesToBase64(pako.deflate(jsonResults));
        console.log({ data : compressedResults.length / (1024 * 1024)});
        await Document.add({
          body : {
            compressedResults
          },
          headers : {
            authorization : `BEARER ${user.token}`
          }
        });
      },
      header: true,
      worker: true
    });
  }

  const fetchCounts = () => {
    if (user) {
      return Annotation.getCountsAllAnnotators({
        headers: {
          authorization: `Bearer ${user.token}`
        }
      }).then(({status, body}) => {
        if (status == 200) {
          return body
        }
      })
    }
  }

  const fetchApprovedAnnotaters = () => {
    if (user) {
      return User.listApproved({
        headers: {
          authorization: `Bearer ${user.token}`
        } 
      } as any).then(({status, body}) => {
        checkForServerError(status, toast)
        if (status == 200) {
          return body
        }
        else if (status == 400) {
          toast({
            variant: "destructive",
            title: "Authorization Error",
          })
        }
      })
    }
  }

  const fetchUnapprovedUsers = () => {
    if (user) {
      return User.listUnapproved({
        headers: {
          authorization: `Bearer ${user.token}`
        } 
      } as any).then(({status, body}) => {
        checkForServerError(status, toast)
        if (status == 200) {
          return body
        }
        else if (status == 400) {
          toast({
            variant: "destructive",
            title: "Authorization Error",
          })
        }
      })
    }
  }

  useEffect(() => {
    Promise.all([
      fetchApprovedAnnotaters(),
      fetchUnapprovedUsers(),
      fetchCounts()
    ]).then(([approvedUsers, unapprovedUsers, counts]) => {
      if (approvedUsers && unapprovedUsers && counts) {
        const combinedUsers : UserSchema = [...approvedUsers, ...unapprovedUsers];
        const combinedList : User[] = [];
      
        combinedUsers.forEach(obj1 => {
          const matchedObj2 = counts.find(obj2 => obj2.id === obj1.id);
          if (matchedObj2) {
            const combinedObject = { ...obj1, ...matchedObj2 };
            const { profile, id, approved, name, email, total, islamic, non_islamic, hateful } = combinedObject;
            combinedList.push({ profile, approved, id, name, email, total, islamic, non_islamic, hateful });
          }
        }); 
        setUsers(combinedList);
      }
    })
  }, [])

  const handleReset = () => { 
    if (inputFile.current) { 
        inputFile.current.value = ""; 
        inputFile.current.type = "text"; 
        inputFile.current.type = "file"; 
    } 
  }; 

  console.log(users.filter(user => user.approved === false))

  return (
    <>
    {isProcessing && <div className="bg-gray-100 bg-opacity-80 z-20 fixed top-0 left-0 w-full h-full flex items-center justify-center inset-0">{Spinner({className:"w-16"})}</div>}
    
    <Card className="max-w-[800px] m-3 sm:m-6 md:mx-auto border mt-16 shadow-md rounded-md">
      <CardHeader>
        <CardTitle>Annotator Overview</CardTitle>
      </CardHeader>
      <hr/>
      <CardContent className="grid gap-6 py-6">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
            
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Card className="max-w-[800px] m-3 sm:m-6 md:mx-auto border mt-16 shadow-md rounded-md">
      <CardHeader>
        <CardTitle>User Approval Management</CardTitle>
      </CardHeader>
           
      <hr/>
      <CardContent className="grid gap-6 py-6">
      {users.filter(user => user.approved === false).length ?
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="text-center">id</TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.filter(user => user.approved === false).map((user, userIndex) => (
                <TableRow key={userIndex}>
                  <td>
                    <div className="text-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profile} alt="@shadcn" />
                      </Avatar>
                    </div> 
                  </td>
                  <td>
                    <div className="max-w-[60px] overflow-hidden overflow-ellipsis text-center">{user.id}</div> 
                  </td>
                  <td>
                    <div className="text-center">{user.name}</div> 
                  </td>
                  <td>
                    <div className="text-center">{user.email}</div> 
                  </td>
                  <td>
                    <Button className="bg-green-700 text-white" onClick={() => approveUser(user.id)}>Approve</Button>
                  </td>
                </TableRow>
              
            ))}
          </TableBody>
        </Table>
      :
        <CardDescription>No user approvals pending. Good Job!</CardDescription>
      }
      </CardContent>
    </Card>

    <Card className="max-w-[800px] m-3 sm:m-6 md:mx-auto border mt-16 shadow-md rounded-md">
      <CardHeader>
          <CardTitle>Document Management Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="justify-between items-center">
          <p>CSV file is expected to have text column and a metadata column (optional). This Feature is PC-only.</p>
          <Button className='m-2 ml-auto' onClick={()=>{(inputFile.current as any).click()}}>
              Upload Documents
              <input 
                type='file'
                id='file'
                onChange={() => {
                  const file = inputFile.current?.files?.[0];
                  if(file){
                    setIsProcessing(true);
                    uploadDocuments(file).then(() => {
                      setIsProcessing(false);
                      handleReset();
                    });
                  }
                }}
                ref={inputFile}
                style={{display: 'none'}}
              />
          </Button>
        </CardDescription>
      </CardContent>
    </Card>
  </>
  )
}