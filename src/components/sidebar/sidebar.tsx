"use client";

import React, { useState } from "react";
import UserSettingsModal from "../user-settings-modal";
import { Note } from "../../lib/types";
import SidebarNotes from "./sidebar-notes";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { FileText, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "../ui/button";
import Link from "next/link";
import { FilePdf } from "@phosphor-icons/react";

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
          <h1 className="font-bold text-xl">Notes</h1>
          <div className="flex space-x-1 items-center justify-center">
            <Button
              variant={"menu"}
              size={"sm"}
              className="border-none"
              onClick={toggleNoteForm}
              aria-expanded={isNoteFormVisible}
              aria-controls="new-note-form"
            >
              <FileText size={19} />
              <span className="sr-only">Toggle New Note Form</span>
            </Button>
            {notes.length > 0 && (
              <Button
                variant={"menu"}
                size={"sm"}
                className="border-none"
                onClick={toggleSearchForm}
                aria-expanded={isSearchFormVisible}
                aria-controls="search-notes-form"
              >
                <MagnifyingGlass size={19} />
                <span className="sr-only">Toggle Search Form</span>
              </Button>
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
        <Link
          href={"/pdf"}
          className="font-medium p-1.5 bg-[#C5FCCF] hover:bg-[#C5FCCF]/50 rounded-sm text-sm w-full flex items-center justify-start gap-x-2"
        >
          <FilePdf size={20} />
          Chat with your PDF's
        </Link>
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
