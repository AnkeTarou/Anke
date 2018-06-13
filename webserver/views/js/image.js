/*
 *image処理
 */
var user = null;
var image = {
   init:function(){
     this.upload = document.getElementById("upload");
     this.letsbutton = document.getElementById("letsbutton");
     this.tmpfile = document.getElementById("tmpfile");
     this.image = undefined;
     this.fileData = undefined;
     this.file = null; // 選択されるファイル
     this.blob = null; // 画像(BLOBデータ)

     this.tmpfile.onchange = image.test;
     this.upload.onclick = this.route;
     this.letsbutton.onclick = this.button;
   }
};
image.test = function(e){
  let file = e.target.files;
  let reader = new FileReader();

  /*var encodedData = window.btoa(file[0]);  // 文字列のエンコード
  console.log(encodedData);
  var decodedData = window.atob(encodedData);     // 文字列のデコード
  console.log(decodedData);

  var decoded = window.atob(image.fileData);
  console.log(decoded);*/
  //dataURL形式でファイルを読み込む
  reader.readAsDataURL(file[0]);
  //ファイルの読込が終了した時の処理
  reader.onload = function(){
    image.fileData = reader.result;
    //console.log(image.fileData);
  }
}

// アップロード開始ボタンがクリックされたら
image.route = function(){
  /*var decodeString = window.atob(image.fileData);
  console.log(decodeString);*/
  $.ajax({
    url: "/sendfile/", // 送信先
    type: 'POST',
    dataType: 'json',
    data:function(){
      //console.log("ajax",image.fileData);
      return {img:image.fileData};
    }()
  })
  .done(function(res) {
    console.log(res);
    alert("送信成功");
  })
  .fail(function(res) {
    // 送信失敗
    alert("送信失敗");
  });
};
