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
  const users = document.getElementsByClassName("user");

  for(let i = users.length; i<data.length; i++){
    const id = data[i]._id;

    /****未実装****/
    /*const good = data[i].good;
    const follow = data[i].follow;
    const follower = data[i].follower;*/

    usersection.appendChild(createUserNode(id));
    //resultUserAddActionHTML(id);
  }
}

function createUserNode(id){
  // ユーザーノード生成
  const resultNode = document.createElement("div");
  resultNode.setAttribute("class","userSlide");

  const input1 = document.createElement("input");
  input1.setAttribute("type","button");
  input1.setAttribute("id","btn"+id);
  input1.setAttribute("class","action-open");

  const label = document.createElement("label");
  label.setAttribute("for","btn"+id);

  const userNode = document.createElement("div");
  userNode.setAttribute("class","user");

  //　ユーザー情報をノードに追加
  const userInfo = document.createTextNode(id);

  // ノード挿入
  resultNode.appendChild(input1);
  resultNode.appendChild(label);
  label.appendChild(userNode);
  label.appendChild(userInfo);

  return resultNode;

}
