const Socket=require('./socket');
module.exports=function(app){
  io=require('socket.io')(app);
  let public  =io.of('/public')
  public.on('connection',(soc)=>{
    console.log('user connected to public line');
    //handle disconnection first
    let socket=new Socket(soc)
    socket.on('disconnect',(data)=>{
      console.log('user disconnected from public line');
    });
    require('./public-handlers')(socket);
  });
}
