const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const rooms = {};

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on("connection", (socket) => {

    console.log("A user connected");

    // CREATE ROOM
    socket.on("createRoom", (playerName) => {

        const roomId = generateRoomId();

        rooms[roomId] = [];

        rooms[roomId].push({
            id: socket.id,
            name: playerName
        });

        socket.join(roomId);

        socket.emit("roomCreated", roomId);

        io.to(roomId).emit("updatePlayers", rooms[roomId]);

        console.log(`Room ${roomId} created`);
    });

    // JOIN ROOM
    socket.on("joinRoom", (data) => {

        const roomId = data.roomId;
        const playerName = data.playerName;

        if (rooms[roomId]) {

            rooms[roomId].push({
                id: socket.id,
                name: playerName
            });

            socket.join(roomId);

            socket.emit("joinedRoom", roomId);

            io.to(roomId).emit("updatePlayers", rooms[roomId]);

            console.log(`${playerName} joined ${roomId}`);

        } else {
            socket.emit("errorMessage", "Room does not exist");
        }
    });

    // DISCONNECT
    socket.on("disconnect", () => {

        for (const roomId in rooms) {

            rooms[roomId] = rooms[roomId].filter(
                player => player.id !== socket.id
            );

            io.to(roomId).emit("updatePlayers", rooms[roomId]);

            if (rooms[roomId].length === 0) {
                delete rooms[roomId];
            }
        }

        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
