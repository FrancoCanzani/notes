import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "prosemirror-state";
import { TextSelection } from "prosemirror-state";

export const ContinueWriting = Extension.create({
  name: "continueWriting",

  addOptions() {
    return {
      completion: {
        complete: async () => {},
        completion: null,
        error: null,
        setCompletion: () => {},
        setInput: () => {},
        handleSubmit: () => {},
        input: "",
        isLoading: false,
        stop: () => {},
      },
    };
  },

  addProseMirrorPlugins() {
    const { completion } = this.options;

    return [
      new Plugin({
        key: new PluginKey("continueWriting"),
        props: {
          handleKeyDown: (view, event) => {
            if (
              event.key === "+" &&
              view.state.selection instanceof TextSelection &&
              view.state.selection.empty
            ) {
              const { state, dispatch } = view;
              const { selection } = state;
              const pos = (selection as TextSelection).$cursor?.pos;

              if (pos !== undefined && pos > 1) {
                const prevChar = state.doc.textBetween(pos - 1, pos);

                if (prevChar === "+") {
                  // Remove the '++'
                  dispatch(state.tr.delete(pos - 2, pos));

                  // Get the previous text
                  const prevText = state.doc.textBetween(
                    Math.max(0, pos - 1000),
                    pos - 2
                  );

                  // Trigger AI completion
                  completion.complete(prevText, {
                    body: { option: "continue" },
                  });

                  return true;
                }
              }
            }
            return false;
          },
        },
      }),
    ];
  },
});
