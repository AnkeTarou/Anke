var express = require('express');
var router = express.Router();

const dbo = require('../lib/mongo');
const post = require('./post');
const search = require('./search');
const vote = require('./vote');
const favorite = require('./favorite');
const home = require('./home');
const login = require('./login');
const follow = require('./follow');
//const follow = require('./follow');

router.get('/',home.get);
router.post('/home',home.post);

router.get('/search',search.get);
router.post('/search',search.post);

router.post('/post',post.post);

router.post('/vote',vote.post);

router.post('/favorite',favorite.post);

router.get('/follow',follow.get);

router.get('/login',function(req,res){
  if(req.session.user){
    res.redirect('/');
  }else {
    res.render('login');
  }
});
router.post('/login',login.post);

module.exports = router;
