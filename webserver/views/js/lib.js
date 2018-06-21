
function connect(uri,data,callback,error){
  const req = new XMLHttpRequest();
  //レスポンスが返ってきたときの処理
  req.addEventListener("load",function() {
    if(connect.log){
      console.log("connect");
      console.log("uri",uri);
      console.log("送信データ",data);
      console.log("受信データ",res.response);
    }
    connect.log = true;
    callback(res.response);
  })
  req.addEventListener("error",function(e){
    console.log(e);
    console.error(uri+"でエラーが起きています。");
    console.error("入力値:",data);
  });
  })
  req.responseType = "json"
  req.open('POST', uri);
  req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  req.send(EncodeHTMLForm(data));
}
connect.log = true;
