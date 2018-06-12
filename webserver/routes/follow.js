const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const param = req.body;
  const key = [{$match:{_id:param.user_id}},
                {$project:{countFollow:{$size:"$follow"}}}
              ];
  dbo.follow(param.user_id,param.followUser_id,param.follow,key,function(JSON){
    console.log(JSON[0]);
    res.json(JSON[0]);
  });
}
