import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/api/auth`;

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

// CHANGE PASSWORD
export async function changePassword(passwordData) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/change-password`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(passwordData)
    });

    return handleResponsee(response);
}

//UPDATE PROFILE
export async function updateProfile(profileData) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
    });

    return handleResponsee(response);
}

// FORGOT PASSWORD
export async function forgotPassword(email) {
    const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
    });

    return handleResponsee(response);
}

// VERIFY OTP
export async function verifyOTP(email, otp) {
    const response = await fetch(`${API_URL}/verify-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp })
    });

    return handleResponsee(response);
}

// RESET PASSWORD
export async function resetPassword(email, resetToken, newPassword) {
    const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            resetToken,
            newPassword
        })
    });

    return handleResponsee(response);
}

// VERIFY EMAIL
export async function verifyEmail(token) {
    const response = await fetch(
        `${API_URL}/verify-email?token=${encodeURIComponent(token)}`,
        {
            method: "GET"
        }
    );

    return handleResponsee(response);
}


// RESEND VERIFICATION EMAIL
export async function resendVerificationEmail(email) {
    const response = await fetch(
        `${API_URL}/resend-verification`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        }
    );

    return handleResponsee(response);
}
