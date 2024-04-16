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
