import { useCallback, useEffect, useRef, useState } from "react";
import ReactJson from "react-json-view";
import { Document, Page } from "./react-pdf-copy/entry.webpack";
import "./react-pdf-copy/Page/AnnotationLayer.css";
import findIndex from "lodash/findIndex";

const PREFILL = {
  first_name: "John Doe",
  address_1: "MehringDamm 1",
};

function App() {
  const [formValues, setFormValues] = useState();
  const eventListeners = useRef([]);

  const onSuccess = useCallback((annotations) => {
    setFormValues(
      annotations.map((annotation) => ({
        fieldName: annotation.fieldName,
        fieldId: annotation.id,
        fieldType: annotation.fieldType,
        fieldValue: PREFILL[annotation.fieldName] || annotation.fieldValue,
        dimensions: annotation.rect,
      }))
    );

    annotations.forEach(({ id, fieldName }) => {
      const inputEl = document.getElementById(id);

      if (PREFILL[fieldName]) {
        inputEl.value = PREFILL[fieldName];
      }

      const eventListener = (e) => {
        setFormValues((prev) => {
          const oldState = prev;
          const currentFormValueIndex = findIndex(
            oldState,
            (x) => x.fieldId === id
          );
          const currentFormValue = oldState[currentFormValueIndex];
          const newFormValues = oldState.slice();
          newFormValues.splice(currentFormValueIndex, 1, {
            ...currentFormValue,
            fieldValue:
              inputEl.type === "checkbox" ? e.target.checked : e.target.value,
          });
          return newFormValues;
        });
      };

      const eventType = inputEl.type === "checkbox" ? "change" : "input";
      inputEl.addEventListener(eventType, eventListener);
      eventListeners.current = [
        ...eventListeners.current,
        { inputEl, eventType, eventListener },
      ];
    });
  }, []);

  const removeEventListeners = useCallback(() => {
    eventListeners.current.forEach(({ inputEl, eventType, eventListener }) => {
      inputEl.removeEventListener(eventType, eventListener);
    });
  }, []);

  useEffect(() => {
    return () => {
      removeEventListeners();
    };
  }, [removeEventListeners]);

  return (
    <div>
      <button onClick={() => removeEventListeners()}>
        Remove event listeners
      </button>
      <div style={{ display: "flex" }}>
        <Document file={`${window.location.origin}/auform.pdf`}>
          <Page
            pageNumber={1}
            renderInteractiveForms={true}
            onRenderAnnotationLayerSuccess={onSuccess}
          />
        </Document>
        <ReactJson src={formValues} />
      </div>
    </div>
  );
}

export default App;
