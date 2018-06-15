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
exports.insert = function(dbName,collection,key,callback){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db(dbName);
    dbo.collection(collection).insertOne(key, function(err, result) {
      if (err) throw err;
      database.close();
      callback(result);
    });
  });
}

//投票する
exports.vote = function(user, id, index, key, callback){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("QuestionData");
    const objId = require('mongodb').ObjectID(id);
    for(let i = 0; i<index.length; i++){
      if(index[i]){
        dbo.collection("question").updateOne({_id:objId},{$addToSet:{[`answers.${i}.voter`]: user._id}},
        function(err, res) {
          if (err) throw err;
        });
      }
    }
    dbo.collection("question").update({_id:objId},{$addToSet:{voters:user._id}},
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
    const objId = require('mongodb').ObjectID(id);

    /**
    　* goodの値で分岐
      * @true or false
      * userのgoodプロパティも更新
    **/

    let operator;

    if(good == "true"){
      operator = {$addToSet:{"good":user._id}};
    }else{
      operator = {$pull:{"good":user._id}};
    }
    dbo.collection("question").update({_id:objId},operator,
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
exports.comment = function(id,sender_id,content,commentId,key,callback){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("QuestionData");
    const objId = require('mongodb').ObjectID(id);
    dbo.collection("question").update({_id:objId},
    {$push:{comment:{'sender_id':sender_id,'content':content,'commentId':commentId}}},
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
exports.follow = function(user_id,followUserId,follow,followKey,followerKey,callback){
  MongoClient.connect(url,{ useNewUrlParser:true },function(error, database) {
    if (error) throw error;
    const dbo = database.db("UserData");
    let operator1,operator2;

    if(follow == "true"){
      operator1 = {$addToSet:{"follow":followUserId}};
      operator2 = {$addToSet:{"follower":user_id}};
    }else{
      operator1 = {$pull:{"follow":followUserId}};
      operator2 = {$pull:{"follower":user_id}};
    }
    dbo.collection("user").update({_id:user_id},operator1,
    function(err, res) {
      if (err) throw err;
    });
    dbo.collection("user").update({_id:followUserId},operator2,
    function(err, res) {
      if (err) throw err;
    });
    dbo.collection("user").aggregate(followKey).toArray(function(err, result1) {
      if (err) throw err;
      dbo.collection("user").aggregate(followerKey).toArray(function(err, result2) {
        if (err) throw err;
        database.close();
        result1[1] = result2[0];
        callback(result1);
      });
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
