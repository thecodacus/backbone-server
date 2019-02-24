var express=require('express')
var router = express.Router()

router.get('/',(req,res)=>{
  res.send('this is a private api')
})
router.get('/update',(req,res)=>{
  res.send('this is a private api')
})

module.exports=router;
