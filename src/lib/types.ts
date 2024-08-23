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
  folderId?: string | null;
  __v?: number;
}

export interface Folder {
  _id?: string;
  name: string;
  userId: string;
  created?: Date;
  parentFolderId?: string | null;
  __v?: number;
}
