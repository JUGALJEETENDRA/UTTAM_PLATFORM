import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Strikethrough, List, ListOrdered, Heading1, Heading2, Quote } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Markdown,
      Placeholder.configure({
        placeholder: "Write your lesson content here... (Use markdown shortcuts like # or * for lists)",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        className: "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[300px] px-4 py-3 bg-white border border-zinc-200 rounded-b-md shadow-inner",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const toggleClass = (isActive: boolean) => isActive ? "bg-zinc-200" : "bg-transparent";

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-wrap items-center gap-1 bg-zinc-50 border border-zinc-200 border-b-0 p-2 rounded-t-md">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${toggleClass(editor.isActive("bold"))}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Toggle bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${toggleClass(editor.isActive("italic"))}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Toggle italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${toggleClass(editor.isActive("strike"))}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Toggle strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-zinc-200 mx-1"></div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${toggleClass(editor.isActive("heading", { level: 1 }))}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          aria-label="Toggle heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${toggleClass(editor.isActive("heading", { level: 2 }))}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          aria-label="Toggle heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-zinc-200 mx-1"></div>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${toggleClass(editor.isActive("bulletList"))}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Toggle bullet list"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${toggleClass(editor.isActive("orderedList"))}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Toggle ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={`h-8 w-8 p-0 ${toggleClass(editor.isActive("blockquote"))}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Toggle blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>
      </div>
      
      <EditorContent editor={editor} />
    </div>
  );
}

export default RichTextEditor;
