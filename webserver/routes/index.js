var express = require('express');
var router = express.Router();

const post = require('./post');
const search = require('./search');
const vote = require('./vote');
const favorite = require('./favorite');
const home = require('./home');

router.get('/',home.get);
router.post('/home/',home.post);

router.post('/vote/',vote.post);

router.post('/favorite/',favorite.post);

router.post('/post/',post.post);

router.get('/search/',search.get);
router.post('/search/',search.post);

module.exports = router;
