const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const key = req.body;
  const sender_id = key.user._id;
  const objId = require('mongodb').ObjectID(key.id);
  const content = key.content;
 console.log("unko");
  //dbo.update({_id:objId},{$push:{comment:content}});
  res.json(key);
}
