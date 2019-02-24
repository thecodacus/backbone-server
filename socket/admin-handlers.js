module.exports=function(socket){
  socket.on('init',(data)=>{
    console.log('admin init channel accessed');
  });
}
