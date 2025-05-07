import { useEffect, useState } from "react";
import { fetchNotes, addNote, editNote, deleteNote } from "../data/api";
import logo from "../assets/logocolor.png"

export default function NoteIndex() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      setError("Gagal memuat catatan. Silakan coba lagi.");
      console.error("Error fetching notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNote = async () => {
    if (newNote.title.trim() === "" || newNote.description.trim() === "")
      return;

    setIsLoading(true);
    setError(null);
    try {
      await addNote(newNote);
      await getNotes();
      setNewNote({ title: "", description: "" });
    } catch (err) {
      setError("Gagal menambahkan catatan. Silakan coba lagi.");
      console.error("Error adding note:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditNote = async () => {
    if (!currentNote?.title.trim() || !currentNote?.description.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      await editNote(currentNote.id, currentNote);
      await getNotes();
      setIsEditing(false);
      setCurrentNote(null);
    } catch (err) {
      setError("Gagal memperbarui catatan. Silakan coba lagi.");
      console.error("Error updating note:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (note) => {
    const noteId = note.id;

    if (!noteId) {
      setError("ID catatan tidak ditemukan");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await deleteNote(noteId);
      setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteId));
    } catch (err) {
      setError(err.message || "Gagal menghapus catatan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-4">
          <div className="flex items-center justify-center space-x-4 mb-2">
          <img src={logo} alt="logo-pencil" className="w-12"/>
          <h1 className="text-4xl font-bold text-primary mb-2">Notely</h1>
          </div>
          <div className="text-center">
          <p className="text-lg text-base-content">
            Catat semua ide dan pikiran Anda di satu tempat
          </p>
          </div>
        </header>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="join w-full">
            <input
              type="text"
              placeholder="Cari catatan..."
              className="input input-bordered join-item w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-primary join-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Add/Edit Note Form */}
        <div className="card bg-base-100 shadow-xl mb-8">
          <div className="card-body">
            <h2 className="card-title">
              {isEditing ? "Edit Catatan" : "Tambah Catatan Baru"}
            </h2>
            <input
              type="text"
              placeholder="Judul Catatan"
              className="input input-bordered w-full mb-4"
              value={isEditing ? currentNote?.title || "" : newNote.title}
              onChange={(e) =>
                isEditing
                  ? setCurrentNote({ ...currentNote, title: e.target.value })
                  : setNewNote({ ...newNote, title: e.target.value })
              }
              disabled={isLoading}
            />
            <textarea
              placeholder="Isi Catatan"
              className="textarea textarea-bordered w-full mb-4"
              rows="4"
              value={
                isEditing ? currentNote?.description || "" : newNote.description
              }
              onChange={(e) =>
                isEditing
                  ? setCurrentNote({
                      ...currentNote,
                      description: e.target.value,
                    })
                  : setNewNote({ ...newNote, description: e.target.value })
              }
              disabled={isLoading}
            ></textarea>

            <div className="card-actions justify-end">
              {isEditing ? (
                <>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentNote(null);
                    }}
                    disabled={isLoading}
                  >
                    Batal
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleEditNote}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleAddNote}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Tambah Catatan"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center my-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* Notes Grid */}
        {!isLoading && filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-medium">
              {searchTerm
                ? "Tidak ada catatan yang cocok dengan pencarian Anda"
                : "Belum ada catatan, tambahkan catatan pertama Anda!"}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <div key={note.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <h2 className="card-title">{note.title}</h2>
                    <span className="text-sm opacity-70">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-line">{note.description}</p>
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => {
                        setIsEditing(true);
                        setCurrentNote({
                          id: note.id,
                          title: note.title,
                          description: note.description,
                        });
                      }}
                      disabled={isLoading}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-ghost text-error"
                      onClick={() => handleDeleteNote(note)}
                      disabled={isLoading}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
