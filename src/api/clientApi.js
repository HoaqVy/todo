const API_URL = "http://localhost:5000/api/clients"

async function handleResponse(response) {
    const data = await response.json().catch(() => null)
    if (!response.ok) {
        throw new Error(
            data?.message || "Something went wrong with Client API"
        )
    }
    return data
}

// GET
export async function getClients() {
    const response = await fetch(API_URL)
    return handleResponse(response)
}

// POST
export async function createClient(clientData) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(clientData)
    })

    return handleResponse(response)
}

// PUT
export async function updateClient(id, clientData) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(clientData)
    })

    return handleResponse(response)
}

// DELETE
export async function deleteClient(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })

    return handleResponse(response)
}