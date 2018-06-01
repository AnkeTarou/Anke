const dbo = require('../lib/mongo');
//ログイン処理
exports.post = function(req,res){
  console.log(req.body);
  const logid = req.body.id;
  const logpass= req.body.pass;
  let inquiry;
  let result;
  //const result=db.question.find(id:logid,pass:logpass)
  dbo.logaggregate([{$match:{userId:logid,pass:logpass}}],function(result){
    if(result[0]){
      inquiry=true;
    }else{
      inquiry=false;
    }
  })
  console.log(inquiry);
  res.json(inquiry);
};
