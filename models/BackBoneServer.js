"use strict";
var rethinkdb = require('rethinkdb');
//var rdb = require('rethinkdbdash')({servers: [,]});
var async = require('async');
var RequestParser = require('./requestParser');
module.exports = class BackBoneServer {
  connect() {
    return rethinkdb.connect({
      host: global.config.dbHost,
      port: global.config.dbPost
    });
  }
  execute(query,conn){
    let rp = new RequestParser();
    rp.ParseQueryChain(query);
    return rp.Run(conn);
  }
  closeConnection(conn){
    conn.close(function(err){ if (err) throw err; })
  }
}
