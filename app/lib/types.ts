export interface Note {
  _id?: string;
  title: string;
  content: string;
  id: string;
  userId?: string;
  pinned: boolean;
  created?: string;
  lastSaved: Date;
  type: 'local' | 'cloud';
  status: 'active' | 'archived';
  __v?: number;
}
