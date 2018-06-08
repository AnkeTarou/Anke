
function connect(uri,data,callback,error){
  $.ajax({
    type: "POST",
    url: uri,
    data:data,
    dataType: 'json',
  })
  .done(function(res){
    if(this.log){
      console.log("connect");
      console.log("uri",uri);
      console.log("送信データ",data);
      console.log("受信データ",res);
    }
    this.log = true;
    callback(res);
  })
  .fail(function(res){
    console.error(uri+"でエラーが起きています。");
    console.error("入力値:",data);
    if(error){
      error()
    }
  });
}
