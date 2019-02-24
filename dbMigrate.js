var rdb = require('rethinkdb');
global.config = require('./config');
module.exports=()=>rdb.connect({
  host: global.config.dbHost,
  port: global.config.dbPost}
).then((conn)=>{
  // setting up users table
  rdb.dbList().contains('users')
  .do((exist)=>rdb.branch(
      exist,
      { dbs_created: 0 },
      rdb.dbCreate('users')
    )
  ).run(conn)
  .then(data=>rdb.branch(
      data['dbs_created']==0,
      rdb.db('users').tableList().contains('login').do(
        (exist)=>rdb.branch(
          exist,
          { tables_created: 0 },
          rdb.db('users').tableCreate('login')
        )
      ),
      rdb.db('users').tableCreate('login')
    ).run(conn)
  )
  .then(data=>rdb.branch(
      data['tables_created']==1,
      rdb.db('users').table('login').insert({
        email:  "backbone",
        password:  "developer"
      }),
      {}
    ).run(conn)
  )
  // settings up blog db and post/uploads table
  rdb.dbList().contains('blog')
  .do((exist)=>rdb.branch(
      exist,
      { dbs_created: 0 },
      rdb.dbCreate('blog')
    )
  ).run(conn)
  .then(result=>rdb.branch(
      result['dbs_created']===1,
      rdb.db('blog').tableCreate('post'),
      rdb.db('blog').tableList().contains('post')
      .do(
        (exist)=>rdb.branch(
          exist,
          { tables_created: 0 },
          rdb.db('blog').tableCreate('post')
        )
      )
    ).run(conn)
  )
  // settings up upload table
  .then(()=>rdb.db('blog').tableList().contains('upload').do(
      (exist)=>rdb.branch(
        exist,
        { tables_created: 0 },
        rdb.db('blog').tableCreate('upload')
      )
    ).run(conn)
  )
})
