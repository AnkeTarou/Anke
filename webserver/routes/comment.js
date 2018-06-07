const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const param = req.body;
  const key = [{$match:{_id:require('mongodb').ObjectID(param.id)}}];

  dbo.comment(param.id,param.user._id,param.content,key,function(JSON){
    console.log(JSON[0]);
    res.json(JSON[0]);
  });
}
