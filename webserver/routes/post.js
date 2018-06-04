const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const key = req.body;
  const ans = [];
  for(let i in key.ansers){
    ans[i] = {anser:key.ansers[i],total:0};
  }
  key.ansers = ans;
  dbo.insert("QuestionData","question",key);
  res.json(key);
}
/*

req.body = {
  query:"質問",
  ansers:[
    "選択肢１",
    "選択肢２",
    "選択肢３",
    "選択肢４"
  ]
}
 */
