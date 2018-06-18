const dbo = require('../lib/mongo');

exports.post = function(req,res){
  const img=req.body.img.objimg;
  res.json(img);
};
