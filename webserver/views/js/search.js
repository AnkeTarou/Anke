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

//サーバに接続し検索した後,結果を画面に反映する
//その後、検索したキーで更新があれば自動で反映される
search.route = function (){
  connect("/search/",{value:search.valueNode.value},updateResult)
  search.autoUpdate({value:search.valueNode.value});
};

search.autoUpdate = function(key){
  clearInterval(this.current);
  this.current = setInterval(function(){
    connect.log = false;
    connect("/search/",key,updateResult);
  },5000);
}

//送られてきたデータをresultに反映する
function updateResult(date){
  const result = document.getElementById('result');
  const articles = document.getElementsByClassName("slide");
  for(let i = articles.length; i<date.length; i++){
    const id = date[i]._id;
    const query = date[i].query;
    const answers = date[i].answers;
    const total = date[i].total;
    result.appendChild(createQuestionNode(id,query,answers,total));
    resultQuestionAddActionHTML(id);
  }
}

function createQuestionNode(id,query,aryAnswer,total){
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
  div2.setAttribute("id","status"+id);
  div1.appendChild(document.createTextNode(query));

  const div3 = document.createElement("div");
  div3.setAttribute("id","hid"+id);
  div3.setAttribute("class","off");

  //ノードの挿入
  article.appendChild(input1);
  article.appendChild(label);
  label.appendChild(div1);
  label.appendChild(div2);
  label.appendChild(div3);

  //回答内容を入れる
  for(let i =0;i<aryAnswer.length;i++){
    const lav = document.createElement("label");
    const ary=  document.createTextNode(aryAnswer[i].answer);
    const inp = document.createElement("input");
    inp.setAttribute("type","radio");
    inp.setAttribute("name",id);
    inp.setAttribute("value",aryAnswer[i].answer);
    //ノードの挿入
    div3.appendChild(lav);
    lav.appendChild(inp);
    lav.appendChild(ary);
  }
  div2.appendChild(document.createTextNode("投票数\t" + total));
  div3.appendChild(input2);
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
    const statusTotal = document.getElementById('status'+id);
    statusTotal.replaceChild(document.createTextNode("投票数\t"+res.total),statusTotal.firstChild);

    // それぞれのブロックを作成
    const myVotediv = document.createElement("div");
    hid.appendChild(myVotediv);
    const canvasdiv = document.createElement("div");
    hid.appendChild(canvasdiv);

    const gooddiv = document.createElement("div");
    gooddiv.setAttribute("class","good");
    hid.appendChild(gooddiv);

    const commentdiv = document.createElement("div");
    hid.appendChild(commentdiv);

    const myVote = document.createTextNode(res.answers[check].answer + "に投票しました");
    myVotediv.appendChild(myVote);
    const canvas = document.createElement("canvas");
    canvasdiv.appendChild(canvas);

    /****いいね機能を追加****/

    //　ラベル生成
    const goodlabel = document.createElement("label");
    goodlabel.setAttribute("id","goodlabel"+id);
    goodlabel.textContent = "いいね\t" + res.good.totalgood + "\t";
    gooddiv.appendChild(goodlabel);

    // 投稿にいいねをしているかを判別
    let checker = false;
    for(let i = 0; i<res.good.gooduser.length; i++){
      if(user._id == res.good.gooduser[i]){
        checker = true;
      }
    }

    //　いいねボタンをセット
    const goodbtn = document.createElement("input");
    goodbtn.setAttribute("type","checkbox");
    goodbtn.setAttribute("id","goodbtn"+id);
    goodbtn.setAttribute("name","goodbtn");
    goodbtn.checked = checker;
    goodlabel.appendChild(goodbtn);

    // いいねボタンが押されたとき
    goodbtn.onclick = function(){
      if(goodbtn.checked){
        // いいねをデータベースに反映
        connect("/good/",{'user':user,'id':id,'good':true},
        function(resGood){
          goodlabel.textContent = "いいね\t" + resGood.good.totalgood + "\t";
          goodbtn.checked = true;
          goodlabel.appendChild(goodbtn);
          console.log("いいねしたよ");
        });
      }else{
        connect("/good/",{'user':user,'id':id,'good':false},
        function(resGood){
          goodlabel.textContent = "いいね\t" + resGood.good.totalgood + "\t";
          goodbtn.checked = false;
          goodlabel.appendChild(goodbtn);
          console.log("いいね外したよ");
        });
      }
    }

    // コメント機能追加
    const content = document.createElement("input");
    content.setAttribute("type","textarea");
    content.setAttribute("id","content"+id);
    commentdiv.appendChild(content);

    // コメント送信ボタンをセット
    const commentsub = document.createElement("input");
    commentsub.setAttribute("type","submit");
    commentsub.setAttribute("id","commentsub"+id);
    commentsub.setAttribute("disabled","disabled");
    commentsub.setAttribute("value","コメントを送信");
    commentdiv.appendChild(commentsub);

    // 既にあるコメントをブラウザに表示
    const div1 = document.createElement("div");
    div1.setAttribute("class","comment");
    commentdiv.appendChild(div1);
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

    //　コメント内容が入っているかチェック
    content.onkeyup = function(){
      if(content.value == ""){
        $("#commentsub"+id).prop("disabled", true);
      }else{
        $("#commentsub"+id).prop("disabled", false);
      }
    }

    // コメントを送信したとき
    commentsub.onclick = function(){
      console.log("コメント送信");
      const come = content.value;
      connect("/comment/",{'user':user,'id':id,'content':come},
      function(res){
        content.value = "";
        $("#commentsub").prop("disabled", true);
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
      const answers = [];
      const total = [];
      for(let i in res.answers){
        answers[i] = res.answers[i].answer;
        total[i] = res.answers[i].total;
      }
      return {"answers":answers,"total":total};
    }();
    new Chart(ctx, {
      // 作成するグラフの種類
      type: 'bar',
      // ラベルとデータセットを設定
      data: {
        labels: data.answers,
        datasets: [{
          data: data.total,
          backgroundColor: 'rgb(0,0,0)',
        }]
      },
      //オプション設定
      options: {
        legend: {
            display: false,
        },
        scales: {                          //軸設定
          yAxes: [{                    //表示設定
            scaleLabel: {              //軸ラベル設定
             display: true,          //表示設定
             fontSize: 18,           //フォントサイズ
             fontColor: "rgb(0,0,0)"
            },
            ticks: {
              min: 0,                   //最小値
              fontSize: 18,             //フォントサイズ
              stepSize: 10,             //軸間隔
              fontColor: "rgb(0,0,0)"
            },
            gridLines:{           //グリッド設定
              display:true,
              color:"rgba(0,0,0,0.8)"
            }
          }],
          xAxes: [{                         //x軸設定
            display: true,                //表示設定
            categoryPercentage: 0.6,      //棒グラフ幅
            scaleLabel: {                 //軸ラベル設定
              display: true,             //表示設定
              fontSize: 18               //フォントサイズ
            },
            ticks: {
              fontSize: 16,             //フォントサイズ
              fontColor:"rgb(15, 15, 15)",
              tickMarkLength:1
            },
            gridLines:{           //グリッド設定
              display:true,
              color:"rgba(0,0,0,0.3)",
            }
          }],
        },
        animation:{
          duration:1500, //アニメーションにかける時間
          easing:"easeInQuad"
        },
        elements:{
          line:{
            backgroundColor:"rgba(0,0,0,0.5)"
          }
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
