"use client";

import React, { useState } from "react";
import UserSettingsModal from "../user-settings-modal";
import { Note } from "../../lib/types";
import SidebarNotes from "./sidebar-notes";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { FilePlus, FileMinus, MagnifyingGlass } from "@phosphor-icons/react";

export default function Sidebar({ notes }: { notes: Note[] }) {
  const [isNoteFormVisible, setIsNoteFormVisible] = useState(false);
  const [isSearchFormVisible, setIsSearchFormVisible] = useState(false);

  const toggleNoteForm = () => {
    setIsNoteFormVisible(!isNoteFormVisible);
    if (isSearchFormVisible) setIsSearchFormVisible(false);
  };

  const toggleSearchForm = () => {
    setIsSearchFormVisible(!isSearchFormVisible);
    if (isNoteFormVisible) setIsNoteFormVisible(false);
  };

  return (
    <div className="rounded-r-sm border-r flex flex-col justify-between w-full h-[calc(100vh)]">
      <div className="flex flex-col space-y-2 w-full items-center justify-between px-5 pt-5">
        <div className="flex w-full justify-between items-center space-x-2">
          <h1 className="font-bold">Notes</h1>
          <div className="flex space-x-2 items-center justify-center">
            <button
              onClick={toggleNoteForm}
              aria-expanded={isNoteFormVisible}
              aria-controls="new-note-form"
            >
              {isNoteFormVisible ? (
                <FileMinus size={15} />
              ) : (
                <FilePlus size={15} />
              )}
              <span className="sr-only">Toggle New Note Form</span>
            </button>
            {notes.length > 0 && (
              <button
                onClick={toggleSearchForm}
                aria-expanded={isSearchFormVisible}
                aria-controls="search-notes-form"
              >
                <MagnifyingGlass size={16} />
                <span className="sr-only">Toggle Search Form</span>
              </button>
            )}
          </div>
        </div>
        <SidebarNotes
          notes={notes}
          isNoteFormVisible={isNoteFormVisible}
          isSearchFormVisible={isSearchFormVisible}
        />
      </div>
      <div className="px-5 pb-5 space-y-3">
        <div className="bg-[#FFD700]/50 cursor-pointer font-medium p-1.5 rounded-sm text-sm w-full flex items-center justify-start gap-x-2 hover:bg-[#F2C649]/50">
          <StarFilledIcon />
          <span className="sr-only">Premium Offer</span>
          Go Premium for $5 / M
        </div>
        <UserSettingsModal />
      </div>
    </div>
  );
}
