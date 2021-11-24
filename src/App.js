import { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { Document, Page } from "./react-pdf-copy/entry.webpack";
import "./react-pdf-copy/Page/AnnotationLayer.css";

function App() {
  const [annotations, setAnnotations] = useState();
  const [formValues, setFormValues] = useState();

  useEffect(() => {
    if (!annotations) return;
    setFormValues(
      annotations.map((annotation) => ({
        fieldName: annotation.fieldName,
        fieldId: annotation.id,
        fieldType: annotation.fieldType,
        fieldValue: annotation.fieldValue,
        dimensions: annotation.rect,
      }))
    );
  }, [annotations]);

  useEffect(() => {
    if (!annotations) return;
    annotations.forEach(({ id }) => {
      const inputEl = document.getElementById(id);
      console.log(inputEl);

      inputEl.addEventListener("input", (e) => {
        console.log("foo"); // THIS EVENT LISTENER IS NOT BEING ATTACHED :(((
        setFormValues((prev) => {
          const currentFormValueIndex = prev.indexOf((x) => x.id === id);
          const currentFormValue = prev[currentFormValueIndex];
          const newFormValues = prev.slice().splice(1, currentFormValueIndex, {
            ...currentFormValue,
            fieldValue: e.target.value,
          });
          return newFormValues;
        });
      });
    });
  }, [annotations]);

  return (
    <div style={{ display: "flex" }}>
      <Document file={`${window.location.origin}/auform.pdf`}>
        <Page
          pageNumber={1}
          renderInteractiveForms={true}
          onGetAnnotationsSuccess={(annotations) => setAnnotations(annotations)}
          onAnnotationsChange={() => console.log("hello")}
        />
      </Document>
      <ReactJson src={formValues} collapsed={true} />
    </div>
  );
}

export default App;
