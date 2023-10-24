import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Overview } from '@/components/Overview';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from '@/lib/utils';
import { User, Annotation } from "../../api.ts";
import { userContext, userContextType } from '@/context';

const frameworks = [
    {
      value: "last 7 days",
      label: "Last 7 Days",
    },
    {
      value: "last 30 days",
      label: "Last 30 Days",
    },
  ]


type AnnotaterStatistics = {
  labels: {
    title: string,
    value: number
  }[]
}

interface bodyType {
  [index: string]: number;
}

type Props = {
  status: number,
  body: bodyType
}

const Home = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>("last 7 days");
    const {user} = useContext(userContext) as userContextType;
    const [data, setData] = useState<AnnotaterStatistics | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
      user ? setIsAuthenticated(true) : navigate("/login");
    }, [])

    useEffect(() => {
      if (user) {
        Annotation.getCountsAll({
          headers: {
            authorization: `Bearer ${user.token}`
          }
        }).then(({status, body}: Props) => {
          if (status == 200) {
            setData({
                labels: Object.keys(body).map((fieldName) => ({
                  title: fieldName,
                  value: body[fieldName]
                })),
            })
          }
        });
      }
    }, [user])

    useEffect(() => {
      if (user) {
        Annotation.getAnnotatedCountOverTime({
          headers: {
            authorization: `Bearer ${user.token}`
          },
          query: {
            take: 30
          }
        }).then(({status, body}) => {
          console.log("meow",status, body)
        })
      }   
    }, [user])

    const renderDropdown = () => {
        return(
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                    ? frameworks.find((framework) => framework.value === value)?.label
                    : "Select Period..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                    {frameworks.map((framework) => (
                        <CommandItem
                        key={framework.value}
                        onSelect={(currentValue) => {
                            console.log(currentValue)
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                        }}
                        >
                        <Check
                            className={cn(
                            "mr-2 h-4 w-4",
                            value === framework.value ? "opacity-100" : "opacity-0"
                            )}
                        />
                        {framework.label}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </Command>
                </PopoverContent>
            </Popover> 
        )      
    }

    const renderCards = () => {
      return(
        <>
        {
          data ? data.labels.map((item) => (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {item["title"].charAt(0).toUpperCase() + item["title"].slice(1).toLowerCase()} Posts Annotated
                  </CardTitle>
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item["value"]}</div>
                  <p className="text-xs text-muted-foreground">
                  </p>
                </CardContent>
              </Card>
          )) 
          : 
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
              </CardTitle>
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold"></div>
              <p className="text-xs text-muted-foreground">
              </p>
            </CardContent>
          </Card>
        }
        </>
      );
    }

    function getCols() {
      return "lg:grid-cols-" + data?.labels.length;
    }

    return ( 
        <>
        {isAuthenticated ?
        <div className='mx-auto p-6 md:p-10'>
            <div className='mb-4 flex'>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                </div>
                <div className='ml-auto'>
                    <Button className="" onClick={() => navigate("/tool")}>
                        Annotation Tool
                        <svg className='m-1' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                    </Button>
                </div>
            </div>
            <div className={`grid gap-4 md:grid-cols-3 ${getCols()}`}>
              {renderCards()}
            </div>
            <div className="py-4 sm:grid sm:gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader className='flex-row'>
                    <CardTitle>Overview</CardTitle>
                    <div className='ml-auto'>
                        {renderDropdown()}
                    </div>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview />
                  </CardContent>
                </Card>
                <Card className="col-span-3 sm:mt-0 mt-2">
                  <CardHeader>
                    <CardTitle>Overall Progress (All Annotators)</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <div className='p-4'>
                        <div className='pb-4'>
                            <CardDescription>Annotation Tasks Completed</CardDescription>
                            <Progress value={51} />
                        </div>
                    </div>
                  </CardContent>
                </Card>
            </div>
        </div> : ""}
        </>
     );
}
 
export default Home;