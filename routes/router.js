var express=require('express')
var router = express.Router()

router.get('/',(req,res)=>{
  res.render('home');
});

router.use('/api',require('./api-routes'))
module.exports=router;
