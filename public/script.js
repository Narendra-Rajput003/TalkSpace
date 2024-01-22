const socket=io();
 
let btn=document.getElementById('btn');
let inputMsg=document.getElementById('msg');
let msgList=document.getElementById('msglist');

btn.onclick=function exec(){
    socket.emit('msg_send',{
        msg:inputMsg.value
    });
}

socket.on('msg_rvcd',(msg)=>{
    let msglists=document.createElement('li');
    msglists.innerText=msg.msg;
    msgList.appendChild(msglists);
});