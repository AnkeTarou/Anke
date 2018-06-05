const dbo = require('../lib/mongo');

// 検索処理　１単語のみの検索に対応
exports.post = function(req,res){
  const key = {$regex:".*"+req.body.value+".*"};
  const keyObj = [
    {$match:{$or:[{query:key},{"ansers.anser":key}]}},
    {$project:{query:1,[`ansers.anser`]:1,total:{$sum:"$ansers.total"}}},
    {$sort:{total:-1}}
  ];
  dbo.aggregate("QuestionData","question",keyObj,function(JSON){
    res.json(JSON);
  });
};
