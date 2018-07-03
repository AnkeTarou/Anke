const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const  userId= req.session.user.id;
  console.log(userId)
  const key = [
    {$match:{_id:userId}},
    {$project:{
      followcount:{$size:"$follow"},
      followercount:{$size:"$follower"},
      favoritecount:{$size:"$favorite"},
      nickname:1
    }}
  ]
  dbo.aggregate("user",key)
  .then(function(result1){
    const key = [
      {$match:{voters:userId}},
      {$count:"votecount"}
    ]
    dbo.aggregate("question",key)
    .then(function(result){
      const homekey = Object.assign(result1[0],result[0]);
      res.render("../views/home",homekey);
    })
  })
}
