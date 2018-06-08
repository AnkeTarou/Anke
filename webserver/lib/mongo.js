const MongoClient = require('mongodb').MongoClient;
const ip = require("../ip.js");
const url = 'mongodb://'+ ip.ip +':27017';
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
exports.vote = function(id,index,key,callback){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("QuestionData");
    const objId = require('mongodb').ObjectID(id);
    dbo.collection("question").updateOne({_id:objId},{$inc:{[`ansers.${index}.total`]: 1}},
    function(err, res) {
      if (err) throw err;
    });
    dbo.collection("question").aggregate(key).toArray(function(err, result) {
      if (err) throw err;
      database.close();
      callback(result);
    });
  });
}
//投稿にコメントする
exports.comment = function(id,sender_id,content,key,callback){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("QuestionData");
    const objId = require('mongodb').ObjectID(id);
    dbo.collection("question").update({_id:objId},{$push:{comment:{'sender_id':sender_id,'content':content}}},
    function(err, res) {
      if (err) throw err;
    });
    dbo.collection("question").aggregate(key).toArray(function(err, result) {
      if (err) throw err;
      database.close();
      callback(result);
    });
  });
}
// sessionkey挿入
exports.session = function(id,sessionkey){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("UserData");
    dbo.collection("user").update({_id:id},{$set:{'sessionkey':sessionkey}},
    function(err, res) {
      if (err) throw err;
    });
  });
}
// userの認証
exports.userCheck = function(checkuser,callback){
  let r;
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    const dbo = database.db("UserData");
    const key = [{$match:{_id:checkuser._id,pass:checkuser._pass}}];
    let check;
    dbo.collection("user").aggregate(key).toArray(function(err, result) {
      if (err) throw err;
      const user = result[0];
      check = (user.sessionkey == checkuser.session);
      console.log(check);
      result[1] = check;
      database.close();
      callback(result[1]);
    });
  });
}
