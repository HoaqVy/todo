
const API_URL = "http://localhost:5000/api/notes";

// Xử lý response từ backend
async function handleResponse(response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message || "Something went wrong. Please try again."
        );
    }

    return data;
}

// GET: Lấy danh sách Note
export async function getNotes() {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response);
}

// POST: Tạo Note
export async function createNote(noteData) {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
    });

    return handleResponse(response);
}

// PUT: Cập nhật Note
export async function updateNote(id, noteData) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
    });

    return handleResponse(response);
}

// DELETE: Xóa Note
export async function deleteNote(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response);
}
