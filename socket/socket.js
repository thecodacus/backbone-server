module.exports=class Socket {
  constructor(socket) {
    this.socket=socket;
  }
  getUserData(){
    return this.userData;
  }
  init(userData){
    this.userData=userData;
  }
  on(subject,callback){
    this.socket.on(subject,(...arg)=>{
      callback(...arg);
    })
  }
  emit(subject,data){
    this.socket.emit(subject,data);
  }
}
