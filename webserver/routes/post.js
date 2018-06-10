const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const key = req.body;
  const ans = [];
  const Good = {totalgood:0, gooduser:[]};
  for(let i in key.answers){
    console.log(key.answers);
    ans[i] = {answer:key.answers[i],total:0};
  }
  key.answers = ans;
  key.good = Good;
  dbo.post(key,function(result){
    res.json(result);
  });
}
