const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
