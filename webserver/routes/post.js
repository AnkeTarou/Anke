const dbo = require('../lib/mongo');

exports.post = function(req,res){
  let check;
  dbo.userCheck(req.body.user,function(result){
    console.log(result);
    if(result){
      console.log("成功");
      const key = req.body;
      const ans = [];
      for(let i in key.answers){
        console.log(key.answers);
        ans[i] = {answer:key.answers[i],total:0};
      }
      key.answers = ans;
      dbo.insert("QuestionData","question",key);
      res.json(key);
    }else{
      console.log("失敗");
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
