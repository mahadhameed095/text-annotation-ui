import { PlusIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAsyncCallback } from 'react-async-hook';

// import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ReactNode, useRef, useState } from "react"
// import { entryManager } from "@/lib/EntryManager"
// import { useMutation } from "react-query"
import { useToast } from "@/components/ui/use-toast";
import Papa from 'papaparse';
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

type QuickAssignProps = {
  uids : "all" | string[];
  options : number[];
  trigger : ReactNode;
}
const delay = (ms : number) => new Promise(res => setTimeout(res, ms));

function QuickAssign({uids, options, trigger} : QuickAssignProps){
  const [option, setoption] = useState<number>(options[0]);
  const { toast } = useToast();
  const mutator = useAsyncCallback(async () => {
    try{
      // const ids = uids === "all" ? [] : uids;
      await delay(3000);
      toast({
        description : `Assigned ${option} entries to ${uids}`
      });
    }
    catch{
      toast({
        variant : "destructive",
        description : `Something went wrong!`
      });
    }
    // await Promise.all(
    //   ids.map(id => entryManager.AssignEntries(id, option))
    // )
  });
  return (
    <Dialog open={!mutator.loading ? undefined : mutator.status !== 'success'}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] min-h-[300px]">
        {
        mutator.loading ? 
          <svg className="mx-auto animate-spin mt-[25%] h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        :
        <>
          <DialogHeader>
            <DialogTitle>Quick Assign</DialogTitle>
            <DialogDescription>
              Select the number of entries to assign.
            </DialogDescription>
          </DialogHeader>
          <hr/>
          <RadioGroup value={String(option)} onValueChange={val => setoption(Number(val))}>
            {
              [...new Set(options)].sort((a,b) => a - b).map(String).map(num => (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={num} id={num} />
                  <Label htmlFor={num}>{num}</Label>
                </div>
              ))
            }
          </RadioGroup>
          <DialogFooter>
            <Button disabled={mutator.loading} onClick={mutator.execute}>Assign</Button>
          </DialogFooter>
        </>
        }
        </DialogContent>
    </Dialog>    
  );
}


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
  {
    accessorKey : "assignedCount",
    header : () => <div className="text-center">Assigned</div>,
    cell: ({ row }) => <div className="text-center font-semibold">{row.getValue('assignedCount')}</div> 
  },
  {
    accessorKey : "email",
    header: () => <div className="text-center">Add</div>,
    cell : () => (
      <QuickAssign
        options={[10, 50, 100, 250, 500]}
        uids={[]}
        trigger={<Button><PlusIcon/></Button>}
      />
    )
  }
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
          <QuickAssign 
            options={[10, 50, 100, 250, 500]}
            uids={"all"}
            trigger={<Button>Quick Assign</Button>}
            />
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