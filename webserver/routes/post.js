const dbo = require('../lib/mongo');

exports.post = function(req,res){
<<<<<<< HEAD
  let check;
  dbo.userCheck(req.body.user,function(result){
    check = result;
    console.log(check);
    if(check){
      console.log("成功");
      const key = req.body;
      const ans = [];
      for(let i in key.ansers){
        ans[i] = {anser:key.ansers[i],total:0};
      }
      key.ansers = ans;
      dbo.insert("QuestionData","question",key);
      res.json(key);
    }else{
      console.log("失敗");
    }
  });
=======
  const key = req.body;
  const ans = [];
  for(let i in key.answers){
    ans[i] = {answer:key.answers[i],total:0};
  }
  key.answers = ans;
  dbo.insert("QuestionData","question",key);
  res.json(key);
>>>>>>> 343545ce7642830e06f45676dbb05782c84ef8d0
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
