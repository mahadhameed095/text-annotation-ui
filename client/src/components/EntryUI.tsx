import { useEffect,  useState } from "react";
import { Labels, Nullable } from "../lib/Validation";
import { useHotkeys } from "react-hotkeys-hook";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { ClientInferResponseBody } from "@ts-rest/core";
import { AnnotationContract } from "api";
import { CheckCheck } from "lucide-react";

type assignedAnnotationTypeArray = ClientInferResponseBody<typeof AnnotationContract['getAssignedAnnotations'], 200> 
type pastAnnotationTypeArray = ClientInferResponseBody<typeof AnnotationContract['getPastAnnotations'], 200>
type UnwrapArray<T> = T extends (infer U)[] ? U : T;

type assignedAnnotationType = UnwrapArray<assignedAnnotationTypeArray>;
type pastAnnotationType = UnwrapArray<pastAnnotationTypeArray>;

export default function EntryUI({ 
    entry,
    onChange,
    onSubmit,
    incrementActiveEntryIndex,
    decrementActiveEntryIndex,
    checkDisabled
} : { 
    entry : assignedAnnotationType | pastAnnotationType,
    onChange : (labels : Nullable<Labels>) => void;
    onSubmit : () => void;
    incrementActiveEntryIndex : () => void;
    decrementActiveEntryIndex : () => void;
    checkDisabled : () => boolean;
}){
    const [labels, setlabels] = useState<Nullable<Labels>>({
        islamic : null,
        hateful : null
    });
    
    useEffect(() => {
        let newLabels;
        if ("value" in entry) {
            newLabels = {
                hateful: entry.value["hateful"],
                islamic: entry.value["islamic"],
            }
        }
        else {
            newLabels = {
                islamic : null,
                hateful : null
            }       
        }
        setlabels(newLabels);
        onChange(newLabels);     
    }, [entry])

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
    <div className="sm:flex sm:space-x-3">
        <Card className="basis-3/4">
            <CardHeader>
                <div className="flex items-center">
                    <Button variant="ghost" onClick={decrementActiveEntryIndex}>
                        &lt;
                    </Button>
                    <h1 className="uppercase font-bold text-lg">Task #{entry.id}</h1>
                    <Button variant="ghost" onClick={incrementActiveEntryIndex}>
                        &gt;
                    </Button>
                    { "value" in entry &&
                        <>
                            <CheckCheck color="#087500" />
                            <p className="text-green-800 font-bold">Annotated</p>
                        </>
                    }
                </div>
            </CardHeader>
            <CardContent>
                <p className="max-h-[calc(100vh-200px)] sm:max-h-[calc(95vh-200px)] overflow-y-auto">{entry.document.text}</p>
            </CardContent>
        </Card>


        <Card className="basis-1/4 mt-4 sm:mt-0">
            <CardHeader>
                <h1 className="uppercase font-bold text-lg">Annotation</h1>
            </CardHeader>
            <CardContent className="">
                <h2 className="font-semibold text-md mb-2">Religion</h2>
                <div className="space-y-2">
                    <div>
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
                    </div>
                    <div>
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
                </div>

                <h2 className="pt-4 font-semibold text-md mb-2 mt-4">Tone</h2>
                <div className="space-y-2">
                    <div>
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
                    </div>
                    <div>
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
                <button
                    className="mt-8 p-2 uppercase rounded-md text-sm bg-slate-900 text-white font-semibold"
                    disabled={checkDisabled()}
                    onClick={onSubmit}
                >
                    Submit <span>[enter]</span>
                </button>
            </CardContent>
        </Card>
    </div>
);
}