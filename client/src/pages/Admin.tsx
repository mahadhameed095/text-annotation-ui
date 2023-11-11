import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useContext, useEffect, useRef, useState } from "react"
import { Annotation, Document, User } from "../../api.ts";
import { userContext, userContextType } from "@/context";
import { checkForServerError, bytesToBase64 } from "@/lib/utils.ts";
import { useToast } from "@/components/ui/use-toast.ts";
import Papa from "papaparse";
import * as pako from 'pako';
import Spinner from "@/components/Spinner.tsx";

type User = {
  id: string,
  name : string | undefined;
  email :string | undefined;
  total : number;
  islamic : number;
  non_islamic : number;
  hateful : number;
}



export const columns: ColumnDef<User>[] = [
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
  const inputFile = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const {user} = useContext(userContext) as userContextType;
  const {toast} = useToast();
  
  const table = useReactTable({
    data : users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

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

    setIsProcessing(true);

    Papa.parse(file, {
      complete: async (results) => {
        if (results.data.length > 0) {
          const acceptedFields : Array<string> = ['index', 'Document', 'subreddit']
          if (JSON.stringify(results.meta.fields) === JSON.stringify(acceptedFields)) {
            const transformedResults = results.data.map((original: any) => ({
              text: original.Document,
              metadata: {
                source: original.subreddit,
              },
            }));

            const jsonResults = JSON.stringify(transformedResults);
            const compressedResults = bytesToBase64(pako.deflate(jsonResults));

            const res = await Document.add({
              body : {
                compressedResults
              },
              headers : {
                authorization : `BEARER ${user.token}`
              }
             });
             console.log(res)
          }
          else {
            toast({
              title: "Invalid File Type",
              variant: "destructive",
              description: "incorrect column names"
            })
          }
        } 
        else {
          console.log('CSV file is empty');
        }
        setIsProcessing(false);
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

  const fetchAnnotaters = () => {
    if (user) {
      return User.listAll({
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
      fetchAnnotaters(),
      fetchCounts()
    ]).then(([users, counts]) => {
      if (users && counts) {
        const combinedList : User[] = [];
        console.log(users)

        users.users.forEach(obj1 => {
          const matchedObj2 = counts.find(obj2 => obj2.id === obj1.id);
          if (matchedObj2) {
            const combinedObject = { ...obj1, ...matchedObj2 };
            const { id, name, email, total, islamic, non_islamic, hateful } = combinedObject;
            combinedList.push({ id, name, email, total, islamic, non_islamic, hateful });
          }
        }); 

        setUsers(combinedList);
      }
    })
  }, [])

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
        <CardTitle>Document Management Panel</CardTitle>
        <CardDescription className="flex justify-between items-center">
          <Button className='m-2 ml-auto' onClick={()=>{(inputFile.current as any).click()}}>
              Upload Documents
              <input 
                type='file'
                id='file'
                onChange={() => {
                  const file = inputFile.current?.files?.[0];
                  if(file)
                    uploadDocuments(file);
                }}
                ref={inputFile}
                style={{display: 'none'}}
              />
          </Button>
        </CardDescription>
      </CardHeader>
    </Card>
  </>
  )
}