const dbo = require('../lib/mongo');

exports.get = function(req,res){
  let user = req.session.user;
  if(!user){
    user = {_id:""};
  }
  const key = [
    {$match:{_id:user._id}},
    {$project:{
      followcount:{$size:"$follow"},
      followercount:{$size:"$follower"},
      favoritecount:{$size:"$favorite"},
      nickname:1,
      img:1
    }}
  ]

  dbo.aggregate("user",key)
  .then(function(result1){
    const key = [
      {$match:{voters:user._id}},
      {$count:"votecount"}
    ]
    dbo.aggregate("question",key)
    .then(function(result){
      console.log(result1[0]);
      console.log(result[0])
      const homekey = Object.assign(result1[0],result[0]);
      res.render("../views/home",homekey);
    })
    .catch(function(err){
      console.log(err);
      res.render("../views/home")
    })
  })
  .catch(function(err){
    console.log(err);
    res.render("../views/home");
  })
}

exports.post = function(req,res){
  let user = req.session.user;
  if(!user){
    user = {
      _id:"",
      sessionkey:""
    };
  }
  const userKey = [
    {$match:{_id:user._id}},
    {$project:{
      follow:1
    }}
  ]
  dbo.userCheck(user)
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
      //検索して結果を返す
      dbo.aggregate("user",userKey)
      .then(function(result){
        console.log("result",result);
        const index = indexCheck(req.body.index,req.body.type);
        const questionKey = [
          {$lookup:{
              from:"user",
              let:{senderId:"$senderId"},
              pipeline:[{$match:{$expr:{$eq:["$$senderId","$_id"]}}}],
              as:"inventory"
          }},
          {$match:{$or:[{"senderId":user._id},{"senderId":{$in:result[0].follow}}]}},
          {$unwind:"$answers"},
          {$unwind:"$inventory"},
          {$group:{
            _id:"$_id",
            senderId:{$first:"$senderId"},
            query:{$first:"$query"},
            type:{$first:"$type"},
            answers:{$push:{
              answer:"$answers.answer",
              total:{$size:"$answers.voter"}
            }},
            answer:{$push:{
              answer:"$answers.answer"
            }},
            voters:{$first:"$voters"},
            comment:{$first:{$size:"$comment"}},
            favorite:{$first:"$favorite"},
            date:{$first:"$date"},
            inventory:{$first:"$inventory"}
          }},
          {$project:{
            _id:1,
            senderId:1,
            query:1,
            type:1,
            total:{$size:"$voters"},
            comment:1,
            favorite:{$size:"$favorite"},
            date:1,
            "inventory.nickname":1,
            "inventory.img":1,
            answers:{
              $cond:{
                if:{$in:[user._id,"$voters"]},
                then:"$answers",
                else:"$answer"
              }
            },
            result:{
              $cond:{
                if:{$in:[user._id,"$voters"]},
                then:true,
                else:false
              }
            },
            myfavorite:{
              $cond:{
                if:{$in:[user._id,"$favorite"]},
                then:true,
                else:false
              }
            }
          }},
          {$sort:{date:-1}},
          {$skip:index},
          {$limit:15}
        ];
        dbo.aggregate("question",questionKey)
        .then(function(result1){
          /**** 検索結果を整形する ****/
          let conFlg = (result1.length == 15); //次の該当項目が存在するかどうか
          let size = result1.length;
          for(let i = 0; i < size; i++){
            // どのリクエストからか判別
            if(req.body.type == "new"){
              if(result1[i]._id == req.body.topId){
                result1.splice(i, size-i);
                break;
              }
            }else{
              if(result1[i]._id == req.body.bottomId){
                result1.splice(0, i+1);
                i = 0;
                size = result1.length;
              }
            }
          }
          //　レスポンスオブジェクトの生成
          const response = {
            result:result1,
            conFlg:conFlg
          }
          res.json(response);
        })
        .catch(function(err){
          console.log(err);
          res.json(null)
        })
      })
      .catch(function(err){
        console.log(err);
        res.rson(null);
      })
    }else{
      // ユーザー認証失敗ならnullを返す
      res.json(null);
    }
  })
  .catch(function(error) {
    console.log(error);
    res.json(null);
  });
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
