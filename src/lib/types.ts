import { ReactNode } from "react";
import { Editor, Range } from "@tiptap/core";

export interface Note {
  _id?: string;
  title: string;
  content: string;
  id: string;
  userId?: string;
  pinned: boolean;
  published?: boolean;
  created?: Date;
  lastSaved: Date;
  type: "local" | "cloud";
  status: "active" | "archived";
  label?: {
    text: string;
    color: string;
  };
  __v?: number;
}

export interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
  searchTerms?: string[];
  command?: (props: { editor: Editor; range: Range }) => void;
}

export interface CommandProps {
  editor: Editor;
  range: Range;
  props: any;
}

export interface CommandListProps {
  items: CommandItemProps[];
  command: any;
  editor: Editor;
  range: Range;
}

export interface PDFFile extends File {
  type: "application/pdf";
}
