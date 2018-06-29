const MongoClient = require('mongodb').MongoClient;
const ip = require("../ip.js");
const url = 'mongodb://'+ ip.ip +':27017';

//callback関数に検索結果を適用する。
exports.aggregate = function(collectionName,key){
  return new Promise(function(resolve,reject){
    MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
      if (error) reject(error);
      const dbo = database.db("Data");
      dbo.collection(collectionName).aggregate(key).toArray(function(err, result) {
        if (err) reject(err);
        database.close();
        resolve(result)
      });
    });
  })
  .catch(function(err){
    console.log(err);
  })
};

//ObjectをDBに挿入する
exports.insert = function(collection,key){
  return new Promise(function(resolve,reject){
    MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
      if (error) reject(error);
      const dbo = database.db("Data");
      dbo.collection(collection).insertOne(key, function(err, result) {
        if (err) reject(err);
        database.close();
        resolve(result);
      });
    });
  })
  .catch(function(err){
    console.log(err);
  })
}

// userの認証
exports.userCheck = function(checkuser){
  return new Promise(function(resolve,reject){
    MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
      if(error) reject(error);
      const dbo = database.db("Data");
      const key = [{$match:{sessionkey:checkuser.sessionkey}}];
      dbo.collection("user").aggregate(key).toArray(function(err, result) {
        if (err) reject(err);
        database.close();
        const user = result[0];
        if(user && (user._id == checkuser._id) ){
          resolve(user)
        }else {
          resolve(null);
        }
      });
    });
  })
  .catch(function(err){
    console.log(err);
  })

}
