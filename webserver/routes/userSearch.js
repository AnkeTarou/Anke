const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const key = {$regex:".*"+req.body.value+".*"};
  const keyObj = [
    {$match:{$or:[{_id:key}]}},
    {$project:{_id:1,follow:1,follower:2}}
  ];
  dbo.aggregate("UserData","user",keyObj,function(JSON){
    res.json(JSON);
  });
}
