const dbo = require('../lib/mongo');
//画像登録処理
exports.post = function(req,res){
    const imgs =req.body.img;
    // データを受け取って格納。
    // data:image/jpeg;base64,というデータはBase64ではなくゴミなので排除する。
    var data = imgs.split( ',' );
    // Base64のデータのみが入っている。
    var b64img = data[ 1 ];

    // npm i urlsafe-base64 でインストールしたモジュール。
    var base64 = require('urlsafe-base64');
    // これでBase64デコードするとimgにバイナリデータが格納される。
    var img = base64.decode( b64img );

    // npm i fs でインストールしたモジュール。
    var fs = require('fs');
    // 試しにファイルをsample.jpgにして保存。Canvasではjpeg指定でBase64エンコードしている。
    fs.writeFile('sample.jpg', img, function (err) {
        console.log(err);
    });
    //img.replace("data:image/jpeg;base64,", "");
    res.json(true);
    //});
};
