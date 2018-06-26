/*
 *image処理
 */
var user = null;
var image = {
   init:function(){
     this.upload = document.getElementById("upload");
     this.tmpfile = document.getElementById("tmpfile");
     this.imageget = document.getElementById("imageget");
     this.imgdisplay = document.getElementById("imgdisplay");
     this.fileData = undefined;

     this.imageget.onclick = this.imgget;
     this.tmpfile.onchange = image.test;
     this.upload.onclick = this.route;
   }
};
image.test = function(e){
  console.log(e);
  let file = e.target.files[0];
  let reader = new FileReader();
  // 選択されたファイルが画像かどうか判定
  if (file.type != 'image/jpeg' && file.type != 'image/png') {
    // 画像でない場合は終了
    alert("画像ファイルを選択してください");
    return;
  }
  //dataURL形式でファイルを読み込む
  reader.readAsDataURL(file);
  //ファイルの読込が終了した時の処理
  reader.onload = function(){
    image.fileData = reader.result;
    //console.log(image.fileData);
  }
}

// アップロード開始ボタンがクリックされたら
image.route = function(){
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
    image.file=res;
    console.log(res);
    alert("送信成功");
  })
  .fail(function(res) {
    // 送信失敗
    alert("送信失敗");
  });
};

//Mongoから画像を取り出す(表示がクリックされたら)
image.imgget = function(){
  $.ajax({
    url: "/imageget/", // 送信先
    type: 'POST',
    dataType: 'json',
    data:function(){
      console.log("ajax",image.file);
      return {img:image.file};
    }()
  })
  .done(function(res) {
    image.imgdisplay.src =res;
    alert("送信成功");
  })
  .fail(function(res) {
    console.log(res);
    // 送信失敗
    alert("送信失敗");
  });
}
