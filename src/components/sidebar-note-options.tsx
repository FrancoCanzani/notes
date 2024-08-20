"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Trash2, FilePenLine, MoreHorizontal } from "lucide-react";
import { DrawingPinIcon, DrawingPinFilledIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Note } from "../lib/types";
import {
  deleteCloudNote,
  updateNoteStatus,
  updatePinStatus,
} from "../lib/actions";
import { useAuth } from "@clerk/nextjs";
import { cn } from "../lib/utils";
import { usePathname } from "next/dist/client/components/navigation";

export default function SidebarNoteOptions({
  note,
  className,
}: {
  note: Note;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { userId } = useAuth();

  if (!userId) return;

  const handleDeleteNote = async () => {
    try {
      await deleteCloudNote(userId, note.id);
      // redirect if the deleted note is the one in view
      if (pathname.includes(note.id)) router.replace("/");
      toast.success(`Deleted: ${note.title}`);
      router.refresh();
    } catch (error) {
      toast.error(`Failed to delete: ${note.title}`);
    }
  };

  const handlePinNote = async () => {
    try {
      await updatePinStatus(userId, note.id);
      toast.success(`Pinned: ${note.title}`);
      router.refresh();
    } catch (error) {
      toast.error(`Failed to pin: ${note.title}`);
    }
  };

  return (
    <div className="flex items-center justify-end gap-x-0.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-0 w-8 p-0 outline-none hover:bg-bermuda-gray-100 font-bold rounded-sm",
              className
            )}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-bermuda-gray-50 text-xs rounded-sm"
        >
          <DropdownMenuItem className="hover:bg-bermuda-gray-100 rounded-sm w-full text-xs">
            <Link
              href={`/notes/${note.id}`}
              className="w-full cursor-pointer flex items-center justify-start gap-x-2"
            >
              <FilePenLine size={13} />
              Edit Note
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handlePinNote()}
            className="hover:bg-bermuda-gray-100 rounded-sm cursor-pointer w-full text-xs flex items-center justify-start gap-x-2"
          >
            {note.pinned === true ? (
              <DrawingPinIcon />
            ) : (
              <DrawingPinFilledIcon />
            )}

            {note.pinned === true ? "Unpin from Sidebar" : "Pin to Sidebar"}
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:bg-bermuda-gray-100 rounded-sm w-full cursor-pointer text-xs">
            <AlertDialog>
              <AlertDialogTrigger
                onClick={(e) => e.stopPropagation()}
                className="cursor-pointer text-red-600 flex items-center justify-start gap-x-2"
              >
                <Trash2 size={13} />
                Delete Note
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-50 rounded-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your note.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex items-center justify-center space-x-6">
                  <AlertDialogCancel className="bg-gray-200 hover:opacity-80 duration-150 font-medium rounded-sm p-3">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteNote()}
                    className="bg-black text-white hover:opacity-80 duration-150 font-medium rounded-sm p-3"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-bermuda-gray-50 my-0.5" />
          <DropdownMenuItem className="rounded-sm w-full text-xs">
            Edited{" "}
            {new Date(note.lastSaved).toLocaleString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
