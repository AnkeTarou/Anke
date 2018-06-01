const dbo = require('../lib/mongo');
//ログイン処理
exports.post = function(req,res){
  console.log(req.body);
  const logid = req.body.id;
  const logpass= req.body.pass;
  let inquiry=true;
  let result=[];
  console.log(inquiry);
  res.json(inquiry);
};
