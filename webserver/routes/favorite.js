const db = require('../lib/mongo');
exports.post = function(req,res){
  let id;
  db.userCheck(req.session.user)
  .then(()=>{
    if(favoriteCheck(req.body.favorite)){
      try{
        id = db.ObjectID(req.body.targetId);
      }catch(e){
        return Promise.reject(e);
      }
      return db.aggregate("question",[{$match:{_id:id}}]);
    }
    return Promise.reject("favoriteが正しい値ではありません:"+req.body.favorite);
  })
  .then((result)=>{
    if(result[0]){
      return db.favorite(req.session.user._id,req.body.targetId,req.body.favorite);
    }
    return Promise.reject("targetIdが存在しません:"+req.body.targetId);
  })
  .then((result)=>{
    res.json(result);
  })
  .catch((err)=>{
    console.error(err);
    res.json({status:"error"});
  })

}
function favoriteCheck(favorite){
  if(favorite === 1 || favorite === 0){
    return true;
  }
  return false;
}
