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

router.get(function(req,res,next){
  if(req.cookies.user){
    next();
  }else{
    if(req.url == '/login' || req.url == '/search'){
      next();
    }else {
      res.redirect('/login');
    }
  }
});
router.post(function(req,res,next){
  if(req.cookies.user){
    next();
  }else{
    if(req.url == '/login' || req.url == '/search' || req.url == '/home'){
      next();
    }else {
      res.json('err');
    }
  }
})

router.get('/',home.get);
router.post('/home',home.post);

router.get('/search',search.get);
router.post('/search',search.post);

router.post('/post',post.post);

router.post('/vote',vote.post);

router.post('/favorite',favorite.post);

router.get('/follow',follow.get);

router.get('/login',function(req,res){
  if(req.cookies.user){
    res.redirect('/');
  }else {
    res.render('login');
  }
});
router.post('/login',login.post);

module.exports = router;
