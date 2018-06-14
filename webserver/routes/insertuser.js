const dbo = require('../lib/mongo');
//アカウント登録処理
exports.post = function(req,res){
  const logid = req.body._id;
  const logpass= req.body.pass;
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
      res.json(inquiry);
    }/*else if(logid.length<8){
      inquiry=2;
      res.json(inquiry);
    }else if(logpass.length<8){
      inquiry=3;
      res.json(inquiry);
    }*/
    else{
      dbo.insert("UserData","user",key,function(JSON){
        inquiry = 4;
        console.log("1 " +inquiry);
        res.json(inquiry);
      });
    }
  });
};
