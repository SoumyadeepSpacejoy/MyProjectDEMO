'use strict';

let onlineUsers = [];

const socketInit = (io) => {
    console.log('socket init... 🔌');
    io.on('connection', (socket) => {
        //register connectd users
        socket.on('register', (user) => {
            onlineUsers.push({ _id: user._id, name: user.name, socket: socket.id });
            console.log('🚀 ~ socket.on ~ onlineUsers:', onlineUsers);
            socket.emit('online-users', onlineUsers);
        });

        //send message
        socket.on('user-message', (message) => {
            console.log(message, socket.id);
        });
    });
};

module.exports = {
    socketInit,
};
