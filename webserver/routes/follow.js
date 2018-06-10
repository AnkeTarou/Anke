const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const param = req.body;
  const key = [{$match:{_id:param.id}}]
  dbo.follow(param.own,param.id,param.follow,key,function(JSON){
    console.log(JSON[0]);
    res.json(JSON[0]);
  });
}
