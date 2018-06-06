const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const param = req.body;
  dbo.comment(param.id,param.user._id,param.content);
  const key = [{$match:{_id:require('mongodb').ObjectID(req.body.id)}}];
  dbo.aggregate("QuestionData","question",key,function(result){
    console.log(result);
    res.json(result);
  });
}
