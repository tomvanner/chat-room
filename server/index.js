const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const PORT = 5000 || process.env.PORT;

const router = require('./router');

// Init server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }) => {
        console.log(name, room);
    });

    socket.on('disconnect', () => {
        console.log('disconnect')
    });
});

app.use(router);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
