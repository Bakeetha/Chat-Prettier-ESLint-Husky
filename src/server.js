const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const server = http.createServer((req, res) => {
  res.end("Socket.IO Server");
});

// Listen on all network interfaces
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

// const io = socketIo(server);
// io.use(cors({ origin: '*' }));
// io.use(cors()); // Enable CORS for Socket.IO connections

// io.use(cors({
//   origin: 'http://localhost:4200' // Allow requests only from localhost:4200
// }));

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("message", (data) => {
    console.log("Message received:", data);
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const PORT = process.env.PORT || 3000;

// server.listen(PORT, '10.10.11.226', () => {
//   console.log(`Socket.IO server running on port ${PORT}`);
// });

// server.listen(PORT, () => {
//   console.log(`Socket.IO server running on port ${PORT}`);
// });

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
