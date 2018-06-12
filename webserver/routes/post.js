const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const key = req.body;
  let check = !(key.query.value == "");
  const ans = [];
  const voters = [];
  const good = [];
  for(let i in key.answers){
    console.log(key.answers);
    ans[i] = {answer:key.answers[i],voter:[]};
    if(key.answers[i].value == ""){
      check = false;
    }
  }
  key.answers = ans;
  key.voters = voters;
  key.good = good;
  dbo.userCheck(key.user,function(result){
    if(result && check){
      dbo.insert("QuestionData","question",key,function(result){
        res.json(result);
      });
    }else{
      res.json(null);
    }
  });
}
