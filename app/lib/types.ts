export interface Note {
  _id?: string;
  title: string;
  content: string;
  id: string;
  userId?: string;
  pinned: boolean;
  created: string;
  lastSaved: string;
  type: 'local' | 'cloud';
  __v?: number;
}
