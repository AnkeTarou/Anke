const dbo = require('../lib/mongo');
//画像登録処理
exports.post = function(req,res){
    const image=req;
    //dbo.insert("UserData","user",image);
    res.json(true);
};
