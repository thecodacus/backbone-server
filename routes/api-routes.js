var express=require('express')
var router = express.Router()
router.get('/',(req,res)=>{
  res.send('OK');
});
router.use('/user',require('./api/users-public'))
//router.use(require('../middlewares/validate-token'))
router.use('/image',require('./api/image-private'))
router.use('/account',require('./api/users-private'))

module.exports=router;
