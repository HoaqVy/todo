import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "@/api/authApi";

// Tạo AuthContext
const AuthContext = createContext(null);

// Tạo AuthProvider
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isLoading, setIsLoading] = useState(true);

    const login = (userData, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                const data = await getCurrentUser(token);
                setUser(data.user);
            } catch (error) {
                console.error("AUTH CHECK ERROR:", error);

                // Chi dang xuat khi token khong hop le
                if (error.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setUser(null);
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom Hook
export function useAuth() {
    return useContext(AuthContext);
}