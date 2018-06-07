
function connect(uri,data,callback,error){
  $.ajax({
    type: "POST",
    url: uri,
    data:data,
    dataType: 'json',
  })
  .done(callback)
  .fail(function(res){
    console.error(uri+"でエラーが起きています。");
    console.error("入力値:",data);
    if(error){
      error()
    }
  });
}
