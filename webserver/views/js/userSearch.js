/*
  ユーザー検索欄、follow,follower機能を定義
*/

var userSearch = {
    init:function(){
      this.userValueNode = document.getElementById("userSearch");
      this.userSubNode = document.getElementById("uerSearchSub");
      this.userSubNode.onclick = this.route;
    }
}

//サーバに接続し検索した後,結果を画面に反映する
userSearch.route = function(){
  connect("/userSearch/",{value:userSearch.userValueNode.value},userResult);
}

//データをクライアント側に表示
function userResult(data){
  const usersection = document.getElementById("usersection");
  const users = document.getElementsByClassName("userSlide");

  for(let i = users.length; i<data.length; i++){
    const id = data[i]._id;
    const follow = data[i].follow;

    usersection.appendChild(createUserNode(id, follow));
    resultUserAddActionHTML(id);
  }
}

function createUserNode(id,follow){
  // ユーザーを表示するresultノード生成
  const resultNode = document.createElement("div");
  resultNode.setAttribute("class","userSlide");

  const input1 = document.createElement("input");
  input1.setAttribute("type","button");
  input1.setAttribute("id","btn"+id);
  input1.setAttribute("class","action-open");

  const label = document.createElement("label");
  label.setAttribute("for","btn"+id);

  //　ユーザー情報をノードに追加
  const userInfo = document.createTextNode(id);

  // ユーザーラベル生成
  const userlabel = document.createElement("label");
  userlabel.setAttribute("id","userlabel"+id);
  userlabel.setAttribute("for","userlabel");
  userlabel.textContent = "フォロー数\t" + follow.length + "\t";

  //ユーザーノード生成
  const userNode = document.createElement("div");
  userNode.setAttribute("id","hid"+id);
  userNode.setAttribute("class","off");
  userNode.setAttribute("name","user");

  // ノード挿入
  resultNode.appendChild(input1);
  resultNode.appendChild(label);
  label.appendChild(userInfo);
  label.appendChild(userlabel);
  label.appendChild(userNode);

  /****フォロー機能を追加****/

  /**ユーザー認証**/
  connect("/userCheck/",{'user':user},function(res){
    if(res){
      //　ラベル生成
      const followlabel = document.createElement("label");
      followlabel.setAttribute("id","followlabel"+id);
      followlabel.textContent = "フォロー";

      // フォローしているユーザーを判別
      let checker = false;
      for(let i = 0; i<res.follow.length; i++){
        if(id == res.follow[i]){
          checker = true;
        }
      }

      // followボタンをセット
      const followbtn = document.createElement("input");
      followbtn.setAttribute("id","followbtn"+id);
      followbtn.setAttribute("type","checkbox");
      followbtn.setAttribute("name","follow");
      followbtn.checked = checker;

      //followノード挿入
      userNode.appendChild(followlabel);
      followlabel.appendChild(followbtn);

      // followボタンが押されたとき
      followbtn.onclick = function(){
        // MyNodeを取得
        const mylabel = document.getElementById("userlabel"+user._id);
        const myNode = document.getElementById("hid"+user._id);

        connect("/follow/",{'user':user,'followUserId':id,'follow':followbtn.checked},
        function(resFollow){
          if(resFollow){
            mylabel.textContent = "フォロー数\t" + resFollow.countFollow + "\t";

            // Nodeを更新
            followlabel.textContent = "フォロー";
            followlabel.appendChild(followbtn);

            if(followbtn.checked){
              console.log("フォローしたよ");
            }else {
              console.log("フォロー外したよ");
            }
          }else{
            window.alert("ユーザー認証できませんでした。");
          }
        });
      }
    }
  });
  return resultNode;

}

function resultUserAddActionHTML(id){
  const btn = document.getElementById('btn' + id);
  const hid = document.getElementById('hid'+ id);
  const sub = document.getElementById('sub'+ id);
  btn.onclick = function(){
    resultUserAddHidActionHTML(hid);

  }

}

function resultUserAddHidActionHTML(hid){
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
