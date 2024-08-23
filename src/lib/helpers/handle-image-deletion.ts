import { Node } from "@tiptap/pm/model";
import { Editor as CoreEditor } from "@tiptap/core";
import { EditorState } from "prosemirror-state";
import { useRef, useCallback } from "react";

// Function to delete image from blob database
async function deleteImageFromBlob(url: string) {
  try {
    const response = await fetch(
      `/api/images/delete?url=${encodeURIComponent(url)}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to delete image from blob");
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}

// Helper function to handle image deletion
export function createHandleImageDeletion() {
  const previousState = useRef<EditorState | null>(null);

  const onNodeDeleted = useCallback((node: Node) => {
    if (node.type.name === "image" && node.attrs.src) {
      deleteImageFromBlob(node.attrs.src);
    }
  }, []);

  const handleImageDeletion = useCallback(
    ({ editor }: { editor: CoreEditor }) => {
      const prevNodesById: Record<string, Node> = {};
      previousState.current?.doc.forEach((node) => {
        if (node.attrs.id) {
          prevNodesById[node.attrs.id] = node;
        }
      });

      const nodesById: Record<string, Node> = {};
      editor.state.doc.forEach((node) => {
        if (node.attrs.id) {
          nodesById[node.attrs.id] = node;
        }
      });

      for (const [id, node] of Object.entries(prevNodesById)) {
        if (nodesById[id] === undefined) {
          onNodeDeleted(node);
        }
      }

      previousState.current = editor.state;
    },
    []
  );

  return handleImageDeletion;
}
