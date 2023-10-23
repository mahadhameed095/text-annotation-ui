import { useRef, useState } from "react"
import { useHotkeys } from 'react-hotkeys-hook'
import { Entry, Labels, Nullable } from "../lib/Validation";
import EntryUI from "../components/EntryUI";
import { auth } from "../../firebase-config";
import { entryManager } from "../lib/EntryManager";

const data = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.";

const AnnotationTool = () => {
    const entries= useRef<Entry[]>([]);
    const [activeEntryIndex, setActiveEntryIndex] = useState<number>();
    const labelsToSubmit = useRef<Nullable<Labels>>({
        islamic : null,
        hateful : null
    }); 

    const fetchEntries = async () => {
        if(!auth.currentUser) return;
        const annotatorId = auth.currentUser.uid;
        try {
            /* All past entries */
            const annotatedEntries = await entryManager.GetAnnotatedEntries(annotatorId);
            
            /* All assigned entries that have not been annotated yet */
            const assignedEntries = await entryManager.GetAssignedEntries(annotatorId);
            
            if(assignedEntries.length === 0) 
                assignedEntries.push(...(await entryManager.PullEntries(annotatorId, 2)))
            
            if(assignedEntries.length === 0) alert("Couldnt pull any entries");
            
            entries.current = [...annotatedEntries, ...assignedEntries];
            setActiveEntryIndex(annotatedEntries.length);
        } catch (error) {
          console.error('Error fetching entries:', error);
        }
    };
    
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
                entry={{
                    id : "1023",
                    text : data,
                }} 
                onChange={onChange}
                onSubmit={onSubmit}
                checkDisabled={checkDisabled}
            />
        </div>
     );
}
 
export default AnnotationTool;