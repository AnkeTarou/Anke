const dbo = require('../lib/mongo');

exports.post = function(req,res){
  console.log("でーた ",req.body);
  const key = req.body.obj;
  const ans = [];
  let check = true;
  let err;    //エラー内容を保持する変数 *@<int>*

  /****受信オブジェクトが正当な形式かチェック****/

  //質問の文字数が適当であるかチェック
  if( (key.query.length < 1) || (key.query.length > 255) ){
    check = false;
    err = 1;
  }

  //回答選択肢の数が適当であるかチェック
  if( (key.answers.length < 1) || (key.answers.length > 48) ){
    check = false;
    err = 2;
  }

  //回答形式が適当であるかチェック
  if( (key.type != "radio") && (key.type != "checkbox") ){
    check = false;
    err = 3;
  }
  for(let i in key.answers){
    console.log(key.answers[i].length == 0);
    ans[i] = {answer:key.answers[i],voter:[]};

    //回答選択肢の文字数がそれぞれ適当であるかチェック
    if( (key.answers[i].length < 1) || (key.answers[i].length > 127) ){
      check = false;
      err = 4;
    }
  }
  key.answers = ans;
  key.voters = [];
  key.good = [];
  key.comment = [];
  key.img = [];
  key.time = new Date();

  // ユーザー認証
  dbo.userCheck(req.body.user,function(result){
    /**
     *全ての認証に通ればＤＢに投稿内容を挿入する
    **/
    if(result && check){
      key.senderId = result._id
      dbo.insert("QuestionData","question",key,function(result){
        res.json("OK");
      });
    }else{
      //ユーザー認証に失敗していればエラーコード5を返す
      if(!result){
        err = 5;
      }
      res.json(err);
    }
  });
}
