const dbo = require('../lib/mongo');
//ログイン処理
exports.post = function(req,res){
  const logid = req.body._id;
  const logpass= req.body.pass;
  dbo.aggregate("UserData","user",[{$match:{_id:logid,pass:logpass}}],function(result){
    //console.log(result);
    let inquiry;
    if(result[0]){
      inquiry={boo: true, userid: logid, userpass: logpass};
    }else{
      inquiry={boo: false};
    }
    res.json(inquiry);
  })
};
