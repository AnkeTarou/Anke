const dbo = require('../lib/mongo');

/** 投票 **/
exports.post = function(req,res){
  const param = req.body;
  const key = [
    {$match:{_id:require('mongodb').ObjectID(param.id)}},
    {$project:{_id:1,answers:1,total:{$sum:"$answers.total"},good:1,comment:1}}
  ];

  dbo.vote(param.user, param.id, param.index, key, function(json){
    console.log(json[0]);
    res.json(json[0]);
  });
};
/*
req.body = {
  id:""投稿のObjectId",index:"何番目を選んだか"
}
 */
