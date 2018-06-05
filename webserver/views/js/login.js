/*
  ログインの定義
 */
 var login = {
   init:function(){
     this.userIdNode  = document.getElementById("inputloginid");
     this.userPassNode = document.getElementById("inputloginpass");
     this.inSub = document.getElementById("inputlogin");
     this.outSub = document.getElementById("inputlogout");
     this.inSub.onclick = this.route;
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
