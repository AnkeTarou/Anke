const Mongo = require('mongodb')
const MongoClient = Mongo.MongoClient;
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
    open()
    .then()
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

exports.ObjectID = Mongo.ObjectID;

exports.favorite = function (userId,targetId,favorite){
  let database = null;
  let Data = null;
  let targetObjId = Mongo.ObjectID(targetId);
  return new Promise((resolve,reject)=>{
    open().then((db)=>{
        database = db;
        return db.db("Data");
    })
    .then((data)=>{
        Data = data;
        if(favorite === "1"){
          return Promise.all([
            Data.collection("question").update({_id:targetObjId},{$addToSet:{"favorite":userId}}),
            Data.collection("user").update({_id:userId},{$addToSet:{"favorite":targetId}})
          ]);
        }else if(favorite === "0"){
          return Promise.all([
            Data.collection("question").update({_id:targetObjId},{$pull:{"favorite":userId}}),
            Data.collection("user").update({_id:userId},{$pull:{"favorite":targetId}})
          ])
        }
    })
    .then(()=>{
      database.close()
      resolve({status:"success"})
    })
    .catch((err)=>{
      if(database) database.close();
      reject(err);
    })
  });
}
//投票
exports.vote = function (user,id,index){
  let database = null;
  let userCollection = null;
  const key = {_id:Mongo.ObjectID(id)};
  return new Promise((resolve,reject) => {
    open().then((db)=>{
        database = db;
        return db.db("Data").collection('question')
    })
    .then((users)=>{
        userCollection = users;
        let prom = Promise.resolve();
        for(let i = 0; i<index.length; i++){
          if(index[i] == "1"){
            let update = {$addToSet:{[`answers.${i}.voter`]: user.id}};
            prom = prom.then(()=>{
              return userCollection.updateOne(key,update);
            })
          }
        }
        return prom
    })
    .then(()=>{
        return userCollection.update(key,{$addToSet:{voters:user.id}})
    })
    .then(()=>{
        const matchKey = [
          { $unwind:"$answers"},
          {$group:{
            _id:"$_id",
            answers:{$push:{
              answer:"$answers.answer",
              "total":{$size:"$answers.voter"}
            }},
            total:{$first:{$size:"$voters"}},
            comment:{$first:{$size:"$comment"}},
            favorite:{$first:{$size:"$favorite"}},
          }}
        ]
        userCollection.aggregate(matchKey).toArray((err,result)=>{
          if(err) reject(err);
          database.close()
          resolve(result[0]);
        });
    })
    .catch((err)=>{
      if(database) database.close();
      reject(err);
    })
  })
}
function open(){
  return new Promise((resolve, reject)=>{
    MongoClient.connect(url,{ useNewUrlParser: true },(err, db) => {
      if (err) {
        reject(err);
      } else {
        resolve(db);
      }
    });
  });
}
