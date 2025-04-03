const Room = require("../models/Room.js");
const User = require("../models/User.js");

exports.createRoom = async (req, res) => {
    try {
        const { name } = req.body;

        // Vérifier si le salon existe déjà
        const existingRoom = await Room.findOne({ name });
        if (existingRoom) {
            return res.status(400).json({ message: "Ce salon existe déjà" });
        }

        // Créer un nouveau salon
        const room = await Room.create({ name, createdBy: req.user._id, users: [req.user._id] });
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find().populate("createdBy", "username").populate("users", "username");
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.joinRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ message: "Salon non trouvé" });
        }

        if (!room.users.includes(req.user._id)) {
            room.users.push(req.user._id);
            await room.save();
        }

        res.json({ message: "Rejoint avec succès", room });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.leaveRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({ message: "Salon non trouvé" });
        }

        room.users = room.users.filter(user => user.toString() !== req.user._id.toString());
        await room.save();

        res.json({ message: "Vous avez quitté le salon" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
