const dbo = require('../lib/mongo');
const ObjectID = require('mongodb').ObjectID;

exports.post = function(req,res){
  const param = req.body;
  const commentId = new ObjectID;       //commentId生成
  const key = [
    {$match:{_id:ObjectID(param.id)}},
    {$project:{comment:1}}
  ];
  let check = true;                    //送信オブジェクトの整合性を確認する
  let err;                             //エラーコードを保持する /*@<int>*/

  //commentIdの一意性をチェック
  dbo.aggregate("QuestionData","question",key,function(resComment){
    if(resComment){
      for(let i = 0; i<resComment.length; i++){
        if(resComment[i].commentId == commentId){
          check = false;
          // commentIdが重複
          err = 1;
        }
      }
    }else{
      //　投稿が存在しない
      err = 2;
    }
  });

  dbo.userCheck(param.user,function(result){
    if(result && check){
      dbo.comment(param.id,param.user._id,param.content,commentId,key,function(JSON){
        // 成功オブジェクトをresponseで返す
        res.json({result:"OK",comment:JSON[0]});
      });
    }else{
      if(!result){
        //ユーザー認証に失敗
        err = 3;
      }
      //　エラーオブジェクトを返す
      res.json({result:"err",'err':err});
    }
  });
}
