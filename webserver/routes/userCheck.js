const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const key = req.body;
  dbo.userCheck(key.user,function(result){
    if(result){
      res.json(result);
    }else{
      res.json(result);
    }
  });
}
