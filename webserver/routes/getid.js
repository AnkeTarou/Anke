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
  dbo.insert("LoginUserData","loginuser",key);
  res.json(true);
};
