import { useContext, useEffect, useRef, useState } from "react"
import { useHotkeys } from 'react-hotkeys-hook'
import { Labels, Nullable } from "../lib/Validation";
import EntryUI from "../components/EntryUI";
import { Annotation, AnnotationContract } from "../../api.ts";
import { useNavigate } from "react-router-dom";
import { userContextType, userContext } from "@/context.ts";
import { ClientInferResponseBody } from "@ts-rest/core";

type documentType = ClientInferResponseBody<typeof AnnotationContract['getAssignedAnnotations'], 200> 

const AnnotationTool = () => {
    const {user} = useContext(userContext) as userContextType;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [data, setData] = useState<documentType | null>(null);
    const labelsToSubmit = useRef<Nullable<Labels>>({
        islamic : null,
        hateful : null
    }); 
    const navigate = useNavigate();

    useEffect(() => {
        user ? setIsAuthenticated(true) : navigate("/login");
    }, [])

    useEffect(() => {
        if (user) {
            Annotation.getAssignedAnnotations({
                headers: {
                    authorization: `Bearer ${user.token}`
                },
                query : {
                    take: 10
                }
            }).then(({status, body}) => {
                console.log("tool", status, body);
                setData(body);
            })
        }
    }, [])
    
    const onChange = (labels : Nullable<Labels>) => {
        labelsToSubmit.current = labels;
    }

    const checkDisabled = () => {
        return labelsToSubmit.current.hateful === null || labelsToSubmit.current.islamic === null
    }

    const onSubmit = () => {
        const { hateful, islamic } = labelsToSubmit.current;
        if(hateful === null || islamic === null) 
            alert("cannot submit because null.");
        else{
            alert(JSON.stringify({ hateful, islamic }));
        }
    }

    useHotkeys('enter', onSubmit);
    return ( 
        <div className="container px-6 lg:px-20 mx-auto mt-4">  
            <EntryUI 
                entry={data} 
                onChange={onChange}
                onSubmit={onSubmit}
                checkDisabled={checkDisabled}
            />
        </div>
     );
}
 
export default AnnotationTool;