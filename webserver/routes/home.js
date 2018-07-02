const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const  userId= req.session.user.id;
  console.log(userId)
  dbo.aggregate("user",[{$match:{_id:userId}},{$project:{followcount:{$size:"$follow"},followercount:{$size:"$follower"},favoritecount:{$size:"$favorite"}}}])
  .then(function(result){
    console.log(result[0]);
    res.render("../views/home",result[0]);
  })
  //.then(function(result){

  //})
}
