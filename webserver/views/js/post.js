/*
  inputBox内の動きを定義
 */

var post = {
  init:function(){
    this.box = document.getElementById("inputBox");
    this.sub = document.getElementById("inputSub");
    this.query = document.getElementById("inputQuery");
    this.ansers = document.getElementsByName("inputAnser");
    this.addbtn = document.getElementById("inputAddBtn");
    this.delbtn = document.getElementById("inputDelBtn");

    this.sub.onclick = this.route;
    this.addbtn.onclick = this.addAction;
    this.delbtn.onclick = this.delAction;
  }
};
//データベースに接続し処理を行う
post.route = function (){
  console.log(post);
  $.ajax({
    type: "POST",
    url: "/post/",
    dataType: 'json',
    data:function(){
      const obj = {query:post.query.value};
      const anser = [];
      for(let i = 0;i<post.ansers.length;i++){
        anser[i] = post.ansers[i].value;
      }
      obj.ansers = anser;
      return obj;
    }()
  })
  .done(function(res){
    post.query.value = "";
    for(let i of post.ansers){
      i.value = "";
    }
  })
  .fail(function(res){
    console.error(res);
  });
};
//ansersの長さが1つ増える
post.addAction = function (){
  const inp = document.createElement("input");
  const br = document.createElement("br");
  inp.setAttribute("type","text");
  inp.setAttribute("name","inputAnser");
  br.setAttribute("name","br");
  post.box.insertBefore(inp,post.addbtn);
  post.box.insertBefore(br,post.addbtn);

  if(post.ansers.length == 2){
    anserDelBtnHidActionHTML(post.delbtn);
  }
};
//ansersの長さが1つ減る
post.delAction = function(){
  const brList = document.getElementsByName("br");
  post.ansers[post.ansers.length-1].remove();
  post.box.removeChild(brList[brList.length-1]);
  if(post.ansers.length == 1){
    anserDelBtnHidActionHTML(post.delbtn);
  }
}

function anserDelBtnHidActionHTML(hid){
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
