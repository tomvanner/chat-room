const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const {
    addUser,
    getUser,
    getUsersInRoom,
    removeUser,
} = require('./users.js');

const PORT = 5000 || process.env.PORT;

const router = require('./router');

// Init server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    socket.on('join', ({ name, room, callback }) => {
        const { error, user } =  addUser({ id: socket.id, name, room });
        if(error) {
            return callback(error);
        }
        
        const welcomeMessage = `${name} has joined.`;
        socket.emit(
            'message', 
            { user: 'admin', text:  welcomeMessage}
        );
        socket.broadcast.to(user.room).emit(
            'message', 
            { user: 'admin', text: welcomeMessage}
        );

        socket.join(user.room);
        
        io.to(user.room).emit(
            'roomData', 
            { room: user.room, users: getUsersInRoom(user.room) }
        )

        if(callback) {
            callback();
        }
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit(
            'message',
            { user: user.name, text: message }
        )
        io.to(user.room).emit(
            'roomData',
            { room: user.room, users: getUsersInRoom(user.room) }
        )

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if(user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` })
        }
    });
});

app.use(router);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
