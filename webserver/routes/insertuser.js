const dbo = require('../lib/mongo');
//ログイン処理
exports.post = function(req,res){
  console.log(req.body);
  const logid = req.body.id;
  const logpass= req.body.pass;
  const key = {
    userId:logid,
    pass:logpass
  }
  dbo.logaggregate([{$match:{userId:logid}}],function(result){
    //console.log(result);
    let inquiry;
    if(result[0]){
      inquiry=false;
    }else{
      dbo.insert("UserData","user",key);
      inquiry=true;
    }
    res.json(inquiry);
  })
};
