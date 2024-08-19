"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Note } from "../lib/types";
import { nanoid } from "nanoid";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { FileIcon, DrawingPinFilledIcon } from "@radix-ui/react-icons";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveNote } from "../lib/actions";

export default function NavDrawer({ notes }: { notes?: Note[] }) {
  const pathname = usePathname();
  const { userId } = useAuth();
  const [title, setTitle] = useState("");
  const noteId = nanoid(7);
  const router = useRouter();

  async function handleSubmit() {
    if (userId && title.trim()) {
      toast.promise(saveNote(userId, noteId, title, ""), {
        loading: "Saving note...",
        success: async (data) => {
          await router.push(`/notes/${noteId}`);
          setTitle("");
          return "Note created successfully";
        },
        error: "Error saving note",
      });
    } else if (!title.trim()) {
      toast.error("Please enter note title");
    }
  }

  const pinnedNotes = notes
    ? notes.filter((note: Note) => note.pinned === true)
    : [];

  const activeNotes = notes
    ? notes.filter(
        (note: Note) => note.status === "active" && note.pinned != true
      )
    : [];

  return (
    <Drawer>
      <DrawerTrigger asChild className="sm:hidden">
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5rem"
            height="1.5rem"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              d="M10.01 8.5c0-.276.216-.5.495-.5h2.01c.243 0 .445.183.487.412l.008.088c0 .276-.216.5-.495.5h-2.01a.5.5 0 0 1-.487-.412zM12.5 12c.25 0 .459.183.502.412l.008.088c0 .276-.228.5-.51.5H3.52a.51.51 0 0 1-.502-.412L3.01 12.5c0-.276.228-.5.51-.5h3.987V4.208l-2.06 2.06a.5.5 0 1 1-.707-.707L6.86 3.44A1.5 1.5 0 0 1 7.974 3h.033q.06 0 .118.014c.314.043.616.185.857.426l2.122 2.12a.5.5 0 0 1-.708.708l-1.889-1.89V12zM3 8.5c0-.276.216-.5.495-.5h2.01c.243 0 .445.183.487.412L6 8.5c0 .276-.216.5-.495.5h-2.01a.5.5 0 0 1-.487-.412z"
            />
          </svg>{" "}
          <span className="sr-only">Toggle Menu</span>
        </button>
      </DrawerTrigger>
      <DrawerContent className="bg-white">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              <h1 className="font-semibold py-1.5">Notes</h1>
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col justify-between w-full px-1.5 py-4 min-h-60">
            <div className="space-y-4">
              <form
                action={handleSubmit}
                className="flex items-center justify-between gap-x-2"
              >
                <Input
                  className="text-center rounded-sm focus:text-start bg-bermuda-gray-50 border-none placeholder:font-medium focus-visible:ring-0 focus-visible:ring-offset-0 outline-none font-medium text-sm w-full"
                  placeholder="New Note Title"
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Button
                  variant={"menu"}
                  size={"lg"}
                  className="px-3 py-2 h-10 rounded-sm font-medium bg-bermuda-gray-50"
                >
                  Create
                </Button>
              </form>
              <div>
                {[...pinnedNotes, ...activeNotes].map((note) => (
                  <Link href={`/notes/${note.id}`} key={note._id}>
                    <div
                      className={cn(
                        "p-1.5 my-1 bg-bermuda-gray-100 rounded-sm text-sm w-full flex-col items-center justify-between hover:bg-bermuda-gray-200",
                        pathname.includes(note.id) &&
                          "bg-bermuda-gray-200 font-semibold"
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center w-auto justify-start gap-x-2">
                          {note.pinned ? (
                            <DrawingPinFilledIcon />
                          ) : (
                            <FileIcon />
                          )}
                          <p title={note.title} className="truncate max-w-64">
                            {note.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
