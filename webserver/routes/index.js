var express = require('express');
var router = express.Router();

const dbo = require('../lib/mongo');
const post = require('./post');
const search = require('./search');
const vote = require('./vote');
const favorite = require('./favorite');
const home = require('./home');
const follow = require('./follow');
//const follow = require('./follow');

router.use(function(req,res,next){
  if(req.session.user){
    next();
  }else{
    if(req.url == '/login' || req.url == '/search' || req.url == '/post'){
      next();
    }else {
      res.redirect('/login');
    }
  }
});

router.get('/',home.get);
router.post('/home',home.post);

router.post('/vote',vote.post);

router.post('/favorite',favorite.post);

router.get('/search',search.get);
router.post('/search',search.post);


router.get('/follow',follow.get);

router.get('/login',function(req,res){
  if(req.session.user){
    res.redirect('/');
  }else {
    res.render('login');
  }
});

module.exports = router;
