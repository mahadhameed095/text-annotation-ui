import { useEffect,  useRef,  useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { ClientInferResponseBody } from "@ts-rest/core";
import { AnnotationContract, Labels } from "api";
import { CheckCheck } from "lucide-react";
import { Nullable } from "@/lib/utils";
import Spinner from "./Spinner";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'

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
    onSubmit : () => Promise<void> | undefined;
    incrementActiveEntryIndex : () => void;
    decrementActiveEntryIndex : () => void;
    checkDisabled : () => boolean;
}){
    const [labels, setlabels] = useState<Nullable<Labels>>({
        islamic : null,
        hateful : null
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { width, height } = useWindowSize();
    let count = useRef<number>(0);
    
    useEffect(() => {
        let newLabels;
        if ("value" in entry) {
            newLabels = {
                hateful: (entry.value as any)["hateful"],
                islamic: (entry.value as any)["islamic"],
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

    const celebrate = () => {
        if (count.current % 5 === 0) {
            return(
                <Confetti
                width={width}
                height={height}
                recycle={false}
                />
            )
        }
    }

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

    const onClick = () => {
        setIsLoading(true);
        onSubmit()!.then(() => {
            count.current = count.current + 1;
            celebrate();
            setIsLoading(false);
        })
    }

    useHotkeys('1', onChangeHandler('islamic', true));
    useHotkeys('2', onChangeHandler('islamic', false));
    useHotkeys('3', onChangeHandler('hateful', true));
    useHotkeys('4', onChangeHandler('hateful', false));
    
    return (    
    <div className="sm:flex sm:space-x-3">
        {celebrate()}
        <Card className="basis-3/4">
            <CardHeader>
                <div className="sm:flex items-center">
                    <div className="flex items-center px-1">
                        <Button variant="ghost" onClick={decrementActiveEntryIndex}>
                            &lt;&lt;
                        </Button>
                        <h1 className="uppercase font-bold text-lg w-32 text-center">Task #{entry.id}</h1>
                        <Button variant="ghost" onClick={incrementActiveEntryIndex}>
                            &gt;&gt;
                        </Button>
                    </div>
                    { "value" in entry &&
                        <div className="flex text-center">
                            <CheckCheck color="#087500" />
                            <p className="text-green-800 font-bold">Annotated</p>
                        </div>
                    } 
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? 
                Spinner({className:"w-8 my-8 mx-auto"})
                : 
                <p className="max-h-[calc(100vh-200px)] sm:max-h-[calc(95vh-200px)] overflow-y-auto">{entry.document.text}</p>
                }
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
                    onClick={onClick}
                >
                    Submit <span>[enter]</span>
                </button>
            </CardContent>
        </Card>
    </div>
);
}