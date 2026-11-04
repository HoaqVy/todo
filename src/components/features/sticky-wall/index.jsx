
import Button from "@/components/common/Button";
import { CirclePlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "@/api/noteApi";

function StickyWallFeature() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      setError(error.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);


  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState("my");

  const handleEditNote = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);

    document
      .getElementById("add-note")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddNote = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    try {
      setError("");

      const noteData = {
        title: title.trim(),
        content: content.trim(),
        type: "Personal",
      };

      if (editingId !== null) {
        // Update Note
        const data = await updateNote(editingId, noteData);

        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note._id === editingId ? data.note : note
          )
        );

        setEditingId(null);
      } else {
        // Create Note
        const data = await createNote(noteData);

        setNotes((prevNotes) => [...prevNotes, data.note]);
      }

      setTitle("");
      setContent("");
    } catch (error) {
      setError(error.message || "Failed to save note");
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      setError("");

      await deleteNote(id);

      setNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== id)
      );

      if (editingId === id) {
        setEditingId(null);
        setTitle("");
        setContent("");
      }
    } catch (error) {
      setError(error.message || "Failed to delete note");
    }
  };

  return (
    <div className="w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-black sm:text-4xl">
            Sticky Wall
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Keep your important notes and ideas here
          </p>
        </div>

        {activeTab === "my" && (
          <Button
            href="#add-note"
            icon={CirclePlus}
            className="w-full sm:w-auto"
          >
            Add Note
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-6 flex gap-6 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab("my")}
          className={`pb-3 text-sm font-medium transition ${activeTab === "my"
            ? "border-b-2 border-black text-black"
            : "text-gray-500 hover:text-gray-900"
            }`}
        >
          My Notes
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("team")}
          className={`pb-3 text-sm font-medium transition ${activeTab === "team"
            ? "border-b-2 border-black text-black"
            : "text-gray-500 hover:text-gray-900"
            }`}
        >
          Team Notes
        </button>
      </div>

      {/* Notes */}
      {activeTab === "my" ? (
        loading ? (
          <p className="mt-5 text-sm text-gray-500">
            Loading notes...
          </p>
        ) : error ? (
          <p className="mt-5 text-sm text-red-500">
            {error}
          </p>
        ) : notes.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-500">
              No notes yet. Create your first note!
            </p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
            {notes
              .filter((note) => note.type === "Personal")
              .map((note) => (
                <div
                  key={note._id}
                  className="min-h-40 min-w-0 rounded-xl border border-yellow-200 bg-yellow-100 p-4 shadow-sm sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="min-w-0 flex-1 wrap-break-word text-base font-bold text-gray-900 sm:text-lg">
                      {note.title}
                    </h2>

                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => handleEditNote(note)}
                        className="text-xs font-medium text-gray-500 transition hover:text-gray-900"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteNote(note._id)}
                        className="text-xs font-medium text-red-500 transition hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 wrap-break-word text-sm leading-6 text-gray-700">
                    {note.content}
                  </p>
                </div>
              ))}
          </div>
        )
      ) : (
        <div className="mt-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Team Notes
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Share important notes and ideas with your team.
              </p>
            </div>

            <Button
              icon={CirclePlus}
              className="w-full sm:w-auto"
            >
              Add Team Note
            </Button>
          </div>

          <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
            <p className="text-sm text-gray-500">
              No team notes yet.
            </p>
          </div>
        </div>
      )}

      {/* Add Note */}
      {activeTab === "my" && (
        <div
          id="add-note"
          className="mt-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-6 sm:p-6"
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
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter note title"
                className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            {/* Content */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Content
              </label>

              <textarea
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                placeholder="Enter note content"
                rows={4}
                className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full sm:w-auto"
            >
              {editingId !== null
                ? "Update Note"
                : "Add Note"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default StickyWallFeature;
