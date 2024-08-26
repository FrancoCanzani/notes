"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Note } from "../lib/types";
import { nanoid } from "nanoid";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { FileIcon, DrawingPinFilledIcon } from "@radix-ui/react-icons";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveNote } from "../lib/actions";

export default function NavDrawer({
  notes,
  children,
}: {
  notes?: Note[];
  children: ReactNode;
}) {
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
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-white">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="font-semibold py-1">Notes</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col justify-between w-full px-1.5 py-4 min-h-60">
            <div className="space-y-4">
              <form
                action={handleSubmit}
                className="flex items-center justify-between gap-x-2"
              >
                <Input
                  className="rounded-sm bg-bermuda-gray-50 border-none placeholder:font-medium focus-visible:ring-0 focus-visible:ring-offset-0 outline-none font-medium text-sm w-full"
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
                        "p-1.5 my-1 bg-bermuda-gray-50 rounded-sm text-sm w-full flex-col items-center justify-between hover:bg-bermuda-gray-200",
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
