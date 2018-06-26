const dbo = require('../lib/mongo');

// 検索処理　１単語のみの検索に対応
exports.post = function(req,res){
  

  // 検索キーを生成
  let keyObj = createKeyObj(
    sortCheck(req.body.sort),
    orderCheck(req.body.order),
    req.body.searchText
  );

  //  未ログインなら検索結果だけを返す
  if(!req.body.user){
    dbo.aggregate("QuestionData","question",keyObj)
    .then(function(result){
      console.log(result);
      res.render("search",{json:result});
    });
  }
  // ログイン状態かチェック
  if(req.body.user){
    dbo.userCheck(req.body.user)
    .then(function(usercheck){
      if(usercheck){
        return true;
      }else{
        return false;
      }
    })
    .then(function(usercheck) {
      if(usercheck){
        // ユーザー認証成功
        //検索キーを更新
        keyObj[1].$project.voters = 1;
        //検索して結果を返す
        dbo.aggregate("QuestionData","question",keyObj)
        .then(function(result){
          // 検索結果を整形する
          for(let i in result){
            result[i].result = false;
            for(let j = 0; j < result[i].voters.length; j++){
              if(result[i].voters[j] = req.body.user._id){
                result[i].result = true;
              }
            }
          }
          res.json(result);
        });
      }else{
        // ユーザー認証失敗ならnullを返す
        res.json(null);
      }
    })
    .catch(function(error) {
      console.log(error);
    });
  }
};

/**
 *sortの形式をチェック
 *引数param
 *@ req.body.sort <String>
 *return total or sort <String>
**/
function sortCheck(sort) {
  let check = (sort == "total") || (sort == "good") || (sort == "date");
  if(!check){
    return "total";
  }else{
    return sort;
  }
}

/**
 *orderの形式をチェック
 *引数param
 *@ req.body.order <int>
 *return -1 or order <int>
**/
function orderCheck(order) {
  let check = (order == 1) || (order == -1);
  if(!check){
    return -1;
  }else{
    return order;
  }
}

/**
 *検索キーを生成して返す
 *引数param
 *@ req.body.sort <String>
 *@ req.body.order <int>
 *@ req.body.value <String>
 *return keyObj <object>
**/
function createKeyObj(sort,order,value) {
  value = value.toString();
  const key = {$regex:".*"+value+".*"};
  let keyObj = [
    {$match:{$or:[{query:key},{"answers.answer":key}]}},
    {$project:{query:1,type:1,[`answers.answer`]:1,total:{$size:"$voters"},good:{$size:"$good"},time:1}},
    {$limit:15}
  ];
  order = parseInt(order, 10);

  if(sort == "date"){
    keyObj[3] = {$sort:{time:order}};
  }else if(sort == "good"){
    keyObj[3] = {$sort:{good:order}};
  }else if(sort == "total"){
    keyObj[3] = {$sort:{total:order}};
  }
  return keyObj;
}
