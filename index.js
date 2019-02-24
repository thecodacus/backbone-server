var app=require('./app');
var server = require('http').Server(app);
var socketio=new require('./socket/socket-routes')(server);
server.listen(app.get('port'),()=>{
  console.log(`Express started on port :${app.get('port')}`);
});
