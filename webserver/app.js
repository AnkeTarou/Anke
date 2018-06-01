const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');

// 外部から参照できるファイルを指定
app.use(express.static('views'));
// clientから送られてくるデータを扱いやすい形式に変換
app.use(bodyParser.urlencoded({ extended: true }));
// アクセスしてきたときに最初に実行される処理
app.use(function(req,res,next){
  console.log("url\n"+req.url);
  console.log("受信データ\n"+JSON.stringify(req.body));
  next();
});
app.set('view engine', 'ejs');
app.use('/',indexRouter);

app.listen(80);
