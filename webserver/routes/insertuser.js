const dbo = require('../lib/mongo');
//ログイン処理
exports.post = function(req,res){
  console.log(req.body);
  const logid = req.body.id;
  const logpass= req.body.pass;
  const key = {
    _id:logid,
    pass:logpass
  }
  dbo.logaggregate([{$match:{_id:logid}}],function(result){
    //console.log(result);
    let inquiry;
    if(result[0]){
      inquiry=false;
    }else{
      dbo.insert("UserData","user",key);
      inquiry=true;
    }
    res.json(inquiry);
  });
};
