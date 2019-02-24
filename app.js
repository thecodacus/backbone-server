var path=require('path');
var express=require('express');
var cors = require('cors')
var app = express();
var formidable=require('formidable');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var jwt= require('jsonwebtoken');
var RDBStore = require('session-rethinkdb')(session);
var migrate=require('./dbMigrate')();
global.config = require('./config');
global.credentials = require('./credentials');
var rdb = require('rethinkdbdash')({servers: [{host: global.config.dbHost, port: global.config.dbPost},]});

const TWO_HOURS=1000*60*60*2
const{
  PORT=global.config.port,
  NODE_ENV=global.config.environment,
  SESS_LIFETIME=TWO_HOURS,
  SESS_Name = 'sid'
}=process.env;

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const IN_PROD= NODE_ENV==='production';

var store = new RDBStore(rdb, {
  browserSessionsMaxAge: 60000, // optional, default is 60000. After how much time should an expired session be cleared from the database
  clearInterval: 60000, // optional, default is 60000. How often do you want to check and clear expired sessions
});
global.publicpath=path.join(__dirname, 'public');

app.engine('handlebars',handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port',PORT);

app.use(cors())
app.use(express.static(global.publicpath));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({extended:true}));
app.use(require('cookie-parser')(global.credentials.cookieSecret));
app.use(session({
  name:SESS_Name,
  secret:credentials.cookieSecret,
  cookie:{
    maxAge:SESS_LIFETIME,
    sameSite:true,
    secure: IN_PROD,
  },
  resave:false,
  saveUninitialized:false,
  store: store,
}));
app.use('/',require('./routes/router'));

module.exports=app;
