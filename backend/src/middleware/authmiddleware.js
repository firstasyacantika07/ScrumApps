const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Unauthorized" });
        
        // Data 'decoded' berisi email dan role dari token
        req.user = decoded; 
        next();
    });
};

const authorizeRole = (roles) => {
    return (req, res, next) => {
        // Cek apakah role user ada di dalam daftar roles yang diizinkan
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: "Access denied: Unauthorized role",
                yourRole: req.user ? req.user.role : "None" 
            });
        }
        next();
    };
};

module.exports = { verifyToken, authorizeRole };