import {useEffect, useState} from 'react';
import ReactJson from "react-json-view";
import {Document, Page} from "./react-pdf-copy/entry.webpack";
import './react-pdf-copy/Page/AnnotationLayer.css'

function App() {
  const [annotations, setAnnotations] = useState()
  const [formValues, setFormValues] =useState()

    useEffect(() => {
        if(!annotations) return
        setFormValues(annotations.map((annotation)=>({
            fieldName:annotation.fieldName,
            fieldId:annotation.id,
            fieldType:annotation.fieldType,
            fieldValue:annotation.fieldValue,
            dimensions: annotation.rect
        })))
    }, [annotations]);





  return (
      <div style={{display:'flex'}}>
        <Document
            file={`${window.location.origin}/auform.pdf`}
        >
          <Page pageNumber={1} renderInteractiveForms={true} onGetAnnotationsSuccess={(annotations)=>setAnnotations(annotations)}/>
        </Document>
          <ReactJson src={formValues} collapsed={true}/>
      </div>
  );
}

export default App