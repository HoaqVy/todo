
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
    const response = await fetch(API_URL);
    return handleResponse(response);
}

// POST: Thêm thành viên
export async function createTeamMember(memberData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
    });

    return handleResponse(response);
}

// PUT: Cập nhật thành viên
export async function updateTeamMember(id, memberData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
    });

    return handleResponse(response);
}

// DELETE: Xóa thành viên
export async function deleteTeamMember(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    return handleResponse(response);
}
