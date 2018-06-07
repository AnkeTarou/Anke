/*
　メールの定義
 */
 var mail = {
   init:function(){
     this.subNode = document.getElementById("inputmail");
     this.valueNode = document.getElementById("inputmailadress");

     this.subNode.onclick = this.route;
   }
 };



mail.route = function(){
  connect("/mail/",{value:mail.valueNode.value},
  function(){
    console.log("successful");
  })
}
