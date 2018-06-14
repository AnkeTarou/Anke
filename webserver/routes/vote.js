const dbo = require('../lib/mongo');

/** 投票 **/
exports.post = function(req,res){
  const param = req.body;
  const objId = require('mongodb').ObjectID(param.id);
  const questionkey = [{$match:{_id:objId}}];
  const responseKey = [
    {$match:{_id:objId}},
    {$project:{_id:1,answers:1,total:{$size:"$voters"},good:1,comment:1}}
  ];

  dbo.aggregate("QuestionData","question",questionkey,function(question){
    if(question[0]){
      let count = 0;
      for(let i = 0; i<question[0].answers.length; i++){
        if(param.index[i]){
            count++;
        }
      }
      if(question[0].answerType == "ラジオ"){
        if(count != 1){
          res.json("不正な値が入力されています");
          return;
        }
      }else if(question[0].answerType == "チェック"){
        if(count < 1){
          res.json("不正な値が入力されています");
          return;
        }
      }
    }
    dbo.userCheck(param.user,function(result){
      if(result){
        console.log("うんこおおおおおおおおおお");
        dbo.vote(param.user, param.id, param.index, responseKey, function(result){
          res.json(result[0]);
        });
      }else{
        res.json(null);
      }
    });
  });
};
/*
req.body = {
  id:""投稿のObjectId",index:"何番目を選んだか"
}
 */
