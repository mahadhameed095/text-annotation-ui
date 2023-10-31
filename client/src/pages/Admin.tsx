import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import Papa from 'papaparse';
import { useRef } from "react"

type User = {
  name : string;
  email :string;
  annotatedCount : number;
  assignedCount : number;
}

const users : User[] = [
  {
    name : "Mahad Hameed",
    email : "mahad@AnnoText.com",
    annotatedCount : 1960,
    assignedCount : 125
  },
  {
    name : "Raahim Siddiqi",
    email : "raahim@AnnoText.com",
    annotatedCount : 2000,
    assignedCount : 125
  },
  {
    name : "Ahmed Mahmood",
    email : "ahmed@AnnoText.com",
    assignedCount : 300,
    annotatedCount : 1500
  }
];


const uploadDocuments = (inputFile: any) => {
  if (inputFile.current !== null) {
      Papa.parse(inputFile.current.files[0], {
          complete: (results) => {
            if (results.data.length > 0) {
              // Iterate through each row in the CSV file
              // results.data.forEach((row: any, index: any) => {
              //     // setDoc(doc(db, "documents", `${index + 1}`), {document:row["document"]});
              // });
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
    accessorKey : "annotatedCount",
    header: () => <div className="text-center">Annotated</div>,
    cell: ({ row }) => <div className="text-center font-semibold">{row.getValue('annotatedCount')}</div> 
  },
];


export default function Admin() {
  const inputFile = useRef(null);
  
  const table = useReactTable({
    data : users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
    <Card className="max-w-[600px] mx-4 md:mx-auto border mt-16 shadow-md rounded-md">
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

    <Card className="max-w-[600px] mx-4 md:mx-auto border mt-16 shadow-md rounded-md">
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