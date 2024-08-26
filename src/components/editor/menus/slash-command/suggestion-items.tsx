import { CommandProps } from "../../../../lib/types";
import { toast } from "sonner";
import {
  Sparkle,
  TextAa,
  CheckSquare,
  TextHOne,
  TextHTwo,
  TextHThree,
  ListNumbers,
  ListBullets,
  Code,
  Quotes,
  Image,
  Article,
} from "@phosphor-icons/react";

import { upload } from "@vercel/blob/client";

export default function getSuggestionItems({ query }: { query: string }) {
  return [
    {
      title: "AI Writer",
      description: "Prompt your next paragraph.",
      searchTerms: ["gpt", "ai", "prompt"],
      icon: <Article size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).setAiWriter().run();
      },
    },
    {
      title: "Text",
      description: "Just start typing with plain text.",
      searchTerms: ["p", "paragraph"],
      icon: <TextAa size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .run();
      },
    },
    {
      title: "To-do List",
      description: "Track tasks with a to-do list.",
      searchTerms: ["todo", "task", "list", "check", "checkbox"],
      icon: <CheckSquare size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: "Heading 1",
      description: "Big section heading.",
      searchTerms: ["title", "big", "large"],
      icon: <TextHOne size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: "Heading 2",
      description: "Medium section heading.",
      searchTerms: ["subtitle", "medium"],
      icon: <TextHTwo size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: "Heading 3",
      description: "Small section heading.",
      searchTerms: ["subtitle", "small"],
      icon: <TextHThree size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      },
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list.",
      searchTerms: ["unordered", "point"],
      icon: <ListBullets size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: "Numbered List",
      description: "Create a list with numbering.",
      searchTerms: ["ordered"],
      icon: <ListNumbers size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: "Quote",
      description: "Capture a quote.",
      searchTerms: ["blockquote"],
      icon: <Quotes size={18} />,
      command: ({ editor, range }: CommandProps) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run(),
    },
    {
      title: "Code",
      description: "Capture a code snippet.",
      searchTerms: ["codeblock"],
      icon: <Code size={18} />,
      command: ({ editor, range }: CommandProps) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: "Image",
      description: "Add a local image.",
      searchTerms: ["image", "img"],
      icon: <Image size={18} />,
      command: async ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/gif, image/png, image/jpeg";
        input.onchange = async () => {
          if (input.files?.length) {
            const file = input.files[0];
            try {
              const newBlob = await upload(file.name, file, {
                access: "public",
                handleUploadUrl: "/api/images/upload",
              });
              if (newBlob) {
                editor.chain().setImage({ src: newBlob.url }).run();
                const imageNode = editor.$node("image");
                if (imageNode) {
                  const imagePos = imageNode.pos;
                  editor.commands.insertContentAt(imagePos + 1, "<br />");
                }
              }
            } catch (error) {
              toast.error("Error uploading Image.");
            }
          }
        };
        input.click();
      },
    },
  ].filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        (item.searchTerms &&
          item.searchTerms.some((term: string) => term.includes(search)))
      );
    }
    return true;
  });
}
