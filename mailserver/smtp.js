//モジュールの読み込み
const nodemailer = require("nodemailer");
const pass = require("./pass.js");

exports.post = function(req,res){
  //SMTPサーバの設定
  const smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'ankedaisuki4649@gmail.com',
      pass: pass.pass,
    },
  }

  const smtp = nodemailer.createTransport(smtpConfig)

  //メール情報の作成
  const message = {
    from: 'ankedaisuki4649@gmail.com',  // Gmailをメインサーバーとして使用中
    to: req.body.value,        // userのメールアドレス
    subject: 'nodemailer test mail',
    text: 'テストメールです。'
  };

  // メール送信
  try{
    smtp.sendMail(message, function(error, info){
      // エラー発生時
      if(error){
        console.log("send failed");
        console.log(error.message);
        return;
      }

      // 送信成功
      console.log("send successful");
      console.log(info.messageId);
    });
    smtp.close();
  }catch(e) {
    console.log("Error",e);
  }
}
