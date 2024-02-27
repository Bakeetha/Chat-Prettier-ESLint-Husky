import * as http from 'http';
import * as socketIo from 'socket.io';

const server = http.createServer((req, res) => {
  res.end('Simple Chat App Server');
});

const io = new socketIo.Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('message', (message) => {
    console.log('Message received:', message);
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env['PORT'] || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
