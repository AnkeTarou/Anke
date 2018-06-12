const dbo = require('../lib/mongo');
//アカウント登録処理
exports.post = function(req,res){
  const logid = req.body._id;
  const logpass= req.body.pass;
  console.log(logpass.length);
  const key = {
    _id:logid,
    pass:logpass,
    follow:[]
  }
  dbo.aggregate("UserData","user",[{$match:{_id:logid}}],function(result){
    //console.log(result);
    let inquiry;
    if(result[0]){
      inquiry=1;
    }/*else if(logid.length<8){
      inquiry=2;
    }else if(logpass.length<8){
      inquiry=3;
    }*/
    else{
      dbo.insert("UserData","user",key,function(result){
        inquiry=4;
      });
    }
    res.json(inquiry);
  });
};
