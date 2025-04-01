const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Ce nom d'utilisateur est déjà pris" });
        }

        // Créer un nouvel utilisateur
        const newUser = await User.create({ username, password });

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            token: generateToken(newUser._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
        }

        res.json({
            _id: user._id,
            username: user.username,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
