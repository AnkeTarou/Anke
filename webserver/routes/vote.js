const dbo = require('../lib/mongo');

/** 投票 **/
exports.post = function(req,res){
  dbo.vote(req.body.id,req.body.index);
  const key = [
    {$match:{_id:require('mongodb').ObjectID(req.body.id)}},
    {$project:{_id:1,ansers:1,total:{$sum:"$ansers.total"}}}
  ]
  dbo.aggregate("QuestionData","question",key,function(JSON){
    res.json(JSON[0]);
  });
};
