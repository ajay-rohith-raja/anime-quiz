const socket = io();

const createBtn = document.getElementById("createBtn");
const joinBtn = document.getElementById("joinBtn");

const roomText = document.getElementById("roomText");
const playersList = document.getElementById("playersList");

createBtn.addEventListener("click", () => {

    const playerName = document.getElementById("nameInput").value;

    socket.emit("createRoom", playerName);
});

joinBtn.addEventListener("click", () => {

    const roomId = document.getElementById("roomInput").value;
    const playerName = document.getElementById("nameInput").value;

    socket.emit("joinRoom", {
        roomId,
        playerName
    });
});

socket.on("roomCreated", (roomId) => {

    roomText.innerText = `Room ID: ${roomId}`;
});

socket.on("joinedRoom", (roomId) => {

    roomText.innerText = `Joined Room: ${roomId}`;
});

socket.on("updatePlayers", (players) => {

    playersList.innerHTML = "";

    players.forEach(player => {

        const li = document.createElement("li");

        li.innerText = player.name;

        playersList.appendChild(li);
    });
});

socket.on("errorMessage", (msg) => {

    alert(msg);
});