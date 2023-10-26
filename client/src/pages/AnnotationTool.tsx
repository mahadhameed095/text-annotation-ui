import { useContext, useEffect, useRef, useState } from "react"
import { useHotkeys } from 'react-hotkeys-hook'
import { Labels, Nullable } from "../lib/Validation";
import EntryUI from "../components/EntryUI";
import { Annotation, AnnotationContract } from "../../api.ts";
import { useNavigate } from "react-router-dom";
import { userContextType, userContext } from "@/context.ts";
import { ClientInferResponseBody } from "@ts-rest/core";

type assignedAnnotationTypeArray = ClientInferResponseBody<typeof AnnotationContract['getAssignedAnnotations'], 200> 
type pastAnnotationTypeArray = ClientInferResponseBody<typeof AnnotationContract['getPastAnnotations'], 200>
type UnwrapArray<T> = T extends (infer U)[] ? U : T;

type assignedAnnotationType = UnwrapArray<assignedAnnotationTypeArray>;
type pastAnnotationType = UnwrapArray<pastAnnotationTypeArray>;


const AnnotationTool = () => {
    const {user} = useContext(userContext) as userContextType;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeEntryIndex, setActiveEntryIndex] = useState<number | null>(null);
    const data = useRef<(assignedAnnotationType | pastAnnotationType)[]>([]);
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
                data.current = history.reverse()
                data.current = data.current.concat(tasks)
                setActiveEntryIndex(10);
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
        if (data.current && activeEntryIndex != null) {
            if ("value" in data.current[activeEntryIndex]) {
                setActiveEntryIndex(activeEntryIndex + 1);
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

        if(hateful === null || islamic === null) 
            alert("cannot submit because null.");
        else{
            if (data.current && user && activeEntryIndex) {
                Annotation.submitAnnotation({
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
                        data.current[activeEntryIndex].value = {
                            hateful: hateful,
                            islamic: islamic
                        }
                        incrementActiveEntryIndex();
                    }
                })
            }
        }
    }

    useHotkeys('enter', onSubmit);

    return (
        <div className="container px-6 lg:px-20 mx-auto mt-4">  
        {data.current && activeEntryIndex != null &&
            <EntryUI 
                entry={data.current[activeEntryIndex]} 
                onChange={onChange}
                onSubmit={onSubmit}
                checkDisabled={checkDisabled}
                incrementActiveEntryIndex={incrementActiveEntryIndex}
                decrementActiveEntryIndex={decrementActiveEntryIndex}
            />
        }
        </div>
     );
}
 
export default AnnotationTool;