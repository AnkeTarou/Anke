const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const param = req.body;
  const key = [
    {$match:{_id:param.user._id}},
    {$project:{countFollow:{$size:"$follow"}}}
  ];
  const userKey = [
    {$match:{_id:param.followUserId}}
  ];
  dbo.aggregate("UserData","user",userKey,function(JSON){
    if(JSON[0]){
      dbo.userCheck(param.user,function(result){
        if(result){
          dbo.follow(result._id,param.followUserId,param.follow,key,function(JSON){
            res.json(JSON[0]);
          });
        }else{
          res.json(null);
        }
      });
    }else{
      res.json(null);
    }
  });
}
