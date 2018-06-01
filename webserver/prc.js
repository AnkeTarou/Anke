var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const key = {$regex:".*"+""+".*"};
const obj = [{$match:{$or:[{query:key},{"ansers.anser":key}]}}];
MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
  if (error) throw error;
  const dbo = database.db("QuestionData");
  dbo.collection("question").aggregate([{$project:{total:{$sum:"$ansers.total"}}},{$sort:{total:-1}}]).toArray(function(err, result) {
    if (err) throw err;
    database.close();
    console.log(result);
  });
});
