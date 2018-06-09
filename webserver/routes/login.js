const dbo = require('../lib/mongo');
//ログイン処理
exports.post = function(req,res){
  const newSessionkey = createSessionKey();
  let logid;
  let logpass;
  let key;
  let session;

  if(req.body.type == "login"){
    logid = req.body._id;
    logpass= req.body.pass;
    key = [{$match:{_id:logid,pass:logpass}}];
  }else if(req.body.type == "session"){
    session = req.body.session;
    key = [{$match:{sessionkey:session}}];
  }
  dbo.aggregate("UserData","user",key,function(result){
    //console.log(result);
    const user = result[0];
    let inquiry;
    if(user){
      dbo.session(user._id,newSessionkey);
      inquiry={boo: true, userid:user._id, 'sessionkey':newSessionkey};
    }else{
      inquiry={boo: false};
    }
    res.json(inquiry);
  })
};
function createSessionKey(){
  const length = 10;

  // 生成する文字列に含める文字セット
  const c = "abcdefghijklmnopqrstuvwxyz0123456789";

  const cl = c.length;
  let sessionkey = "";
  for(var i=0; i<length; i++){
    sessionkey += c[Math.floor(Math.random()*cl)];
  }
  return sessionkey;
}
