
function connect(uri,data,callback,error){
  $.ajax({
    type: "POST",
    url: uri,
    data:data,
    dataType: 'json',
  })
  .done(function(res){
    if(connect.log){
      console.log("connect");
      console.log("uri",uri);
      console.log("送信データ",data);
      console.log("受信データ",res);
    }
    connect.log = true;
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
connect.log = true;
