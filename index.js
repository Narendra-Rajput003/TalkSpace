const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const socketio=require('socket.io');
const io=socketio(server);

//  you can emit events on one side and register listeners on the other
// io.emit send the message others websockets when socket.emit only send message to same client.socket.broadcast.emmit means suppose there are three a,b, c user. Suppose a is send the message then message is recieved b and c user only not recevied  a user . 
io.on('connection',(socket)=>{
    
    socket.on('msg_send',(msg)=>{
        //  console.log(msg)
        // io.emit('msg_rvcd',msg);
        // socket.emit('msg_rvcd',msg) from the same client
        // socket.broadcast.emit('msg_rvcd',msg) send msg to other client but it can't send msg itself.
    })

   
});

app.use('/',express.static(__dirname+'/public'));

















server.listen(3000,()=>{
    console.log("server is running");
});