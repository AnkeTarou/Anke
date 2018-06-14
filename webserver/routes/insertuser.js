const dbo = require('../lib/mongo');
//アカウント登録処理
exports.post = function(req,res){
  const logid = req.body._id;
  const logpass= req.body.pass;
  const key = {
    _id:logid,
    pass:logpass,
    gender:"int",
    birthday:"int",
    age:"int",
    area:"String",
    follow:[],
    follower:[]
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
    }else if( (gender != 1) && (gender != 2) ){
      inquiry=5;
      res.json(inquiry);
    }else if(!age.value){
      inquiry=6;
      res.json(inquiry);
    }else if(!area.value){
      inquiry=7;
      res.json(inquiry);
    }else if(!birthday.value){
      inquiry=8;
      res.json(inquiry);
    }*/
    else{
      dbo.insert("UserData","user",key,function(JSON){
        inquiry = 4;
        res.json(inquiry);
      });
    }
  });
};
