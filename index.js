const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const connect = require('./config/database');
const chat = require('./models/chat');
const cron = require('node-cron');
const path = require('path');

require('dotenv').config();
const PORT = process.env.PORT || 5000;


io.on('connection', (socket) => {

    socket.on('join_room', (data) => {
        socket.join(data.roomid);
    })

   
    
    socket.on('msg_send', (data) => {
        const messageData = {
            msg: data.msg,
            inputUsername: data.inputUsername,
            roomid: data.roomid,
            timestamp: new Date().toISOString() 
        };
        // io.to method is used to send message to a specific room 
        io.to(data.roomid).emit('msg_rvcd', messageData);
    });



});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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