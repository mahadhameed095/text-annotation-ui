import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Overview } from '@/components/Overview';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from '@/lib/utils';
import { Annotation, ApiContract } from "../../api.ts";
import { useAuth } from '@/context';
import { ClientInferResponseBody } from '@ts-rest/core';
import Spinner from '@/components/Spinner.tsx';
import { useToast } from '@/components/ui/use-toast.ts';

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

type AnnotationContractType = ClientInferResponseBody<typeof ApiContract['annotation']['getAnnotatedCountOverTime'], 200> 

type AnnotaterStatistics = {
  labels: {
    title: string,
    value: number
  }[]
  performance : AnnotationContractType | undefined,
  progress : {
    total: number,
    annotated: number,
    user_annotated: number
  }
}

interface bodyType {
  [index: string]: number;
}

type getCatdDataProps = {
  status: number,
  body: bodyType
}

const Home = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>("last 7 days");
    const {user} = useAuth();
    const [data, setData] = useState<AnnotaterStatistics | null>(null);
    const {toast} = useToast();
    const navigate = useNavigate();
    
    function fetchCardData() {
      if (user) {
        return Annotation.getCountsAll({
          headers: {
            authorization: `Bearer ${user.token}`
          }
        }).then(({status, body}: getCatdDataProps) => {
          if (status == 200) {
            return {
                labels: Object.keys(body).map((fieldName) => ({
                  title: fieldName,
                  value: body[fieldName]
                })),
            }
          }
        });
      }
    }


    function fetchAnnotatedCountOverTime() {
      if (user && value && value.match(/\d+/)) {
        return Annotation.getAnnotatedCountOverTime({
          headers: {
            authorization: `Bearer ${user.token}`
          },
          query: {
            take: parseInt(value.match(/\d+/)![0], 10)
          }
        }).then(({status, body}) => {
          if (status == 200) {
            return body;
          }
        })
      }   
    }


    function fetchAnnotationProgress() {
      if (user) {
        return Annotation.getTotalCount({
          headers: {
            authorization: `Bearer ${user.token}`
          },
        }).then(({status, body}) => {
          if (status == 200) {
            return body;
          }
        })
      }
    }


    useEffect(() => {
      Promise.all([
        fetchCardData(),
        fetchAnnotatedCountOverTime(),
        fetchAnnotationProgress()
      ]).then(([cardData, performanceData, annotationProgress]) => {
        if (cardData && annotationProgress) {
          const total = annotationProgress["total"];
          const annotated = annotationProgress["islamic"] + annotationProgress["non_islamic"]
          const user_annotated = cardData["labels"].find(obj => obj.title === "total")!.value
        
          setData({labels : cardData["labels"], performance: performanceData, progress: {total, annotated, user_annotated}})
        }
      }).catch((error) => {
        toast({
          variant: "destructive",
          title: error.message,
          description: "Contact k200338@nu.edu.pk for assistance",
        })
      })
    }, [value])


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
          {user?.approved ?
          <>
            {data ? 
            <div className='mx-auto p-2 sm:p-6 md:p-10'>
                <div className='mb-4 sm:flex'>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    </div>
                    <div className='ml-auto py-4 sm:p-0'>
                        <Button className="" onClick={() => navigate("/tool")}>
                            Annotation Tool
                            <svg className='m-1' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                        </Button>
                        {(user?.role == "ADMIN") &&
                        <Button className="ml-4" onClick={() => navigate("/admin")}>
                            Admin Panel
                            <svg className='m-1' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.8536 1.14645C11.6583 0.951184 11.3417 0.951184 11.1465 1.14645L3.71455 8.57836C3.62459 8.66832 3.55263 8.77461 3.50251 8.89155L2.04044 12.303C1.9599 12.491 2.00189 12.709 2.14646 12.8536C2.29103 12.9981 2.50905 13.0401 2.69697 12.9596L6.10847 11.4975C6.2254 11.4474 6.3317 11.3754 6.42166 11.2855L13.8536 3.85355C14.0488 3.65829 14.0488 3.34171 13.8536 3.14645L11.8536 1.14645ZM4.42166 9.28547L11.5 2.20711L12.7929 3.5L5.71455 10.5784L4.21924 11.2192L3.78081 10.7808L4.42166 9.28547Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                        </Button>}
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
                        <Overview data={data?.["performance"]}/>
                      </CardContent>
                    </Card>
                    <Card className="col-span-3 sm:mt-0 mt-2">
                      <CardHeader>
                        <CardTitle>Annotation Progress</CardTitle>
                      </CardHeader>
                      <CardContent className="pl-2">
                        <div className='p-4'>
                            <div className='p-2'>
                                <CardDescription className='mb-1'>Annotation Tasks Completed  ({(data.progress["annotated"]/data.progress["total"]*100).toFixed(2)}%)</CardDescription>
                                <Progress className="h-3" value={parseFloat((data.progress["annotated"]/data?.progress["total"]*100).toFixed(2))} />
                                <CardDescription className='my-4'>Your Contribution: {(data.progress["user_annotated"]/data.progress["total"]*100).toFixed(2)}%</CardDescription>
                            </div>
                        </div>
                      </CardContent>
                    </Card>
                </div>
            </div> : <div className="flex h-[calc(100vh-120px)] sm:h-[calc(100vh-70px)]">{Spinner({className:"w-16 m-auto"})}</div>}
          </> 
          :
            <div className='max-w-[800px] mx-auto p-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Account under review</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Please wait until an administrator has manually approved your account. If more than 24 hours pass without approval, please contact k200338@nu.edu.pk.</CardDescription>
                </CardContent>
              </Card>
            </div>
          }
        </>
     );
}
 
export default Home;