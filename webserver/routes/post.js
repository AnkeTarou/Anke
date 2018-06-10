const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const key = req.body;
  dbo.userCheck(key.user,function(result){
    if(result){
      const ans = [];
      const Good = {totalgood:0, gooduser:[]};
      for(let i in key.answers){
        console.log(key.answers);
        ans[i] = {answer:key.answers[i],total:0};
      }
      key.answers = ans;
      key.good = Good;
      dbo.insert("QuestionData","question",key);
      res.json(key);
    }else{
      key.replay = "認証に失敗したので投稿できませんでした"
      res.json(key);
    }
  });
}
/*

req.body = {
  query:"質問",
  answers:[
    "選択肢１",
    "選択肢２",
    "選択肢３",
    "選択肢４"
  ]
}
 */
