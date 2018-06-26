const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const key = req.body;
  dbo.userCheck(key.user)
  .then(function(result){
    if(result){
      res.json(result[0]);
    }else{
      res.json(null);
    }
  })
}
