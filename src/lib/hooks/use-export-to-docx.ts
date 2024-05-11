import { useCallback } from 'react';
import {
  writeDocx,
  DocxSerializer,
  defaultNodes,
  defaultMarks,
} from 'prosemirror-docx';
import { saveAs } from 'file-saver';
import { Editor, Node } from '@tiptap/core';
import { toast } from 'sonner';

const nodeSerializer = {
  ...defaultNodes,
  hardBreak: defaultNodes.hard_break,
  codeBlock: defaultNodes.code_block,
  orderedList: defaultNodes.ordered_list,
  listItem: defaultNodes.list_item,
  bulletList: defaultNodes.bullet_list,
  horizontalRule: defaultNodes.horizontal_rule,
  //@ts-ignore
  image(state, node) {
    state.closeBlock(node);
  },
};

const docxSerializer = new DocxSerializer(nodeSerializer, defaultMarks);

export function useExportToDocx(editor: Editor) {
  return useCallback(async () => {
    try {
      const opts = {
        getImageBuffer: (src: string) => Buffer.from('Real buffer here'),
      };

      const wordDocument = docxSerializer.serialize(editor.state.doc, opts);

      await writeDocx(wordDocument, (buffer) => {
        saveAs(new Blob([buffer]), 'quickNotes.docx');
      });
    } catch (error) {
      toast.error('Error exporting to docx');
    }
  }, [editor?.state.doc]);
}
