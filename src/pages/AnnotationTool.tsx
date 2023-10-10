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
        <div className="px-8 xl:px-16 container mx-auto mt-6">  
            <EntryUI 
                entry={{
                    id : "1023",
                    text : data,
                }} 
                onChange={onChange}
            />
            <div className="space-x-2 mx-auto flex justify-center">
                <button
                    className="mt-8 p-2 uppercase rounded-md text-sm bg-slate-900 text-white font-semibold"
                >&lt;&lt;</button>
                <button
                    className="mt-8 p-2 uppercase rounded-md text-sm bg-slate-900 text-white font-semibold"
                    disabled={labelsToSubmit.current.hateful === null || labelsToSubmit.current.islamic === null}
                    onClick={onSubmit}
                >
                    Submit <span>[enter]</span>
                </button>
                <button
                    className="mt-8 p-2 uppercase rounded-md text-sm bg-slate-900 text-white font-semibold"
                >&gt;&gt;</button>
            </div>
        </div>
     );
}
 
export default AnnotationTool;