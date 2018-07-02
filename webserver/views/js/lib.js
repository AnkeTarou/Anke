
function connect(uri,data,callback,error){
  const req = new XMLHttpRequest();

  //レスポンスが返ってきたときの処理
  req.addEventListener("load",function(e) {
    console.log("connect");
    console.log("uri",uri);
    console.log("送信データ",data);
    console.log("受信データ",req.response);

    callback(req.response);
  })
  req.addEventListener("error",function(e){
    console.error(uri+"でエラーが起きています。");
    console.error("入力値:",data);
    if(error){
      error()
    }
  })
  req.responseType = "json"
  req.open('POST', uri);
  req.setRequestHeader("Content-type", "application/JSON");
  req.send(JSON.stringify(data));
}
