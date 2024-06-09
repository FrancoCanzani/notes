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
  type: 'local' | 'cloud';
  status: 'active' | 'archived';
  label?: {
    text: string;
    color: string;
  };
  __v?: number;
}

export interface Weblink {
  title?: string;
  description?: string;
  image?: string;
  id: string;
  url: string;
  created?: Date;
  userId: string;
  pinned?: boolean;
  label?: {
    text: string;
    color: string;
  };
}

export interface Todo {
  id: string;
  title: string;
  created: Date;
  dueDate?: Date;
  userId: string;
  pinned: boolean;
  completed: boolean;
}
