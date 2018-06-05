/*
  アカウント登録
 */
var account = {
  init:function(){
    this.userIdNode = document.getElementById("inputaccount");
    this.userPassNode = document.getElementById("inputgetpass");
    this.createAccountSub = document.getElementById("inputget");

    this.createAccountSub.onclick = this.createAccount;
  }
}

//ログイン情報登録
account.createAccount = function(){
  $.ajax({
    type: "POST",
    url: "/account/",
    dataType: 'json',
    data:{_id:account.userIdNode.value,pass:account.userPassNode.value}
  })
  .done(function(res){
    if(res!=1){
      //ここでメールを送る
        console.log("仮登録が完了しました。");
    }else{
        console.log("既に登録されているIDです！");
    }
  })
  .fail(function(res){
    console.error(res);
  });
};
