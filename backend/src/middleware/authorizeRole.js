const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        // Kiểm tra user đã được xác thực chưa
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required."
            });
        }

        // Kiểm tra role có được phép truy cập không
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. You do not have permission."
            });
        }

        next();
    };
};

export default authorizeRole;