const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const key = {$regex:".*"+req.body.value+".*"};
  const keyObj = [
    {$match:{$or:[{_id:key}]}},
    {$project:{_id:1,follow:1,follower:1,good:1,post:1}}
  ];
  dbo.aggregate("UserData","user",keyObj,function(JSON){
    res.json(JSON);
  });
}
