import React, { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Note } from "../../lib/types";
import NewNoteForm from "../forms/new-note-form";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "../../lib/utils";
import SidebarNoteOptions from "./sidebar-note-options";
import { DrawingPinFilledIcon, FileIcon } from "@radix-ui/react-icons";
import SearchNotesForm from "../forms/search-notes-form";

export default function SidebarNotes({
  notes,
  isNoteFormVisible,
  isSearchFormVisible,
}: {
  notes: Note[];
  isNoteFormVisible: boolean;
  isSearchFormVisible: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const pathname = usePathname();

  const pinnedNotes = notes?.filter((note: Note) => note.pinned === true) || [];
  const activeNotes =
    notes?.filter((note: Note) => note.status === "active" && !note.pinned) ||
    [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredNotes = [...pinnedNotes, ...activeNotes].filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col">
      <ScrollArea className="h-[450px] w-full text-sm rounded-sm border p-1">
        {isNoteFormVisible && <NewNoteForm />}
        {isSearchFormVisible && <SearchNotesForm onSearch={handleSearch} />}
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Link href={`/notes/${note.id}`} key={note._id}>
              <div
                className={cn(
                  "p-1.5 group my-1 bg-bermuda-gray-50 rounded-sm text-sm w-full flex-col items-center justify-between hover:bg-bermuda-gray-200",
                  pathname.includes(note.id) &&
                    "bg-bermuda-gray-200 font-semibold"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center w-auto justify-start gap-x-2">
                    {note.pinned ? <DrawingPinFilledIcon /> : <FileIcon />}
                    <p title={note.title} className="truncate max-w-44 pr-2">
                      {note.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-end gap-x-1">
                    <SidebarNoteOptions
                      note={note}
                      className="invisible group-hover:visible"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="h-[450px] w-full flex items-center justify-center text-bermuda-gray-950 font-medium capitalize">
            <p>Oops! Nothing to show.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
