import { useEffect, useState } from "react";
import { Entry, IsAnnotatedEntry, Labels, Nullable } from "../lib/Validation";
import { useHotkeys } from "react-hotkeys-hook";

export default function EntryUI({ 
    entry,
    onChange,
} : { 
    entry : Entry,
    onChange : (labels : Nullable<Labels>) => void;
}){
    const [labels, setlabels] = useState<Nullable<Labels>>({
        islamic : null,
        hateful : null
    });
    
    useEffect(()=> {
        if(IsAnnotatedEntry(entry)) setlabels(entry.annotation.labels);
    }, [entry]);
    
    const onChangeHandler = (key : keyof Labels, value : boolean) => {
        return () => {
            const newLabels = {
               ...labels,
                [key] : value,
            };
            setlabels(newLabels);
            onChange(newLabels);
        };
    }

    useHotkeys('1', onChangeHandler('islamic', true));
    useHotkeys('2', onChangeHandler('islamic', false));
    useHotkeys('3', onChangeHandler('hateful', true));
    useHotkeys('4', onChangeHandler('hateful', false));
    
    return (
    <>

        <div className="rounded-lg shadow-md border p-4">
            <h1 className="uppercase font-bold text-lg my-3">Text #{entry.id}</h1>
            <p className="my-2 max-h-[40vh] overflow-y-auto">{entry.text}</p>
        </div>

        <div className="rounded-lg shadow-md border p-4 mt-1">
            <h1 className="uppercase font-bold text-lg my-4">Annotation</h1>
            <h2 className="font-semibold text-md mb-1">Religion</h2>
            <div className="pl-4 space-x-3">
                <label>
                    <input    
                        type="radio"
                        name="religious-belief"
                        value="islamic"
                        checked={labels?.islamic === true}
                        onChange={onChangeHandler('islamic', true)}
                    />
                    Islamic <span>[1]</span>
                </label>
                <label>
                    <input
                        type="radio"
                        name="religious-belief"
                        value="non-islamic"
                        checked={labels?.islamic === false}
                        onChange={onChangeHandler('islamic', false)}
                    />
                    Non Islamic <span>[2]</span>
                </label>
            </div>

            <h2 className="pt-4 font-semibold text-md mb-1">Tone</h2>
            <div className="pl-4 space-x-2">
                <label>
                    <input
                        type="radio"
                        name="tone-of-speech"
                        value="hateful"
                        checked={labels?.hateful === true}
                        onChange={onChangeHandler('hateful', true)}
                    />
                    Hateful <span>[3]</span>
                </label>
                <label>
                    <input
                        type="radio"
                        name="tone-of-speech"
                        value="not-hateful"
                        checked={labels?.hateful === false}
                        onChange={onChangeHandler('hateful', false)}
                    />
                    Not Hateful <span>[4]</span>
                </label>
            </div>
        </div>
    </>
);
}