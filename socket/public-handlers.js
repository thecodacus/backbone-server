let BackBoneServer = require('../models/BackBoneServer');
let jwt = require('jsonwebtoken');

let bbs=new BackBoneServer()
module.exports=function(socket){
  socket.on('init',function(data,callback){
    console.log('public init channel accessed');
    console.log(data);
    if(callback){
      callback(false,{});
    }
    else{
      console.log('no callback found');
    }
  });
  socket.on('request',(data,callback)=>{
    console.log('public request channel accessed');
    console.log(data);
    if(callback){
      let date=new Date();
      let channelId=date.getFullYear()+date.getTime()+Math.random();
      console.log("setting up channel=>"+channelId);
      callback({error:false,data:channelId});
      let cacheConn=null;
      let context=[];
      bbs.connect()
      .then(conn=>{
        cacheConn=conn;
        let results=bbs.execute(data.request,conn);
        context=results.context;
        return results.cursor;})
      .then(cursor=>{
        //console.log(cursor,context);
        if(context.indexOf('changes') == -1
          && context.indexOf('insert') == -1
          && context.indexOf('update') == -1
          && context.indexOf('delete') == -1
        )
          return cursor.toArray();
        else return cursor;
      })
      .then(results=>{
        if(context.indexOf('changes') == -1){
          //console.log("sending results to channel"+channelId,results);
          socket.emit(channelId,{error:false,data:results});
        }
        else{
          results.each((err,data)=>{
            if(err){console.log(err);throw err;}
            //console.log("sending feeds to channel"+channelId,data);
            socket.emit(channelId,{error:false,data:data});
          })
        }
        socket.on(channelId,(data)=>{
          if(data==='close'){
            socket.removeAllListeners(channelId);
            bbs.closeConnection(cacheConn);
          }
        });
      })
      .catch(error=>{
        console.log(error);
        socket.emit(channelId,{error:true,data:error});
        if(cacheConn) bbs.closeConnection(cacheConn);
      });
    }
    else{
      console.log('no callback found');
    }
  });
  socket.on('auth',function(data,callback){
    console.log('public auth channel accessed');
    console.log(data);
    if(data.token){
      jwt.verify(token, global.credentials.secret, function(err, decoded) {
        if (err) {
          return socket.emit({error: true, message: 'Failed to authenticate token.' });
        }else{
          return socket.emit({error: false, message: 'Authenticated' });
        }
      });
    }
  });
}
