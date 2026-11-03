const API_URL = "http://localhost:5000/api/auth"

//Xử lý response từ BE
async function handleResponsee(response) {
    const data = await response.json().catch(() => null)

    if (!response.ok) {
        const error = new Error(
            data?.message || "Authentication failed"
        );

        error.status = response.status;

        throw error;
    }
    return data
}

//REGISTER
export async function registerUser(userData) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })

    return handleResponsee(response)
}

//LOGIN
export async function loginUser(userData) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    })
    return handleResponsee(response)
}

//GET CURRENT USER
export async function getCurrentUser(token) {
    const response = await fetch(`${API_URL}/me`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return handleResponsee(response)
}