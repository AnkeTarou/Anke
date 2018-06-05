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
  $.ajax({
    type: "POST",
    url: "/mail/",
    dataType: 'json',
    data:{value:mail.valueNode.value}
  })
  .done(function(res){
    console.log("successful");
  })

  .fail(function(res){
    console.error(res);
  });
}
