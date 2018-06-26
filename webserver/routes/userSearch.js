const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const key = {$regex:".*"+req.body.value+".*"};
  const keyObj = [
    {$match:{$or:[{_id:key}]}},
    {$project:{_id:1,follow:1,follower:1}}
  ];
  dbo.aggregate("user",keyObj)
  .then(function(result){
    res.json(result);
  })
}
