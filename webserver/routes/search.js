const dbo = require('../lib/mongo');

// 検索処理　１単語のみの検索に対応
exports.post = function(req,res){
  const key = {$regex:".*"+req.body.value+".*"};
  let usercheck;

  let check = sortCheck(req.body.sort) && orderCheck(req.body.order);
  let keyObj = createKeyObj(req.body.sort,req.body.order,key);

  // ログイン状態かチェック
  if(req.body.user){
    const promise = new Promise(function(resolve,reject) {
      //　ユーザー認証
      usercheck = userCheck(req.body.user);
      resolve();
    })
    .then(function() {
      setTimeout(function() {
        if(usercheck && check){
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

};

// req.body.sortを引数でもらう
function sortCheck(sort) {
  if((sort == "total") || (sort == "good") || (sort == "date")){
    return true;
  }else{
    return false;
  }
}

// req.body.rderをもらう
function orderCheck(order) {
  if( (order == 1) || (order == -1) ){
    return true;
  }else{
    return false;
  }
}

// req.body.sort,req.body.order,keyを引数にもらう
function createKeyObj(sort,order,key) {
  let keyObj = [
    {$match:{$or:[{query:key},{"answers.answer":key}]}},
    {$project:{query:1,type:1,[`answers.answer`]:1,total:{$size:"$voters"},good:{$size:"$good"},time:1}}
  ];
  order = parseInt(order, 10);

  if(sort == "total"){
    keyObj[2] = {$sort:{total:order}};
  }else if(sort == "good"){
    keyObj[2] = {$sort:{good:order}};
  }else if(sort == "date"){
    keyObj[2] = {$sort:{time:order}};
  }else{
    keyObj[2] = null;
  }
  return keyObj;
}
