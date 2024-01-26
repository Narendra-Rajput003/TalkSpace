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
const PORT = process.env.PORT || 3000;


io.on('connection', (socket) => {

    socket.on('join_room', (data) => {
        socket.join(data.roomid);
        console.log("joined room", data.roomid);
        // socket.to(data.roomid).broadcast.emit('new_user_joined',{userid:data.userid,username:data.username});
    })

    socket.on('msg_send', async (msg) => {

        // io.to send the message to all the users in the room including the sender 

        await chat.create({
            content: msg.msg,
            user: msg.inputUsername,
            roomId: msg.roomid
        })
        io.to(msg.roomid).emit('msg_rvcd', msg);
        // socket.emit('msg_rvcd',msg) from the same client
        //socket.broadcast.emit('msg_rvcd',msg) 
    })


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
