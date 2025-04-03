const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");
const connectDB = require("./config/db");
const roomRoutes = require("./routes/roomRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./models/Message");
//const userController = require('../controllers/userController');


require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
connectDB();

app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

const activeUsers = {};

io.on("connection", (socket) => {
    console.log("✅ Nouvelle connexion socket", socket.id);

    socket.on("joinRoom", ({ room, username }) => {
        socket.join(room);
        activeUsers[socket.id] = { room, username };
        io.to(room).emit("userJoined", `${username} a rejoint le salon.`);
    });

    socket.on("sendMessage", async ({ room, message, username, userId }) => {
        const newMessage = await Message.create({ content: message, sender: userId, room });

        io.to(room).emit("receiveMessage", { 
            _id: newMessage._id, 
            content: newMessage.content, 
            sender: { username }, 
            createdAt: newMessage.createdAt 
        });
    });

    socket.on("leaveRoom", ({ room, username }) => {
        socket.leave(room);
        io.to(room).emit("userLeft", `${username} a quitté le salon.`);
    });

    socket.on("disconnect", () => {
        const user = activeUsers[socket.id];
        if (user) {
            io.to(user.room).emit("userLeft", `${user.username} s'est déconnecté.`);
            delete activeUsers[socket.id];
        }
        console.log("❌ Utilisateur déconnecté", socket.id);
    });
});

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
