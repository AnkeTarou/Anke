const dbo = require('../lib/mongo');

// 検索処理　１単語のみの検索に対応
exports.post = function(req,res){
  let err;
  let usercheck;
  const key = {$regex:".*"+req.body.value+".*"};
  const keyObj = [
    {$match:{$or:[{query:key},{"answers.answer":key}]}},
    {$project:{query:1,[`answers.answer`]:1,total:{$size:"$voters"},type:1}},
    {$sort:{total:-1}}
  ];
  // ログイン状態かチェック
  if(req.body.user){
    const promise = new Promise(function(resolve,reject) {
      //　ユーザー認証
      userCheck(req.body.user);
      resolve();
    })
    .then(function() {
      setTimeout(function() {

        if(usercheck){
          // ユーザー認証成功

          // ここにkeyの更新処理を書く

          //検索して結果を返す
          dbo.aggregate("QuestionData","question",keyObj,function(JSON){
            res.json(JSON);
          });
        }else{
          // ユーザー認証失敗ならerrを返す
          err = 1;
          res.json(null);
        }

      },10);
    })
    .catch(function(error) {
      console.log(error);
    });

  }else{
    //  未ログインなら検索結果だけを返す
    dbo.aggregate("QuestionData","question",keyObj,function(JSON){
      res.json(JSON);
    });
  }

  function userCheck(user) {
    dbo.userCheck(user,function(result){
      if(result){
        usercheck = true;
      }else{
        usercheck = false;
      }
    });
  }

  function aggregate(){
    dbo.aggregate("QuestionData","question",keyObj,function(JSON){
      res.json(JSON);
    });
  }

};
