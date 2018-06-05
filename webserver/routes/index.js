var express = require('express');
var router = express.Router();

const search = require('./search');
const post = require('./post');
const vote = require('./vote');
const login = require('./login');
const mail = require('../../mailserver/smtp');
const getid = require('./insertuser');
const file = require('./sendfile');

router.get('/', function (req, res) {
  res.render("index",{});
});

//検索
router.post('/search/',search.post)

//投稿
router.post('/post/',post.post);

//投票
router.post('/vote/',vote.post);

//ログイン
router.post('/login/',login.post);

//ユーザー登録
router.post('/account/',getid.post);

//メール
router.post('/mail/',mail.post);

//ファイル送信
router.post('/file/',file.post);

module.exports = router;
