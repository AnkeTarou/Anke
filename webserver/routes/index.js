var express = require('express');
var router = express.Router();

const post = require('./post');
const search = require('./search');
const vote = require('./vote');
const favorite = require('./favorite');
router.get('/', function (req, res) {
  res.render("home",{});
});

router.post('/vote/',vote.post);

router.post('/favorite/',favorite.post);

router.post('/post/',post.post);

router.get('/search/',search.post);
router.post('/search/',search.post);

module.exports = router;
