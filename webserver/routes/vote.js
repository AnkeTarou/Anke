const dbo = require('../lib/mongo');
const async = require('async');

/** 投票 **/
exports.post = function(req,res){
  const key = [
    {$match:{_id:require('mongodb').ObjectID(req.body.id)}},
    {$project:{_id:1,answers:1,total:{$sum:"$answers.total"},comment:1}}
  ];

  dbo.vote(req.body.id,req.body.index,key,function(json){
    console.log(json[0]);
    res.json(json[0]);
  });
};
/*
req.body = {
  id:""投稿のObjectId",index:"何番目を選んだか"
}
 */
