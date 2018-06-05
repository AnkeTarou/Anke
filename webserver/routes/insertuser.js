const dbo = require('../lib/mongo');
//ログイン処理
exports.post = function(req,res){
  const logid = req.body._id;
  const logpass= req.body.pass;
  const key = {
    _id:logid,
    pass:logpass
  }
  dbo.aggregate("UserData","user",[{$match:{_id:logid}}],function(result){
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
