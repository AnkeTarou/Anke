/*
  アカウント登録
 */
var account = {
  init:function(){
    this.userIdNode = document.getElementById("inputaccount");
    this.userPassNode = document.getElementById("inputgetpass");
    this.createAccountSub = document.getElementById("inputget");

    this.createAccountSub.onclick = this.route;
  }
}

//ログイン情報登録
account.route = function(){
  connect("/account/",{_id:account.userIdNode.value,pass:account.userPassNode.value}
  ,function(res){
    if(res!=1){
      console.log(res);
      //ここでメールを送る
        console.log("登録が完了しました。");
    }else{
        console.log("既に登録されているIDです！");
    }
  })
};
