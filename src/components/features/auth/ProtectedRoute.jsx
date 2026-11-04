import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

function ProtectedRoute() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }
    // Bắt buộc đổi mật khẩu trước khi truy cập các trang khác
    if (
        user.mustChangePassword &&
        location.pathname !== "/change-password"
    ) {
        return <Navigate to="/change-password" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;