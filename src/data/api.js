import axios from "axios";

const API_URL = "https://mongo-api-liart.vercel.app/note";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Fungsi untuk normalisasi data note
const normalizeNote = (note) => ({
  id: note._id || note.id,
  title: note.title || "",
  description: note.description || "",
  createdAt: note.createdAt || new Date().toISOString(),
});

export const fetchNotes = async () => {
  try {
    const response = await api.get("/");
    if (!Array.isArray(response.data.data)) {
      // Access 'data' inside the response
      throw new Error("Data yang diterima bukan array");
    }
    return response.data.data.map(normalizeNote); // Map through the notes array
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw new Error(error.response?.data?.message || "Gagal memuat catatan");
  }
};

export const addNote = async (note) => {
  try {
    const noteToSend = {
      title: note.title,
      description: note.description,
    };

    const response = await api.post("/", noteToSend);
    return normalizeNote(response.data);
  } catch (error) {
    console.error("Error adding note:", error);
    throw new Error(
      error.response?.data?.message || "Gagal menambahkan catatan"
    );
  }
};

export const editNote = async (id, updatedNote) => {
  try {
    const noteToUpdate = {
      title: updatedNote.title,
      description: updatedNote.description,
    };

    const response = await api.put(`/${id}`, noteToUpdate);
    return normalizeNote(response.data);
  } catch (error) {
    console.error("Error updating note:", error);
    throw new Error(
      error.response?.data?.message || "Gagal memperbarui catatan"
    );
  }
};

export const deleteNote = async (id) => {
  if (!id) {
    throw new Error("ID catatan tidak valid");
  }

  try {
    await api.delete(`/${id}`);
    return id;
  } catch (error) {
    console.error("Error deleting note:", error);
    throw new Error(error.response?.data?.message || "Gagal menghapus catatan");
  }
};
