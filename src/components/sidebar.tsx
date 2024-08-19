"use client";

import UserSettingsModal from "./user-settings-modal";
import { Note } from "../lib/types";
import NewNoteForm from "./new-note-form";
import SidebarNotes from "./sidebar-notes";

export default function Sidebar({ notes }: { notes: Note[] }) {
  return (
    <div className="rounded-r-sm border-r flex flex-col justify-between w-full h-[calc(100vh)]">
      <div className="flex flex-col space-y-2 w-full items-center justify-between px-5 pt-5">
        <div className="flex w-full justify-between items-center space-x-2">
          <h1 className="font-bold">Notes</h1>
        </div>
        <NewNoteForm />
        <SidebarNotes notes={notes} />
      </div>
      <div className="px-5 pb-5">
        <UserSettingsModal />
      </div>
    </div>
  );
}
