import Button from "@/components/common/Button";
import { STORAGE_KEYS } from "@/constants/storageKey";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";

function StickyWallFeature() {

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem(
      STORAGE_KEYS.STICKY_WALL_NOTES
    );

    if (savedNotes) {
      return JSON.parse(savedNotes);
    }

    return [
      {
        id: 1,
        title: "Remember",
        content: "Review UI / UX project",
      },
      {
        id: 2,
        title: "Meeting",
        content: "Prepare tasks for tomorrow",
      },
      {
        id: 3,
        title: "Learning",
        content: "Practice React Context",
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.STICKY_WALL_NOTES,
      JSON.stringify(notes)
    );
  }, [notes]);

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [editingId, setEditingId] = useState(null)

  const handleEditNote = (note) => {
    setEditingId(note.id)
    setTitle(note.title)
    setContent(note.content)

    document.getElementById("add-note")?.scrollIntoView({ behavior: "smooth" })
  }

  const handleAddNote = (event) => {
    event.preventDefault()
    if (!title.trim() || !content.trim()) {
      return
    }

    if (editingId !== null) {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editingId
            ? {
              ...note,
              title: title.trim(),
              content: content.trim()
            }
            : note
        ))
      setEditingId(null)
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim()
      }

      setNotes((prevNotes) => [
        ...prevNotes,
        newNote
      ])
    }
  }

  const handleDeleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-black">Sticky Wall</h1>
          <p className="mt-1 text-sm text-gray-500">Keep your important notes and ideas here</p>
        </div>

        <Button href="#add-note"
          icon={CirclePlus}
        />
      </div>

      {/* Notes */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="min-h-40 rounded-xl border border-yellow-200 bg-yellow-100 p-5 shadow-sm"

          >

            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-bold text-gray-900">
                {note.title}
              </h2>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleEditNote(note)}
                  className="text-xs font-medium text-gray-500 transition hover:text-gray-900"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-xs font-medium text-red-500 transition hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-700">{note.content}</p>

          </div>
        ))}

      </div>
      {/* Add note */}
      <div
        id="add-note"
        className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold text-gray-900">
          {editingId !== null ? "Edit Note" : "Add note"}
        </h2>
        <form
          onSubmit={handleAddNote}
          className="mt-4 space-y-4"
        >
          {/* Title */}
          <div>
            <label className="mt-1 block text-sm font-medium text-gray-700">Title</label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter note title"
              className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-gray-500" />
          </div>

          {/* Content */}
          <div>
            <label className=" mt-1 block text-sm font-medium text-gray-700">Content</label>

            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Enter note content"
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none transition focus:border-gray-500" />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800">
            {editingId !== null ? "Update Note" : "Add Note"}
          </button>
        </form>
      </div>
    </div>
  )
}
export default StickyWallFeature;
