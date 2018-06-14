/*
  inputBox内の動きを定義
 */

var post = {
  init:function(){
    this.box = document.getElementById("answerBox");
    this.sub = document.getElementById("inputSub");
    this.query = document.getElementById("inputQuery");
    this.answers = document.getElementsByName("inputAnswer");
    this.type = document.getElementsByName("inputAnswerType");
    this.addbtn = document.getElementById("inputAddBtn");
    this.delbtn = document.getElementById("inputDelBtn");

    this.sub.onclick = this.route;
    this.addbtn.onclick = this.addAction;
    this.delbtn.onclick = this.delAction;
    this.query.onkeyup = this.change;
    this.query.onkeypress = this.queryLimit;
    for(let i = 0; i < 2; i++){
      this.answers[i].onkeyup = this.change;
      this.answers[i].onkeypress = this.answerLimit;
    }
  }
};
//データベースに接続し処理を行う
post.route = function (){

  let obj = function(){
    const obj = {query:post.query.value};
    const answer = [];
    let type;
    for(let i = 0;i<post.answers.length;i++){
      answer[i] = post.answers[i].value;
    }
    for(let i = 0;i<post.type.length;i++){
      if(post.type[i].checked){
        type = post.type[i].value;
      }
    }
    obj.answers = answer;
    obj.type = type;
    return obj;
  }();

  connect("/post/",{obj,user},
  function(res){
    if(res == "OK"){
      post.query.value = "";
      for(let i of post.answers){
        i.value = "";
      }
      post.change();
    }else{
      window.alert("投稿処理が正常に行われませんでした。\nエラーコード" + res);
    }
  });

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
  inp.onkeypress = post.answerLimit;
  post.box.appendChild(div);
  div.appendChild(inp);

  if(post.answers.length == 3){
    answerBtnHidActionHTML(post.delbtn);
  }else if(post.answers.length == 48){
    answerBtnHidActionHTML(post.addbtn);
  }
  post.change();
};
//answersの長さが1つ減る
post.delAction = function(){
  const div = document.getElementById("inputAnswer" + post.answers.length);
  div.remove();
  if(post.answers.length == 2){
    answerBtnHidActionHTML(post.delbtn);
  }else if(post.answers.length == 47){
    answerBtnHidActionHTML(post.addbtn);
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

post.queryLimit = function() {
  const length = post.query.value.length+1;
  console.log(length);
  if(length > 255){
    console.log("文字数オーバーです");
    return false;
  }
}

post.answerLimit = function(e){
  const length = e.currentTarget.value.length+1;
  console.log(length);
  if(length > 127){
    console.log("文字数オーバーです");
    return false;
  }
}

function answerBtnHidActionHTML(hid){
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
