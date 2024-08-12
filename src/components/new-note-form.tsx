import { Input } from "./ui/input";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { saveNote } from "../lib/actions";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function NewNoteForm({isNewNote}:{isNewNote: boolean}) {
    const {userId} = useAuth()
    const [title, setTitle] = useState('')
    const noteId = nanoid(7)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if(userId) {
            toast.promise(
                saveNote(userId, noteId, title, ''),
                {
                    loading: 'Saving note...',
                    success: (data) => {
                        router.push(`/notes/${noteId}`);
                        return `Note has been saved`;
                    },
                    error: 'Error saving note',
                }
            );
        }
    }

    return(
        <form onSubmit={handleSubmit} className="flex items-center justify-center space-x-2">
            <Input placeholder="Title" onChange={(e) => setTitle(e.target.value)}/>
            <button type="submit">Submit</button>
        </form>
    )
}