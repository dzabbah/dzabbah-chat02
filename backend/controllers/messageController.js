const Message = require("../models/Message");
const Room = require("../models/Room");

exports.sendMessage = async (req, res) => {
    try {
        const { content, roomId } = req.body;
        const userId = req.user._id;

        const room = await Room.findById(roomId);
        if (!room) return res.status(404).json({ message: "Salon introuvable" });

        const message = await Message.create({ content, sender: userId, room: roomId });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const messages = await Message.find({ room: roomId })
            .populate("sender", "username")
            .sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};