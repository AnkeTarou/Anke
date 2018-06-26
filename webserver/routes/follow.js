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
  dbo.aggregate("user",userKey)
  .then(function(result){
    if(result[0]){
      dbo.userCheck(param.user)
      .then(function(result1){
        if(result1){
          console.log(result1._id);
          dbo.follow(result1[0]._id,param.followUserId,param.follow,followKey,followerKey,
          function(resFollow){
            res.json(resFollow);
          });
        }else{
          res.json(null);
        }
      })
    }else{
      res.json(null);
    }
  })
}
