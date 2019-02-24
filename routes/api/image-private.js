var path=require('path');
var express=require('express');
var router = express.Router();
var multer = require('multer');
const fs = require('fs');
var ImageModel= require('../../models/images');
//var upload= multer({dest:'public/uploads/'})
var storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'public/uploads')
  },
  filename:function(req,file,cb){
    let timestamp=new Date().toISOString();
    cb(null,timestamp+file.originalname);
  }
});
var fileFilter=(req,file,cb)=>{
  if(file.mimetype==='image/jpeg'||file.mimetype==='image/png'){
    cb(null,true);
  }
  else{
    cb(new Error('file type is not supported'),false);
  }
}
var upload= multer({
  storage:storage,
  fileFilter:fileFilter
});

router.get('/',(req,res)=>{
  res.send('OK');
});
router.post('/',upload.single('image'),(req,res)=>{
  console.log(req.file);
  let imageData={
    caption:req.body.caption,
    alt:req.body.alt,
    description:req.body.description,
    filename:req.file.filename,
    mimetype:req.file.mimetype,
    path:req.file.path
  }
  ImageModel.insert(imageData,(error,response)=>{
    if(error) {
      return res.json({"error" : true,"message" : error})
    }
    res.json({"error" : false,"message" : "Added new image"});
  });
});
router.delete('/',(req,res)=>{
  let id=req.body.id;
  ImageModel.findById(id,(err,data)=>{
    if(err){
      return res.json({"error" : true,"message" : error})
    }
    if(!data){return res.json({"error" : true,"message" : 'no file present with that id'})}
    if(!data.path){
      ImageModel.delete(req.body.id,(error,response)=>{});
      return res.json({"error" : true,"message" : 'no file present storage'})
    }
    fs.unlink(path.join(global.publicpath,data.path), (err) => {
      if (err) return res.json({"error" : true,"message" : error});
      ImageModel.delete(req.body.id,(error,response)=>{
        if(error) {
          return res.json({"error" : true,"message" : error})
        }
        res.json({"error" : false,"message" : "image deleted"});
      });
    });
  });
});


module.exports=router;
