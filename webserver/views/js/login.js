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
login.load = function(){
  if(document.cookie != null){
    const session = getCookie('sessionkey');
    console.log(session);
    //userに情報をセット
    if(session){
      $.ajax({
        type: "POST",
        url: "/login/",
        dataType: 'json',
        data:{'session':session, type:"session"}
      })
      .done(function(res){
        if(res.boo == 1){
            user = {_id:res.userid,_pass:res.userpass,session:res.sessionkey};
            console.log(user._id + "さんです");
            document.cookie = 'sessionkey=' + user.session + '; max-age=259200';
        }else{
          console.log("userを取得できませんでした");
        }
      })
      .fail(function(res){
        console.error(res);
      });
    }else{
      user = null;
    }
    console.log(document.cookie);
  }
}
//ログイン処理
login.route = function(){
  connect("/login/",{_id:login.userIdNode.value,pass:login.userPassNode.value,type:"login"},
  function(res){
    if(res.boo == 1){
      console.log(res);
        // cookieに値をセット
        document.cookie = 'sessionkey=' + res.sessionkey + '; max-age=259200';
        // sessionにsessionkey登録
        window.sessionStorage.setItem(['sessionkey'],[res.sessionkey]);
        user = {_id:res.userid,_pass:res.userpass,session:res.sessionkey};
    }else{
      console.log("ログイン失敗");
    }
  })
}
//ログアウトの処理
login.logout = function(){
  //cookieとsessionを削除
  document.cookie = 'sessionkey=; max-age=0'
  window.sessionStorage.clear();
  user = null;
  console.log(document.cookie);
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

function setUser(session){
  $.ajax({
    type: "POST",
    url: "/login/",
    dataType: 'json',
    data:{'session':session, type:"session"}
  })
  .done(function(res){
    if(res.boo == 1){
      console.log(res);
        user = {_id:res.userid,_pass:res.userpass,session:res.sessionkey};
        console.log(user.userid + "さんです");
    }else{
      console.log("userを取得できませんでした");
    }
  })
  .fail(function(res){
    console.error(res);
  });
}
