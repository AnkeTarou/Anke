var express = require('express');
var router = express.Router();

const post = require('./post');
const search = require('./search');
const vote = require('./vote');
const favorite = require('./favorite');
const home = require('./home');
//const follow = require('./follow');

router.get('/',home.get);
router.post('/home/',home.post);

router.post('/vote/',vote.post);

router.post('/favorite/',favorite.post);

router.post('/post/',post.post);

router.get('/search/',search.get);
router.post('/search/',search.post);

router.get('/follow/',function(req,res){
  res.render('follow');
});

module.exports = router;
