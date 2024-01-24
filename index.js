const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const connect = require('./config/database');
const chat = require('./models/chat');

require('dotenv').config();
const PORT = process.env.PORT || 5000;



io.on('connection', (socket) => {

    socket.on('join_room', (data) => {
        socket.join(data.roomid);
        console.log("joined room", data.roomid);

    })

    socket.on('msg_send', (data) => {
        const messageData = {
            msg: data.msg,
            inputUsername: data.inputUsername,
            roomid: data.roomid,
            timestamp: new Date().toISOString() // Ensure a valid timestamp is sent
        };
        io.to(data.roomid).emit('msg_rvcd', messageData);
    });



});
app.set('view engine', 'ejs');



app.get('/chat/:roomid', async (req, res) => {
    await chat.deleteMany({ roomId: req.params.roomid });
    const chats = await chat.find({ roomId: req.params.roomid }).select('content user');
    console.log(chats);

    res.render('index', {
        name: 'Narendra',
        roomid: req.params.roomid,
        chats: chats
    })
})


connect.connect();

server.listen(PORT, async () => {
    console.log("server is running");

});