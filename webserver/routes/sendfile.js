const dbo = require('../lib/mongo');

// 検索処理　１単語のみの検索に対応
exports.post = function(req,res){
    console.log(req.body.data);
    //dbo.insert("UserData","user",data);
    res.json(true);
  const key = {$regex:".*"+req.body.value+".*"};
  const keyObj = [
    {$match:{$or:[{query:key},{"answers.answer":key}]}},
    {$project:{query:1,[`answers.answer`]:1,total:{$sum:"$answers.total"}}},
    {$sort:{total:-1}}
  ];
  dbo.aggregate("QuestionData","question",keyObj,function(JSON){
    res.json(JSON);
  });
};
