const dbo = require('../lib/mongo');

// 検索処理　１単語のみの検索に対応
exports.post = function(req,res){
    console.log(req.body.data);
    //dbo.insert("UserData","user",data);
    res.json(true);
};
