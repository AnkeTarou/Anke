const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const obj = req.body;
  const ans = [];
  for(let i in obj.ansers){
    ans[i] = {anser:obj.ansers[i],total:0};
  }
  obj.ansers = ans;
  dbo.insert(obj);
  res.json(obj);
}
