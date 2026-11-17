
const API_URL = "http://localhost:5000/api/team-members";

async function handleResponse(response) {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(
            data?.message || "Something went wrong with Team Member API."
        );
    }

    return data;
}

// GET: Lấy danh sách thành viên
export async function getTeamMembers() {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response);
}

// POST: Thêm thành viên
export async function createTeamMember(memberData) {
    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberData),
    });

    return handleResponse(response);
}

// PUT: Cập nhật thành viên
export async function updateTeamMember(id, memberData) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberData),
    });

    return handleResponse(response);
}

// DELETE: Xóa thành viên
export async function deleteTeamMember(id) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return handleResponse(response);
}
