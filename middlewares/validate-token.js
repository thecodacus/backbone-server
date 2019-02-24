var jwt = require('jsonwebtoken');

module.exports = function(req,res,next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, global.credentials.secret, function(err, decoded) {
      if (err) {
        return res.json({"error": true, "message": 'Failed to authenticate token.' });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      "status": false,
      "message": 'No token provided.'
    });
  }
}
