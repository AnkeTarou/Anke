const dbo = require('../lib/mongo');

// 検索処理　１単語のみの検索に対応
exports.get = function(req,res){
  let obj = {
    sort:sortCheck(req.query.sort),
    order:orderCheck(req.query.order),
    text:textCheck(req.query.text),
    index:0
  }
  res.render("search",obj);
}

exports.post = function(req,res){
  // 検索キーを生成
  let keyObj = createKeyObj(
    sortCheck(req.body.sort),
    orderCheck(req.body.order),
    textCheck(req.body.text),
    indexCheck(req.body.index,req.body.type),
    req.session.user

  );

  //  未ログインなら検索結果だけを返す
  if(!req.session.user){
    dbo.aggregate("question",keyObj)
    .then(function(result){
      res.json(result);
    });
  }
  // ログイン状態かチェック
  if(req.session.user){
    dbo.userCheck(req.session.user)
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
        keyObj[3].$project["answers.total"] = 1;
        //検索して結果を返す
        dbo.aggregate("question",keyObj)
        .then(function(result){
          /**** 検索結果を整形する ****/
          let conFlg = (result.length == 15); //次の該当項目が存在するかどうか
          let size = result.length;
          for(let i = 0; i < size; i++){
            // どのリクエストからか判別
            if(req.body.type == "new"){
              if(result[i]._id == req.body.topId){
                result.splice(i, size-i);
                break;
              }
            }else{
              if(result[i]._id == req.body.bottomId){
                result.splice(0, i+1);
                i = 0;
                size = result.length;
              }
            }

            if(!result[i].result){
              for(let j = 0; j < result[i].answers.length; j++){
                result[i].answers[j].total = null;
              }
            }
          }
          //　レスポンスオブジェクトの生成
          const response = {
            result:result,
            conFlg:conFlg
          }
          res.json(response);
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
 *textの形式をチェック
 *引数param
 *@ <String> req.body.text
 *return <String> text
**/
function textCheck(text){
  if(text == undefined){
    text = "";
  }
  return text.toString();
}

/**
 *sortの形式をチェック
 *引数param
 *@ <String> req.body.sort
 *return <String> total or sort
**/
function sortCheck(sort) {
  let check = (sort == "total") || (sort == "good") || (sort == "date");
  if(!check){
    return "date";
  }else{
    return sort;
  }
}

/**
 *orderの形式をチェック
 *引数param
 *@ <int> req.body.order
 *return <int> -1 or order
**/
function orderCheck(order) {
  let check = (order == 1) || (order == -1);
  if(!check){
    return -1;
  }else{
    return parseInt(order);
  }
}

/**
 *indexの形式をチェック
 *引数param
 *@ <int> req.body.index
 *@ <String> req.body.type
 *return <int> 0 or index
**/
function indexCheck(num,type){
  let index;
  if(Number.isNaN(index = parseInt(num)) || type == "new"){
    return 0;
  }
  return index;
}

/**
 *検索キーを生成して返す
 *引数param
 *@ <String> req.body.sort
 *@ <int> req.body.order
 *@ <String> req.body.text
 *return <object> keyObj
**/
function createKeyObj(sort,order,text,index,user) {
  if(!user){
    user = {_id:""};
  }
  text = text.toString() || "";
  const key = {$regex:".*"+text+".*"};
  let keyObj = [
    {$match:{$or:[{query:key},{"answers.answer":key}]}},
    {$unwind:"$answers"},
    {$group:{
      _id:"$_id",
      senderId:{$first:"$senderId"},
      query:{$first:"$query"},
      type:{$first:"$type"},
      answers:{$push:{
        answer:"$answers.answer",
        total:{$size:"$answers.voter"}
      }},
      voters:{$first:"$voters"},
      total:{$first:{$size:"$voters"}},
      comment:{$first:{$size:"$comment"}},
      favorites:{$first:"$favorite"},
      favorite:{$first:{$size:"$favorite"}},
      date:{$first:"$date"},
    }},
    {$project:{
      _id:1,
      senderId:1,
      query:1,
      type:1,
      voters:"$$REMOVE",
      favorites:"$$REMOVE",
      total:1,
      "answers.answer":1,
      comment:1,
      favorite:1,
      date:1,
      result:{
        $cond:{
          if:{$in:[user._id,"$voters"]},
          then:true,
          else:false
        }
      },
      myfavorite:{
        $cond:{
          if:{$in:[user._id,"$favorites"]},
          then:true,
          else:false
        }
      }
    }}
  ];

  if(sort == "date"){
    keyObj[4] = {$sort:{date:order}};
  }else if(sort == "favorite"){
    keyObj[4] = {$sort:{favorite:order}};
  }else if(sort == "total"){
    keyObj[4] = {$sort:{total:order}};
  }

  keyObj[5] = {$skip:index};
  keyObj[6] = {$limit:15};

  return keyObj;
}
