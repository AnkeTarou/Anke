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

     this.inSub.onclick = this.route;
     this.outSub.onclick = this.logout;
     this.outUserStatusSub.onclick = this.outputStatus;
   }
};
//ログイン処理
login.route = function(){
 $.ajax({
   type: "POST",
   url: "/login/",
   dataType: 'json',
   data:{_id:login.userIdNode.value,pass:login.userPassNode.value}
 })
 .done(function(res){
   if(res.boo == 1){
       console.log("ログイン成功");
       // cookieに値をセット
       document.cookie = 'userid=' + res.userid + '; max-age=259200';
       document.cookie = 'userpass=' + res.userpass + '; max-age=259200';
       console.log(document.cookie);
       user = {_id:res.userid,_pass:res.userpass};
   }else{
     console.log("ログイン失敗");
   }
 })
 .fail(function(res){
   console.error(res);
 });
};
//ログアウトの処理
login.logout = function(){
  //cookieを削除
  document.cookie = 'userid=; max-age=0'
  document.cookie = 'userpass=; max-age=0'
  user = null;
  console.log(document.cookie);
}
login.outputStatus = function(){
  const userId = getCookie("userid");
  if(userId){
    const inp = document.getElementById("login_ts");
    if(!inp){
      let text = document.createElement("div");
      text.id = "login_ts";
      text.appendChild(document.createTextNode(userId + "さんでログイン中"));
      loginBox.appendChild(text);
    }
    console.log(document.cookie);
  }else{
    console.log("ログインしてません")
  }
}

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
