import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Papa from 'papaparse';
import { useContext, useEffect, useRef, useState } from "react"
import { Annotation, User } from "../../api.ts";
import { userContext, userContextType } from "@/context";
import { checkForServerError } from "@/lib/utils.ts";
import { useToast } from "@/components/ui/use-toast.ts";


type User = {
  id: number,
  name : string;
  email :string;
  total : number;
  islamic : number;
  non_islamic : number;
  hateful : number;
}


const uploadDocuments = (inputFile: any) => {
  if (inputFile.current !== null) {
      Papa.parse(inputFile.current.files[0], {
          complete: (results) => {
            if (results.data.length > 0) {

            } 
            else {
              console.log('CSV file is empty');
            }
          },
          header: true, // Set this to true if your CSV file has a header row
      });
  }
  // e.target ? e.target.value = '' : null;
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
  const inputFile = useRef(null);
  const [users, setUsers] = useState<User[]>([]);
  const {user} = useContext(userContext) as userContextType;
  const {toast} = useToast();
  
  const table = useReactTable({
    data : users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  console.log("meow", user)

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
    return User.listAll().then(({status, body}) => {
      checkForServerError(status, toast)
      console.log("nani", user, body)
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

  useEffect(() => {
    Promise.all([
      fetchAnnotaters(),
      fetchCounts()
    ]).then(([users, counts]) => {
      if (users && counts) {
        const combinedList : User[] = [];

        users.forEach(obj1 => {
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
    <Card className="max-w-[800px] m-6 md:mx-auto border mt-16 shadow-md rounded-md">
      <CardHeader>
        <CardTitle>Annotators</CardTitle>
        <CardDescription className="flex justify-between items-center">
          Annotators gonna annotate
        </CardDescription>
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

    <Card className="max-w-[800px] m-6 md:mx-auto border mt-16 shadow-md rounded-md">
    <CardHeader>
        <CardTitle>Documents</CardTitle>
        <CardDescription className="flex justify-between items-center">
          Document Management Panel
          <Button className='ml-1' onClick={()=>{(inputFile.current as any).click()}}>
              Upload Documents
              <input type='file' id='file' onChange={() => uploadDocuments(inputFile)}  ref={inputFile} style={{display: 'none'}}/>
          </Button>
        </CardDescription>
      </CardHeader>
    </Card>
  </>
  )
}