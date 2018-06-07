
function connect(uri,data,callback,error){
  $.ajax({
    type: "POST",
    url: uri,
    data:data,
    dataType: 'json',
  })
  .done(function(res){
    console.log("connect");
    console.log("uri",uri);
    console.log("data",data);
    console.log("res",res);
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
