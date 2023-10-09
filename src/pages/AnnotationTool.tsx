import { useState } from "react"
import { useHotkeys } from 'react-hotkeys-hook'
import { db } from "../../firebase-config";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

type Labels = { 
    islamic : boolean; 
    hateful : boolean;
};

type Annotation = {
    labels : Labels;
    timestamp : Date;
    annotator : string;
}

type Assignment = {
    anotator : string;
    timestamp : Date;
}

type BaseEntry = {
    id : string;
    document : string;
};

type Nullable<T> = {
    [K in keyof T] : null | T[K]
};

type AnnotatedEntry = BaseEntry & { annotation : Annotation };
type AssignedEntry =  BaseEntry & { assignment : Assignment };
type Entry = AssignedEntry | AnnotatedEntry;

const data = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.";

const AnnotationTool = () => {

    const [annotation, setannotation] = useState<Nullable<Labels>>({
        islamic : null,
        hateful : null
    });

    const onChangeHandler = (key : keyof Labels, value : boolean) => {
        return () => {
            const newAnnotation = {
               ...annotation,
                [key] : value,
            };
            setannotation(newAnnotation);
        };
    }
    
    const onSubmit = () => {
    /* send the annotation and some uuid */
        if(annotation.hateful === null || annotation.islamic === null) 
            alert("cannot submit because null.");
        else
            alert(JSON.stringify(annotation));
    }

    useHotkeys('enter', onSubmit);
    useHotkeys('1', onChangeHandler('islamic', true));
    useHotkeys('2', onChangeHandler('islamic', false));
    useHotkeys('3', onChangeHandler('hateful', true));
    useHotkeys('4', onChangeHandler('hateful', false));

    return ( 
        <div className="md:px-8 xl:px-16 container mx-auto sm:mt-6">  
            <div className="rounded-md shadow-lg">
            <div className="rounded-lg shadow-md border p-4">
                <h1 className="uppercase font-bold text-lg my-3">Text</h1>
                <p className="my-2 max-h-[40vh] overflow-y-auto">{data}</p>
            </div>
    
            <div className="shadow-md p-4">
                <h1 className="uppercase font-bold text-lg my-4">Annotation</h1>
    
                <h2 className="font-semibold text-md mb-1">Religion</h2>
                <div className="pl-4 space-x-3">
                <label>
                    <input
              
                    type="radio"
                    name="religious-belief"
                    value="islamic"
                    checked={annotation.islamic === true}
                    onChange={onChangeHandler('islamic', true)}
                    />
                    Islamic <span>[1]</span>
                </label>
                <label>
                    <input
                    type="radio"
                    name="religious-belief"
                    value="non-islamic"
                    checked={annotation.islamic === false}
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
                    checked={annotation.hateful === true}
                    onChange={onChangeHandler('hateful', true)}
                    />
                    Hateful <span>[3]</span>
                </label>
                <label>
                    <input
                    type="radio"
                    name="tone-of-speech"
                    value="not-hateful"
                    checked={annotation.hateful === false}
                    onChange={onChangeHandler('hateful', false)}
                    />
                    Not Hateful <span>[4]</span>
                </label>
                </div>
                <button
                className="mt-8 p-2 uppercase rounded-md text-sm bg-slate-900 text-white"
                disabled={annotation.hateful === null || annotation.islamic === null}
                onClick={onSubmit}
                >
                    Submit <span>[enter]</span>
                </button>
            </div>
            </div>
        </div>
     );
}
 
export default AnnotationTool;