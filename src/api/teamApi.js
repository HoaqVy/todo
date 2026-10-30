const API_URL = "http://localhost:5000/api/teams"

async function handleResponse(response) {
    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(
            data?.message || "Something went wrong with Team API"
        )
    }
    return data
}

// GET: Lấy danh sách Team
export async function getTeams() {
    const response = await fetch(API_URL);
    return handleResponse(response);
}

// GET: Lấy một Team theo ID
export async function getTeamById(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return handleResponse(response);
}

// POST: Tạo Team
export async function createTeam(teamData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
    });

    return handleResponse(response);
}

// PUT: Cập nhật Team
export async function updateTeam(id, teamData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(teamData),
    });

    return handleResponse(response);
}

// DELETE: Xóa Team
export async function deleteTeam(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    return handleResponse(response);
}