var express = require('express');
var router = express.Router();

const search = require('./search');
const userSearch = require('./userSearch');
const post = require('./post');
const vote = require('./vote');
const login = require('./login');
const mail = require('../../mailserver/smtp');
const getid = require('./insertuser');
const good = require('./good');
const comment = require('./comment');
const follow = require('./follow');
const sendfile = require('./sendfile');
const userCheck = require('./userCheck');

router.get('/', function (req, res) {
  res.render("index",{animal:"dog"});
});

//検索
router.post('/search/',search.post);

//ユーザー検索
router.post('/userSearch/',userSearch.post);

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

//いいね
router.post('/good/',good.post);

//コメント
router.post('/comment/',comment.post);

//フォロー
router.post('/follow',follow.post);

//ファイル送信
router.post('/sendfile/',sendfile.post);

//ユーザー認証
router.post('/userCheck/',userCheck.post);

module.exports = router;
