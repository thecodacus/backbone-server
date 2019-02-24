"use strict";
var rethinkdb = require('rethinkdb');
var async = require('async');


module.exports = class Image {
  constructor(data){this.data=data;}
  static connectToDb(callback) {
    rethinkdb.connect({
      host : 'localhost',
      port : 28015,
      db : 'blog'
    }, function(err,connection) {
      callback(err,connection);
    });
  }
  static insert(imagedata,callback) {
    console.log("inserting new image",imagedata);
    var self = this;
    async.waterfall([
      function(callback) {
        self.connectToDb((err,connection) => {
          if(err) {
            return callback(true,"Error connecting to database");
          }
          callback(null,connection);
        });
      },
      function(connection,callback) {
        rethinkdb.table('upload').insert(imagedata).run(connection,function(err,result) {
            connection.close();
            if(err) {
              return callback(true,"Error happens while adding new image");
            }
            callback(null,result);
        });
      }
    ],function(err,data) {
      callback(err === null ? false : true,data);
    });
  }
  static getAll(){}
  static findById(id,callback) {
    var self = this;
    async.waterfall([
    function(callback) {
      self.connectToDb((err,connection) => {
        if(err) {
          return callback(true,"Error connecting to database");
        }
        callback(null,connection);
      });
    },
    function(connection,callback) {
      rethinkdb.table('upload').filter({"id" : id}).run(connection,function(err,cursor) {
        connection.close();
        if(err) {
          return callback(true,"Error fetching user from database");
        }
        cursor.toArray(function(err, result) {
          if(err) {
            return callback(true,"Error reading cursor");
          }
          //Assuming email will be primary key and unique
          callback(null,result[0]);
        });
      });
    }
    ],function(err,data) {
      callback(err === null ? false : true,data);
    });
  }
  static delete(id,callback){
    console.log("deleting image id: ",id);
    var self = this;
    async.waterfall([
      function(callback) {
        self.connectToDb((err,connection) => {
          if(err) {
            return callback(true,"Error connecting to database");
          }
          callback(null,connection);
        });
      },
      function(connection,callback) {
        rethinkdb.table('upload').filter({"id":id}).delete().run(connection,function(err,result) {
            connection.close();
            if(err) {
              return callback(true,"Error happens while deleting image");
            }
            callback(null,result);
        });
      }
    ],function(err,data) {
      callback(err === null ? false : true,data);
    });
  }
}
