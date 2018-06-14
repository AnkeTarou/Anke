const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const param = req.body;
  const key = [
    {$match:{_id:require('mongodb').ObjectID(param.id)}},
    {$project:{totalGood:{$size:"$good"}}}
  ];

  dbo.userCheck(param.user,function(result){
    if(result){
      dbo.good(param.user,param.id,param.good,key,function(JSON){
        console.log(JSON[0]);
        res.json(JSON[0]);
      });
    }else{
      res.json(null);
    }
  });
}
