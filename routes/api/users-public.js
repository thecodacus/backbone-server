var express=require('express')
var router = express.Router()
var UserModel = require('../../models/users');
var jwt = require('jsonwebtoken');

// get user <<insert>>
router.get('/',(req,res)=>{
  res.send('OK2')
});
//create new user <<insert>>
router.post('/',(req,res)=>{
  var data = {
    email : req.body.email,
    password : req.body.password
  };
  UserModel.addNewUser(data,function(error,response) {
    if(error) {
      return res.json({"error" : true,"message" : error})
    }
    res.json({"error" : false,"message" : "Added new user"});
  });
});


router.post('/login', (req,res) => {
  //perform user login
  console.log(req.body);
  if(!req.body.email||!req.body.password){
    return res.json({
        error: true,
        message: 'incomplete data',
    });
  }
  console.log("data found");
  UserModel.findUser(req.body.email,function(error,response) {
    if(error) {
      return res.json({"error" : true,"message" : error});
    }
    if(!response) {
      return res.json({"error" : true,"message" : "User not found"});
    }
    if(response.password !== req.body.password) {
      return res.json({"error" : true,"message" : "Password mismatch"});
    }
    var token = jwt.sign(response, global.credentials.secret, {
        expiresIn: 1440 // expires in 1 hours
    });

    res.json({
        error: false,
        message: 'Validation successful!',
        token: token,
        expiresIn:1440
    });
  });
});
router.post('/token', (req,res) => {
    // refresh the damn token
    const postData = req.body
    // if refresh token exists
    if((postData.refreshToken) && (postData.refreshToken in tokenList)) {
        const user = {
            "email": postData.email,
            "name": postData.name
        }
        const token = jwt.sign(user, config.secret, { expiresIn: config.tokenLife})
        const response = {
            "token": token,
        }
        // update the token in the list
        tokenList[postData.refreshToken].token = token
        res.status(200).json(response);
    } else {
        res.status(404).send('Invalid request')
    }
})

module.exports=router;
