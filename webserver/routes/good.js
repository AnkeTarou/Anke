const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const param = req.body;
  const key = [{$match:{_id:require('mongodb').ObjectID(param.id)}}];
  dbo.good(param.user,param.id,param.good,key,function(JSON){
    console.log(JSON[0]);
    res.json(JSON[0]);
  });
}
