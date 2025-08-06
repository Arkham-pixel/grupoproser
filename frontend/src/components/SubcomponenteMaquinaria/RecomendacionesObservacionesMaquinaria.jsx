import React, { useState, useEffect, useRef } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function RecomendacionesObservacionesMaquinaria({ recomendaciones, setRecomendaciones }) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const isMounted = useRef(false);
  const [isClient, setIsClient] = useState(false); // Detecta si ya estamos en el cliente (navegador)

  useEffect(() => {
    isMounted.current = true;
    setIsClient(true);
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    const html = draftToHtml(rawContent);
    if (isMounted.current) {
      setRecomendaciones(html);
    }
  }, [editorState]);

  return (
    <div className="mb-6">
      <h2 className="text-white text-sm font-bold mb-2">4. RECOMENDACIONES Y OBSERVACIONES</h2>
      {isClient && (
        <div className="bg-white rounded p-2">
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            toolbar={{
              options: ["inline", "list", "textAlign", "history"],
              list: { inDropdown: false },
            }}
            editorClassName="px-3 py-2 bg-gray-900 text-white text-xs"
            toolbarClassName="mb-2"
            wrapperClassName="border border-white rounded"
          />
        </div>
      )}
    </div>
  );
}
