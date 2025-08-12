"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Heading from "@tiptap/extension-heading";
import { Toggle } from "@/components/ui/toggle";

export default function TipTap() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Document,
      Paragraph,
      Text,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: "<p>Hello World!</p>",
    immediatelyRender: false,
    autofocus: true,
    editorProps: {
      attributes: {
        class: "bg-muted rounded p-2 min-h-[20rem] border",
      },
    },
  });

  return (
    <div>
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Menubar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <div className="space-x-2">
      <Toggle
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className="cursor-pointer"
      >
        H1
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className="cursor-pointer"
      >
        H2
      </Toggle>
      <Toggle
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="cursor-pointer"
      >
        Bold
      </Toggle>
    </div>
  );
}
