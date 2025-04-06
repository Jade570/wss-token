var options = {
  cors: true,
};
const server = require("http").createServer();
const io = require("socket.io")(server, options);

class Player {
  constructor(id) {
    this.id = id;
    this.model = 0;
    this.color = "queer"; // 색상 key 값으로 저장
    this.entered = 0;
    this.entity = null;
  }

  updateModel(model) {
    this.model = model;
  }

  updateColor(color) {
    this.color = color;
  }

  updateEntered(entered){
    this.entered = entered;
  }
}

const players = {};

io.sockets.on("connection", function (socket) {
  const id = socket.id;

  if (!players[id]) {
    console.log(id, "initialized");
    const newPlayer = new Player(id);
    players[id] = newPlayer;
    console.log(players);
    socket.emit("playerData", { id, players });
    socket.broadcast.emit("playerJoined", newPlayer);
    socket.broadcast.emit("players", players);
  }

  socket.on("modelUpdate", function (data) {
    if (!players[data.id]) {
      console.log("no id for modelUpdate");
      return;
    }
    players[data.id].updateModel(data.model);
    console.log(`Model updated for ${data.id}: ${data.model}`);
    socket.broadcast.emit("players", players);
  });

  socket.on("colorUpdate", function (data) {
    if (!players[data.id]) {
      console.log("no id for colorUpdate");
      return;
    }
    players[data.id].updateColor(data.color);
    console.log(`Color updated for ${data.id}: ${data.color}`);
    socket.broadcast.emit("players", players);
  });

  socket.on("enteredUpdate", function (data) {
    if (!players[data.id]) {
      console.log("no id for enteredUpdate");
      return;
    }
    players[data.id].updateEntered(data.entered);
    console.log(`Enter status updated for ${data.id}: ${data.entered}`);
    socket.broadcast.emit("players", players);
  });

  socket.on("disconnect", function () {
    socket.broadcast.emit("killPlayer", socket.id);
    delete players[socket.id];
    console.log(socket.id, "cleaned up");
    socket.broadcast.emit("players", players);
  });
});

console.log("Server started");
server.listen(8000);
