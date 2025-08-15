"use client"

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function TipTap() {

    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Hello World!</p>',
        immediatelyRender: false
    });

  return <EditorContent editor={editor} />
}