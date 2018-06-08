/*
  検索蘭、検索結果表示を定義
 */
var search = {
  init:function(){
    this.valueNode = document.getElementById("searchValue");
    this.subNode = document.getElementById("searchSub");
    this.subNode.onclick = this.route;
  }
}

search.route = function (){
  connect("/search/",{value:search.valueNode.value},
  function(res){
    const result = document.getElementById('result');
    const articles = document.getElementsByClassName("slide");
    for(let i = articles.length; i<res.length; i++){
      const id = res[i]._id;
      const query = res[i].query;
      const ansers = res[i].ansers;
      const total = res[i].total;
      result.appendChild(createQuestionNode(id,query,ansers,total));
      resultQuestionAddActionHTML(id);
    }
  })
};

function createQuestionNode(id,query,aryAnser,total){
  const que = document.createTextNode(query);

  const article = document.createElement("article");
  article.setAttribute("class","slide");

  const input1 = document.createElement("input");
  input1.setAttribute("type","button");
  input1.setAttribute("id","btn"+id);
  input1.setAttribute("class","question-action-open");

  const input2 = document.createElement("input");
  input2.setAttribute("type","submit");
  input2.setAttribute("id","sub"+id);
  input2.setAttribute("value","決定");

  const label = document.createElement("label");
  label.setAttribute("for","btn"+id);

  const div1 = document.createElement("div");
  div1.setAttribute("class","question");

  const div2 = document.createElement("div");
  div2.setAttribute("id","hid"+id);
  div2.setAttribute("class","off");

  const div3 = document.createElement("div");
  div3.setAttribute("id","status"+id);

  //ノードの挿入
  article.appendChild(input1);
  article.appendChild(label);
  label.appendChild(div1);
  label.appendChild(div2);
  label.appendChild(div3);
  div1.appendChild(document.createTextNode(query));

  //回答内容を入れる
  for(let i =0;i<aryAnser.length;i++){
    const lav = document.createElement("label");
    const ary=  document.createTextNode(aryAnser[i].anser);
    const inp = document.createElement("input");
    inp.setAttribute("type","radio");
    inp.setAttribute("name",id);
    inp.setAttribute("value",aryAnser[i].anser);
    //ノードの挿入
    div2.appendChild(lav);
    lav.appendChild(inp);
    lav.appendChild(ary);
  }
  div2.appendChild(input2);

  div3.appendChild(document.createTextNode("投票数\t" + total))
  return article;
}

function resultQuestionAddActionHTML(id){
  const btn = document.getElementById('btn' + id);
  const hid = document.getElementById('hid'+ id);
  const sub = document.getElementById('sub'+ id);
  btn.onclick = function(){
    resultQuestionAddHidActionHTML(hid);
    // ログイン状態の処理
    if(user){
      // 投票可能
      sub.value ="投票";
      sub.onclick = function(){voteAddActionHTML(id)}
    }else{
      // 未ログイン状態
      // 投票不可能
      sub.value ="ログインしてください";
      sub.onclick = null;
    }
  }

}
function resultQuestionAddHidActionHTML(hid){
  if(hid.className == "off"){//offなら表示する
    hid.style.height = "auto";
    hid.style.display = "block"
    hid.className = "on";
  }else if(hid.className == "on"){//onなら非表示にする
    hid.style.height = "0";
    hid.style.display = "none";
    hid.className = "off";
  }
}
function voteAddActionHTML(id){
  const sub = document.getElementById('sub'+id);
  const hid = document.getElementById('hid'+id);
  const btns = document.getElementsByName(id);
  let check = -1;
  //１つでもチェックがついているか判断
  for(let i = 0;i < btns.length;i++){
    if(btns[i].checked){
      check = i;
    }
  }
  //選択されていなかったとき
  if(check == -1){
     sub.value = "選択してください";
     return;
  }
  //div内の子要素を全て削除
  while(hid.hasChildNodes()){
    hid.removeChild(hid.firstChild);
  }
  //データベースに反映
  connect("/vote/",{'user':user,'id':id,'index':check},
  function(res){
    const myVote = document.createTextNode(res.ansers[check].anser + "に投票しました");
    hid.appendChild(myVote);
    const canvas = document.createElement("canvas");
    hid.appendChild(canvas);
    const statusTotal = document.getElementById('status'+id);
    statusTotal.replaceChild(document.createTextNode("投票数\t"+res.total),statusTotal.firstChild);

    // コメント機能追加
    const content = document.createElement("input");
    content.setAttribute("type","textarea");
    content.setAttribute("id","content");
    hid.appendChild(content);

    // コメント送信ボタンをセット
    const commentsub = document.createElement("input");
    commentsub.setAttribute("type","submit");
    commentsub.setAttribute("id","comment");
    commentsub.setAttribute("value","コメントを送信");
    hid.appendChild(commentsub);

    // 既にあるコメントをブラウザに表示
    const div1 = document.createElement("div");
    div1.setAttribute("class","comment");
    hid.appendChild(div1);
    if(res.comment){
      const comments = res.comment;

      for(let i = comments.length-1; i >= 0; i--){
        const div2 = document.createElement("div");
        div2.setAttribute("class","comment");
        div2.setAttribute("style","border:1px solid red");
        div1.appendChild(div2);

        const commentval = document.createTextNode(comments[i].content);
        div2.appendChild(commentval);
      }

    }

    // コメントを送信したとき
    commentsub.onclick = function(){
      console.log("コメント送信");
      const come = content.value;
      connect("/comment/",{'user':user,'id':id,'content':come},
      function(res){
        content.value = "";
        console.log("コメント送ったよ");

        // コメント欄の先頭に新しいコメントを挿入
        const newdiv = document.createElement("div");
        newdiv.setAttribute("class","comment");
        newdiv.setAttribute("style","border:1px solid red");
        div1.insertBefore(newdiv,div1.firstChild);

        const newcomment = res.comment[res.comment.length-1].content;

        const newcontent = document.createTextNode(newcomment);
        newdiv.appendChild(newcontent);
      });
    }

    const ctx = canvas.getContext("2d");
    const data = function(){
      const ansers = [];
      const total = [];
      for(let i in res.ansers){
        ansers[i] = res.ansers[i].anser;
        total[i] = res.ansers[i].total;
      }
      return {"ansers":ansers,"total":total};
    }();
    new Chart(ctx, {
      // 作成するグラフの種類
      type: 'bar',
      // ラベルとデータセットを設定
      data: {
        labels: data.ansers,
        datasets: [{
          backgroundColor: 'rgba('+random(256,0)+','+random(256,0)+','+random(256,0)+',1)',
          borderColor: 'rgba('+random(256,0)+','+random(256,0)+','+random(256,0)+',1)',
          borderwidth: 3,
          data: data.total,

        }]
      },
      //オプション設定
      options: {
        legend: {
            display: false,
        }
      }
    });
  })
  //閉じてしまったhidを表示
  resultQuestionAddHidActionHTML(hid);
}
function random(max, min){
  return Math.floor( Math.random() * (max + 1 - min) ) + min;
}