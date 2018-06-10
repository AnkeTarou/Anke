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
exports.vote = function(user, id, index, key, callback){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("QuestionData");
    const dbo2 = database.db("UserData");
    const objId = require('mongodb').ObjectID(id);
    dbo.collection("question").updateOne({_id:objId},{$inc:{[`answers.${index}.total`]: 1}},
    function(err, res) {
      if (err) throw err;
    });
    dbo2.collection("user").update({_id:user._id},{$addToSet:{vote:objId}},
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
//いいねをデータベースに反映
exports.good = function(user,id,good,key,callback){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("QuestionData");
    const dbo2 = database.db("UserData");
    const objId = require('mongodb').ObjectID(id);

    /**
    　* goodの値で分岐
      * @true or false
      * userのgoodプロパティも更新
    **/

    if(good == "true"){
      dbo.collection("question").update({_id:objId},{$inc:{"good.totalgood":1}},
      function(err, res) {
        if (err) throw err;
      });
      dbo.collection("question").update({_id:objId},{$addToSet:{"good.gooduser":user._id}},
      function(err, res) {
        if (err) throw err;
      });
      dbo2.collection("user").update({_id:user._id},{$addToSet:{good:objId}},function(err, res) {
        if (err) throw err;
      });
      dbo.collection("question").aggregate(key).toArray(function(err, result) {
        if (err) throw err;
        database.close();
        callback(result);
      });
    }else{
      dbo.collection("question").update({_id:objId},{$inc:{"good.totalgood":-1}},
      function(err, res) {
        if (err) throw err;
      });
      dbo.collection("question").update({_id:objId},{$pull:{"good.gooduser":user._id}},
      function(err, res) {
        if (err) throw err;
      });
      dbo2.collection("user").update({_id:user._id},{$pull:{good:objId}},function(err, res) {
        if (err) throw err;
      });
      dbo.collection("question").aggregate(key).toArray(function(err, result) {
        if (err) throw err;
        database.close();
        callback(result);
      });
    }
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
//folloe状況をデータベースに反映
exports.follow = function(own,user_id,follow,key,callback){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("UserData");
    if(follow == "true"){
      dbo.collection("user").update({_id:own._id},{$addToSet:{follow:user_id}},
      function(err, res) {
        if (err) throw err;
      });
      dbo.collection("user").update({_id:user_id},{$addToSet:{follower:own._id}},
      function(err, res) {
        if (err) throw err;
      });
      dbo.collection("user").aggregate(key).toArray(function(err, result) {
        if (err) throw err;
        database.close();
        callback(result);
      });
    }else{
      dbo.collection("user").update({_id:own._id},{$pull:{follow:user_id}},
      function(err, res) {
        if (err) throw err;
      });
      dbo.collection("user").update({_id:user_id},{$pull:{follower:own._id}},
      function(err, res) {
        if (err) throw err;
      });
      dbo.collection("user").aggregate(key).toArray(function(err, result) {
        if (err) throw err;
        database.close();
        callback(result);
      });
    }
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
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    const dbo = database.db("UserData");
    const key = [{$match:{sessionkey:checkuser.session}}];
    dbo.collection("user").aggregate(key).toArray(function(err, result) {
      if (err) throw err;
      database.close();
      user = result[0];
      if(user && (user._id == checkuser._id) ){
        callback(user);
      }else {
        callback(null);
      }
    });
  });
}
