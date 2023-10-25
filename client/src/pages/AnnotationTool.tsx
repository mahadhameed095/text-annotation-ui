import { useContext, useEffect, useRef, useState } from "react"
import { useHotkeys } from 'react-hotkeys-hook'
import { Labels, Nullable } from "../lib/Validation";
import EntryUI from "../components/EntryUI";
import { Annotation, AnnotationContract } from "../../api.ts";
import { useNavigate } from "react-router-dom";
import { userContextType, userContext } from "@/context.ts";
import { ClientInferResponseBody } from "@ts-rest/core";

type assignedAnnotationType = ClientInferResponseBody<typeof AnnotationContract['getAssignedAnnotations'], 200> 
type pastAnnotationType = ClientInferResponseBody<typeof AnnotationContract['getPastAnnotations'], 200>

type Documents = {
    history: pastAnnotationType,
    tasks: assignedAnnotationType 
}

const AnnotationTool = () => {
    const {user} = useContext(userContext) as userContextType;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeEntryIndex, setActiveEntryIndex] = useState<number | null>(null);
    const data = useRef<Documents | null>(null);
    const labelsToSubmit = useRef<Nullable<Labels>>({
        islamic : null,
        hateful : null
    }); 
    const navigate = useNavigate();

    useEffect(() => {
        user ? setIsAuthenticated(true) : navigate("/login");
    }, [])

    function getTasks() {
        if (user) {
            return Annotation.getAssignedAnnotations({
                headers: {
                    authorization: `Bearer ${user.token}`
                },
                query : {
                    take: 10
                }
            }).then(({status, body}) => {
                console.log("tool", status, body);
                return body;
            })
        }
    }
    
    function getHistory() {
        if (user) {
            return Annotation.getPastAnnotations({
                headers: {
                    authorization: `Bearer ${user.token}`
                },
                query : {
                    take: 10
                }
            }).then(({status, body}) => {
                console.log("past annotations", status, body);
                return body;
            })
        }
    }


    useEffect(() => {
        Promise.all([
            getTasks(),
            getHistory()
        ]).then(([tasks, history]) => {
            if (history && tasks) {
                data.current = {
                    history: history,
                    tasks: tasks
                }
                setActiveEntryIndex(-1);
            }
        })
      }, [])

    const onChange = (labels : Nullable<Labels>) => {
        labelsToSubmit.current = labels;
    }

    const checkDisabled = () => {
        return labelsToSubmit.current.hateful === null || labelsToSubmit.current.islamic === null
    }

    const incrementActiveEntryIndex = () => {
        if (data.current && activeEntryIndex != null && activeEntryIndex > -1) {
            console.log("setting index to",activeEntryIndex - 1)
            setActiveEntryIndex(activeEntryIndex - 1);
        }      
    }

    const decrementActiveEntryIndex = () => {
        if (data.current && activeEntryIndex != null && activeEntryIndex < data.current?.history.length-1) {
            console.log("setting index to",activeEntryIndex + 1)
            setActiveEntryIndex(activeEntryIndex + 1);
        }  
    }

    const onSubmit = () => {
        const { hateful, islamic } = labelsToSubmit.current;
        const id = getCurrentEntry()?.id;

        if(hateful === null || islamic === null) 
            alert("cannot submit because null.");
        else{
            if (data.current && user && id) {
                Annotation.submitAnnotation({
                    headers: {
                        authorization: `Bearer ${user.token}`
                    },
                    body: {
                        value: {
                            hateful: hateful,
                            islamic: islamic
                        },
                        id: id
                    } 
                }).then(({status, body}) => {
                    console.log("submit", status, body);
                })
            }
        }
    }

    function getCurrentEntry() {
        if (activeEntryIndex != null) {
            if (activeEntryIndex == -1) {
                return data.current?.tasks[0]
            }
            return data.current?.history[activeEntryIndex]
        }
    }

    useHotkeys('enter', () => console.log(data.current));
    {console.log("re-render", "text: ", getCurrentEntry())} 

    return (
        <div className="container px-6 lg:px-20 mx-auto mt-4">  
            <EntryUI 
                text={getCurrentEntry()?.document.text} 
                id={getCurrentEntry()?.document.id} 
                onChange={onChange}
                onSubmit={onSubmit}
                checkDisabled={checkDisabled}
                incrementActiveEntryIndex={incrementActiveEntryIndex}
                decrementActiveEntryIndex={decrementActiveEntryIndex}
            />
        </div>
     );
}
 
export default AnnotationTool;