const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const param = req.body;
  const followKey = [
    {$match:{_id:param.user._id}},
    {$project:{countFollow:{$size:"$follow"},countFollower:{$size:"$follower"}}}
  ];
  const followerKey = [
    {$match:{_id:param.followUserId}},
    {$project:{countFollow:{$size:"$follow"},countFollower:{$size:"$follower"}}}
  ];
  const userKey = [
    {$match:{_id:param.followUserId}}
  ];
  dbo.aggregate("UserData","user",userKey,function(JSON){
    if(JSON[0]){
      dbo.userCheck(param.user,function(result){
        if(result){
          dbo.follow(result._id,param.followUserId,param.follow,followKey,followerKey,
          function(resFollow){
            res.json(resFollow);
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
