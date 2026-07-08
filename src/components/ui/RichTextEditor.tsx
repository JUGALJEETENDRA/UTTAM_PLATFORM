"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const options = useMemo(() => {
    return {
      autofocus: false,
      spellChecker: false,
      status: false,
      placeholder: "Write your lesson content here using Markdown...",
      toolbar: [
        "bold",
        "italic",
        "strikethrough",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "table",
        "|",
        "preview",
        "side-by-side",
        "fullscreen",
        "|",
        "guide",
      ],
    } as any;
  }, []);

  return (
    <div className="w-full relative editor-container">
      <SimpleMdeReact
        value={value}
        onChange={onChange}
        options={options}
      />
      <style jsx global>{`
        .editor-container .editor-toolbar {
          border-color: #e4e4e7;
          border-radius: 0.375rem 0.375rem 0 0;
          background-color: #f8fafc;
        }
        .editor-container .CodeMirror {
          border-color: #e4e4e7;
          border-radius: 0 0 0.375rem 0.375rem;
          min-height: 300px;
          font-family: inherit;
        }
        .editor-container .editor-toolbar a.active, 
        .editor-container .editor-toolbar a:hover {
          background-color: #e2e8f0;
          border-color: #cbd5e1;
        }
      `}</style>
    </div>
  );
}

export default RichTextEditor;
