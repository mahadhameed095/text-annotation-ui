import { useEffect, useReducer, useRef, useState } from "react"
import { useHotkeys } from 'react-hotkeys-hook'
import EntryUI from "../components/EntryUI";
import { Annotation, Labels, ApiContract } from "../../api.ts";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import { ClientInferResponseBody } from "@ts-rest/core";
import { Nullable, checkForServerError } from "@/lib/utils.ts";
import { useToast } from '@/components/ui/use-toast';
import Spinner from '@/components/Spinner';

type assignedAnnotationTypeArray = ClientInferResponseBody<typeof ApiContract['annotation']['getAssignedAnnotations'], 200> 
type pastAnnotationTypeArray = ClientInferResponseBody<typeof ApiContract['annotation']['getPastAnnotations'], 200>
type UnwrapArray<T> = T extends (infer U)[] ? U : T;

type assignedAnnotationType = UnwrapArray<assignedAnnotationTypeArray>;
type pastAnnotationType = UnwrapArray<pastAnnotationTypeArray>;


const AnnotationTool = () => {
    const {user} = useAuth();
    const [isFetching, setIsFetching] = useState<Boolean>(false);
    const [_, setIsAuthenticated] = useState(false);
    const [activeEntryIndex, setActiveEntryIndex] = useState<number | null>(null);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const data = useRef<(assignedAnnotationType | pastAnnotationType)[]>([]);
    const {toast} = useToast();
    const labelsToSubmit = useRef<Nullable<Labels>>({
        islamic : null,
        hateful : null
    }); 
    const navigate = useNavigate();

    useEffect(() => {
        user ? setIsAuthenticated(true) : navigate("/login");
      }, [user])

    function fetchInitialTasks() {
        if (user) {
            return Annotation.getAssignedAnnotations({
                headers: {
                    authorization: `Bearer ${user.token}`
                },
            }).then(({status, body}) => {
                checkForServerError(status, toast);
                if (status == 200) {
                    if (body.length < 5) {  // If less than 5 assigned annotations, reserve and fetch more
                        return Annotation.reserveAnnotation({
                            headers: {
                                authorization: `Bearer ${user.token}`
                            },                        
                        }).then(({status, body: newAnnotationData}) => {
                            checkForServerError(status, toast);
                            if (status == 200) {
                                console.log("reserving tasks...")
                                const concatenatedData = body.concat(newAnnotationData).sort((a, b) => a.id - b.id);
                                return concatenatedData;
                            }
                        })
                    }
                    else { 
                        return body.sort((a, b) => a.id - b.id);
                    }
                }
            })
        }
    }

    function fetchMoreTasks() {
        console.log("getting more tasks...")
        if (user) {
            return Annotation.reserveAnnotation({
                headers: {
                    authorization: `Bearer ${user.token}`
                },                        
            }).then(({status, body}) => {
                checkForServerError(status, toast);
                if (status == 200) {
                    console.log("reserving tasks...")
                    return body.sort((a, b) => a.id - b.id)
                }
            })
        }
    }
    
    function fetchHistory() {
        console.log("getting history...")
        if (user) {
            return Annotation.getPastAnnotations({
                headers: {
                    authorization: `Bearer ${user.token}`
                },
                query : {
                    take: 10
                }
            }).then(({status, body}) => {
                checkForServerError(status, toast);
                if (status == 200) {
                    console.log("past annotations", status, body);
                    return body;
                }
            })
        }
    }


    useEffect(() => {
        setIsFetching(true)

        Promise.all([
            fetchInitialTasks(),
            fetchHistory()
        ]).then(([tasks, history]) => {
            console.log(tasks);
            if (tasks) {
                if (history) {
                    data.current = history.reverse()
                    data.current = data.current.concat(tasks)
                    setActiveEntryIndex(history.length);
                }
                else {
                    data.current = tasks
                    setActiveEntryIndex(0);
                }
            }
            setIsFetching(false);
        }).catch((error) => {
            console.log(error);
            toast({
                variant: "destructive",
                title: error.message,
                description: "Please contact k200338@nu.edu.pk for assistance"
            })
            setIsFetching(false);
        })
      }, [])

    const onChange = (labels : Nullable<Labels>) => {
        labelsToSubmit.current = labels;
    }

    const checkDisabled = () => {
        return labelsToSubmit.current.hateful === null || labelsToSubmit.current.islamic === null
    }

    const incrementActiveEntryIndex = () => {
        if (data.current && activeEntryIndex != null) {
            if ((data.current.length-1) - activeEntryIndex < 3) {
                console.log("fetching more docs....")
                fetchMoreTasks()?.then((new_tasks) => {
                    if (new_tasks?.length !== 0) {
                        data.current = data.current.concat(new_tasks as any)
                        console.log("udpated task list", data.current)
                    }
                    else {
                        console.log("no more tasks remaining currently")
                    }
                })
            }
            if ("value" in data.current[activeEntryIndex]) { // only continue if the current document has been annotated
                if (activeEntryIndex < data.current.length-1) { // do not continue if there are no more "reserved" documents to annotate
                    setActiveEntryIndex(activeEntryIndex + 1);
                }
            }
        }      
    }

    const decrementActiveEntryIndex = () => {
        if (data.current && activeEntryIndex != null && activeEntryIndex > 0) {
            setActiveEntryIndex(activeEntryIndex - 1);
        }  
    }

    const onSubmit = () => {
        const { hateful, islamic } = labelsToSubmit.current;

        if (hateful === null || islamic === null) 
            alert("cannot submit because null.");
        else{
            if (data.current && user && activeEntryIndex != null) {
                return Annotation.submitAnnotation({
                    headers: {
                        authorization: `Bearer ${user.token}`
                    },
                    body: {
                        value: {
                            hateful: hateful,
                            islamic: islamic
                        },
                        id: data.current[activeEntryIndex].id
                    } 
                }).then(({status}) => {
                    if (status == 200) {
                        (data.current[activeEntryIndex] as any).value = {
                            hateful: hateful,
                            islamic: islamic
                        }
                        incrementActiveEntryIndex();
                    }
                })
            }
        }
    }

    const onSkip = () => {
        if (user && activeEntryIndex != null) {
            return Annotation.skipAnnotation({
                headers: {
                    authorization: `Bearer ${user.token}`
                },
                body : {
                    id:  data.current[activeEntryIndex].id
                }
            }).then(({status}) => {
                if (status === 200) {
                    console.log("skipped successfully")
            
                    const newData = [...data.current];          // Make a copy of the array to avoid modifying the original array directly
                    newData.splice(activeEntryIndex, 1);        // Remove the element at activeEntryIndex
                    data.current = newData;                     // Update the state or ref with the modified array

                    if ((data.current.length-1) - activeEntryIndex < 3) {
                        console.log("fetching more docs....")
                        return fetchMoreTasks()?.then((new_tasks) => {
                            if (new_tasks?.length !== 0) {
                                data.current = data.current.concat(new_tasks as any)
                                console.log("udpated task list", data.current)
                            }
                            else {
                                console.log("no more tasks remaining currently")
                            }
                        })
                    }

                    if (activeEntryIndex >= data.current.length) {  // Edge case where no more annotations remain,
                        decrementActiveEntryIndex()                 // and the annotatoer skips the last one.
                    }
                    else {
                        forceUpdate();
                    }
                }
            })
        }
    }

    useHotkeys('enter', onSubmit);

    return (
        <div className="container px-6 lg:px-20 mx-auto mt-4"> 
            {(data.current && activeEntryIndex !== null && data.current[activeEntryIndex]) ?
                <EntryUI 
                    entry={data.current[activeEntryIndex]} 
                    onChange={onChange}
                    onSubmit={onSubmit}
                    onSkip={onSkip}
                    checkDisabled={checkDisabled}
                    incrementActiveEntryIndex={incrementActiveEntryIndex}
                    decrementActiveEntryIndex={decrementActiveEntryIndex}
                />
            :
                <>
                    { isFetching === true ?
                        Spinner({className:"w-16 m-auto"})
                    :
                        <div className="text-center">
                            No Annotations Remaining. Good job.
                        </div>
                    }
                </>
            }
        </div>
     );
}
 
export default AnnotationTool;