const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    let token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Accès non autorisé, aucun token fourni" });
    }

    try {
        token = token.split(" ")[1]; // Supprimer "Bearer "
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password"); // Exclure le mot de passe
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide, accès refusé" });
    }
};

module.exports = authMiddleware;