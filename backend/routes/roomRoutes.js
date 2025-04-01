const express = require("express");
const { createRoom, getRooms, joinRoom, leaveRoom } = require("../controllers/roomController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createRoom);
router.get("/", authMiddleware, getRooms);
router.post("/join/:roomId", authMiddleware, joinRoom);
router.post("/leave/:roomId", authMiddleware, leaveRoom);

module.exports = router;