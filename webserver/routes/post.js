const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const key = req.body;
  let check = !(key.query.value == "");
  const ans = [];
  const good = [];
  for(let i in key.answers){
    console.log(key.answers);
    ans[i] = {answer:key.answers[i],total:0};
    if(key.answers[i].value == ""){
      check = false;
    }
  }
  key.answers = ans;
  key.gooduser = good;
  if(check){
    dbo.post(key,function(result){
      res.json(result);
    });
  }else{
    res.json(null);
  }
}
