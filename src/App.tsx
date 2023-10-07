import { useState } from "react"
import { useHotkeys } from 'react-hotkeys-hook'

type Annotation = {
  islamic : boolean | null;
  hateful : boolean | null;
}
const data = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac fringilla elit. Proin dapibus lorem nec justo tristique, sed aliquet justo ullamcorper.";
export default function App() {
  const [annotation, setannotation] = useState<Annotation>({
    islamic : null,
    hateful : null
  });

  const onChangeHandler = (key : keyof Annotation, value : boolean) => {
    return () => {
      const newAnnotation : Annotation = {
        ...annotation,
        [key] : value,
      };
      setannotation(newAnnotation);
    };
  }

  const onSubmit = () => {
    /* send the annotation and some uuid */
    if(annotation.hateful === null || annotation.islamic === null) alert("cannot submit because null.");
    alert(JSON.stringify(annotation));
  }

  useHotkeys('enter', onSubmit);
  useHotkeys('1', onChangeHandler('islamic', true));
  useHotkeys('2', onChangeHandler('islamic', false));
  useHotkeys('3', onChangeHandler('hateful', true));
  useHotkeys('4', onChangeHandler('hateful', false));
  return (
    <div className="px-16 container mx-auto mt-5">  
      <div className="rounded-md shadow-lg">
        <div className="rounded-lg shadow-md border p-4">
          <h1 className="uppercase font-bold text-lg my-3">Text</h1>
          <p className="my-3 max-h-[40vh] overflow-y-auto">{data}</p>
        </div>

        <div className="shadow-md space-y-3 p-4">
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

          <h2 className="font-semibold text-md mb-1">Tone</h2>
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
            className="my-2 p-2 uppercase rounded-md text-sm bg-slate-900 text-white"
            disabled={annotation.hateful === null || annotation.islamic === null}
            onClick={onSubmit}
          >
              Submit <span>[enter]</span>
          </button>
        </div>
      </div>
    </div>
  )
}