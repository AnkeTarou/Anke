const dbo = require('../lib/mongo');

// 検索処理　１単語のみの検索に対応
exports.post = function(req,res){
  const key = {$regex:".*"+req.body.value+".*"};
  const keyObj = [
    {$match:{$or:[{query:key},{"answers.answer":key}]}},
    {$project:{query:1,[`answers.answer`]:1,total:{$sum:"$answers.total"},answerType:1}},
    {$sort:{total:-1}}
  ];
  dbo.aggregate("QuestionData","question",keyObj,function(JSON){
    res.json(JSON);
  });
};

/*
req.body = {
  value:"検索したい文字列"
}
 */
