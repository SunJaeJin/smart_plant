// socket.js
const socketIo = require('socket.io');
const socketUsers = {};

let io = null;

function initSocket(server) {
    io = socketIo(server);
    io.on('connection', (socket) => {
        console.log('New client connected');
        
        socket.on('register', (userId) => {
            socketUsers[userId] = socket.id;
            console.log(`User ${userId} registered with socket ID ${socket.id}`);
        });

        socket.on('disconnect', () => {
            for (let userId in socketUsers) {
                if (socketUsers[userId] === socket.id) {
                    delete socketUsers[userId];
                    console.log(`User ${userId} unregistered`);
                    break;
                }
            }
        });
    });
}

function getIo() {
    return io;
}

function getSocketUsers() {
    return socketUsers;
}

module.exports = { initSocket, getIo, getSocketUsers };