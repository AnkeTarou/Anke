const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
//callback関数に検索結果を適用する。
exports.aggregate = function(dbName,collectionName,key,callback){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db(dbName);
    dbo.collection(collectionName).aggregate(key).toArray(function(err, result) {
      if (err) throw err;
      database.close();
      callback(result);
    });
  });
};

//ObjectをDBに挿入する
exports.insert = function(dbName,collection,key){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db(dbName);
    dbo.collection(collection).insertOne(key, function(err, result) {
      if (err) throw err;
      database.close();
    });
  });
}

//投票する
exports.vote = function(id,index){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("QuestionData");
    const objId = require('mongodb').ObjectID(id);
    dbo.collection("question").updateOne({_id:objId},{$inc:{[`ansers.${index}.total`]: 1}},
    function(err, res) {
      if (err) throw err;
      database.close();
    });
  })
}


//ユーザー情報の登録をする
exports.logaggregate = function(key,callback){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("LoginUserData");
    dbo.collection("loginuser").aggregate(key).toArray(function(err, result) {
      if (err) throw err;
      database.close();
      callback(result);
    });
  });
};
