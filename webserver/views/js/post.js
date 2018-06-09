/*
  inputBox内の動きを定義
 */

var post = {
  init:function(){
    this.box = document.getElementById("answerBox");
    this.sub = document.getElementById("inputSub");
    this.query = document.getElementById("inputQuery");
    this.answers = document.getElementsByName("inputAnswer");
    this.addbtn = document.getElementById("inputAddBtn");
    this.delbtn = document.getElementById("inputDelBtn");

    this.sub.onclick = this.route;
    this.addbtn.onclick = this.addAction;
    this.delbtn.onclick = this.delAction;
    this.query.onkeyup = this.change;
    this.answers[0].onkeyup = this.change;
  }
};
//データベースに接続し処理を行う
post.route = function (){
  // ログイン状態かチェック
  if(!user){
    const sub = document.getElementById("inputSub");
    sub.value = "ログインしてください";
    return sub;
  }
  let obj = function(){
    const obj = {'user':user,query:post.query.value};
    const answer = [];
    for(let i = 0;i<post.answers.length;i++){
      answer[i] = post.answers[i].value;
    }
    obj.answers = answer;
    return obj;
  }();

  connect("/post/",obj,
  function(res){
    if(!res.replay){
      post.query.value = "";
      for(let i of post.answers){
        i.value = "";
      }
    }else{
      window.alert(res.replay + "\n安全のため再ログインしてから再投稿をお願いします");
    }
  })
};
//answersの長さが1つ増える
post.addAction = function (){
  const div = document.createElement("div");
  const inp = document.createElement("input");
  div.setAttribute("id","inputAnswer" + (post.answers.length + 1) );
  div.textContent = "回答選択肢" + (post.answers.length + 1) + " ： ";
  inp.setAttribute("type","text");
  inp.setAttribute("name","inputAnswer");
  inp.onkeyup = post.change;
  post.box.appendChild(div);
  div.appendChild(inp);

  if(post.answers.length == 2){
    answerDelBtnHidActionHTML(post.delbtn);
  }
  post.change();
};
//answersの長さが1つ減る
post.delAction = function(){
  const div = document.getElementById("inputAnswer" + post.answers.length);
  div.remove();
  if(post.answers.length == 1){
    answerDelBtnHidActionHTML(post.delbtn);
  }
  post.change();
}
// 送信ボタンの切り替え
post.change = function(){
  let check = true;
  // 選択肢に文字が入力されているかチェック
  for(let i=0; i<post.answers.length; i++ ){
    if(!post.answers[i].value){
      check = false;
    }
  }
  if(post.query.value == "" || !check){
    $("#inputSub").prop("disabled", true);
  }else{
    $("#inputSub").prop("disabled", false);
  }
}

function answerDelBtnHidActionHTML(hid){
  if(hid.className == "off"){//offなら表示する
    hid.style.display = "inline"
    hid.className = "on";
  }else if(hid.className == "on"){//onなら非表示にする
    hid.style.display = "none";
    hid.className = "off";
  }else{
    console.log("resultQuestionAddHidActionHTMLで不正なものが入っている")
  }
}
