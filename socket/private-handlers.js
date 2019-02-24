module.exports=function(socket){
  socket.on('init',(data)=>{
    console.log('private init channel accessed');
  });
}
