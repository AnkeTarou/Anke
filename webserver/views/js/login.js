/*
  ログインの定義
 */
var user = null;
var login = {
   init:function(){
     this.userIdNode  = document.getElementById("inputloginid");
     this.userPassNode = document.getElementById("inputloginpass");
     this.outUserStatusSub = document.getElementById("inputuser");
     this.inSub = document.getElementById("inputlogin");
     this.outSub = document.getElementById("inputlogout");

     this.load();
     this.inSub.onclick = this.route;
     this.outSub.onclick = this.logout;
     this.outUserStatusSub.onclick = this.outputStatus;
   }
};
//cookieをロード
login.load = function(){
  if(document.cookie != null){
    const session = getCookie('sessionkey');
    console.log("beforeSession",session);
    //userに情報をセット
    if(session){
      connect("/login/",{'session':session, type:"session"},
      function(res){
        if(res.boo == 1){
          user = {_id:res.userid,session:res.sessionkey};
          console.log(user._id + "さんです");
          document.cookie = 'sessionkey=' + user.session + '; max-age=259200';
        }else{
          console.log("userを取得できませんでした");
        }
      })
      document.getElementById("inputSub").value = "送信";
    }else{
      user = null;
    }
    console.log("before" + document.cookie);
  }
}
//ログイン処理
login.route = function(){
  connect("/login/",{_id:login.userIdNode.value,pass:login.userPassNode.value,type:"login"},
  function(res){
    if(res.boo == 1){
      // cookieに値をセット
      document.cookie = 'sessionkey=' + res.sessionkey + '; max-age=259200';
      user = {_id:res.userid,session:res.sessionkey};
      login.load();
    }else{
      console.log("ログイン失敗");
    }
    console.log("セッションキー",document.cookie);
  })
}
//ログアウトの処理
login.logout = function(){
  //cookieとsessionを削除
  document.cookie = 'sessionkey=; max-age=0';
  user = null;
  console.log(document.cookie);
  login.load();
}
login.outputStatus = function(){
  if(user){
    const inp = document.getElementById("login_ts");
    if(!inp){
      let text = document.createElement("div");
      text.id = "login_ts";
      text.appendChild(document.createTextNode(user._id + "さんでログイン中"));
      loginBox.appendChild(text);
    }
    console.log("current" + document.cookie);
  }else{
    console.log("ログインしてません")
  }
}

//nameのcookieを取得
function getCookie( name ){
  let result = null;

  const cookieName = name + '=';
  const allcookies = document.cookie;

  const position = allcookies.indexOf( cookieName );
  if(position!=-1){
    let startIndex = position + cookieName.length;
    let endIndex = allcookies.indexOf( ';', startIndex );
    if(endIndex == -1){
      endIndex = allcookies.length;
    }
    result = decodeURIComponent(allcookies.substring(startIndex,endIndex));
  }
  return result;
}
