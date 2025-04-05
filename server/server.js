var options = {
    cors: true,
  };
  const server = require("http").createServer();
  const io = require("socket.io")(server, options);
  
  class Player {
    constructor(id) {
      this.id = id;
      this.model = 0;
      this.shader = 0;
      this.entity = null;
    }
  
    updateModel(model) {
      this.model = model;
    }
  
    updateShader(shader) {
      this.shader = shader;
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
        console.log("no id");
        return;
      }
      players[data.id].updateModel(data.model);
      socket.broadcast.emit("players", players);
    });
  
    socket.on("shaderUpdate", function (data) {
      if (!players[data.id]) {
        console.log("no id");
        return;
      }
      players[data.id].updateShader(data.shader);
      console.log(players[data.id]);
      socket.broadcast.emit("players", players);
    });
  
    socket.on("disconnect", function () {
      socket.broadcast.emit("killPlayer", socket.id);
      delete players[socket.id];
      console.log(socket.id, " cleaned up");
      socket.broadcast.emit("players", players);
    });
  });
  
  console.log("Server started");
  server.listen(8000);