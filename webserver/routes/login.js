const dbo = require('../lib/mongo');
//ログイン処理
exports.post = function(req,res){
  const logid = req.body.id;
  const logpass= req.body.pass;
  let inquiry;
  let result;
  dbo.logaggregate([{$match:{userId:logid,pass:logpass}}],function(result){
    //console.log(result);
    if(result[0]){
      inquiry=true;
    }else{
      inquiry=false;
    }
  })
  console.log(inquiry);
  res.json(inquiry);
};
