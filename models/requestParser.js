"use strict";
var r = require('rethinkdb');
var async = require('async');
module.exports=class RequestParser{
  constructor(query){
    this.context=[]
    this.alowedCommands=[
      'db',
      'table',
      'get',
      'pluck',
      'filter',
      'orderBy',
      'skip',
      'limit',
      'count',
      'distinct',
      'insert',
      'update',
      'delete',
      'changes'
    ]
    if(query){this.query=query;}
    else this.query=r;
  }
  Query(commandset){
    if (this.alowedCommands.indexOf(commandset.command) > -1) {
      this.context.push(commandset.command)
      let query;
      if(commandset.argumentType ==='none'){
        query=this.query[commandset.command]()
      }
      else if(commandset.argumentType ==='value'){
        query=this.query[commandset.command](commandset.argument)
      }
      else if(commandset.argumentType ==='query'){
        let arg=new RequestParser().ParseQueryChain(commandset.argument)._getQuery()
        query=this.query[commandset.command](arg)
      }
      else{
        throw "Unknown error";
      }
      if(commandset.command=='changes'){
        this.feed=true;
      }
      else if(commandset.command=='changes'){

      }
      return query;
    }
    return null;
  }
  ParseQueryChain(chain){
    chain.forEach(elem => {
      this.query=this.Query(elem)
    });
  }
  Run(conn){
    return {context:this.context,cursor:this.query.run(conn)};
  }
  _getQuery(){
    return this.qury
  }
}
