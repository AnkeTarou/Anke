const dbo = require('../lib/mongo');
//画像登録処理
exports.post = function(req,res){
    const imgs =req.body.img;
    const dates = new Date() ;
    const time = dates.getTime() ;
    const imagename = time+'.jpg';
    const key ={
      objimg:imagename
    }
    // data:image/jpeg;base64,というデータはBase64ではなくゴミなので排除する。
    const data = imgs.split( ',' );
    // Base64のデータのみが入っている。
    const b64img = data[ 1 ];

    // npm i urlsafe-base64 でインストールしたモジュール。
    const base64 = require('urlsafe-base64');
    // これでBase64デコードするとimgにバイナリデータが格納される。
    const img = base64.decode( b64img );

    // npm i fs でインストールしたモジュール。
    const fs = require('fs');
    // ファイルを保存。
    fs.writeFile('views/image/'+imagename, img, function (err) {
        console.log(err);
    });
    //Mongoに画像の情報を保存
    dbo.insert("Imagedata","image",key,function(result){
      res.json(key);
    });
};
