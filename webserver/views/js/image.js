/*
 *image処理
 */
var user = null;
var image = {
   init:function(){
     this.upload = document.getElementById("upload");
     this.letsbutton = document.getElementById("letsbutton");
     this.files = document.getElementById("file");
     this.file = null; // 選択されるファイル
     this.blob = null; // 画像(BLOBデータ)

     this.upload.onclick = this.load;
     this.letsbutton.onclick = this.button;
   }
};
image.button = function(){
  const THUMBNAIL_WIDTH = 500; // 画像リサイズ後の横の長さの最大値
  const THUMBNAIL_HEIGHT = 500; // 画像リサイズ後の縦の長さの最大値
  // ファイルを取得
  image.file = image.files;
  // 選択されたファイルが画像かどうか判定
  if (image.files.type != 'image/jpeg' && image.files.type != 'image/png') {
    // 画像でない場合は終了
    image.file = null;
    image.blob = null;
    return;
  }

  // 画像をリサイズする
  let images = new Image();
  let reader = new FileReader();
  reader.onload = function(e) {
    images.onload = function() {
      let width, height;
      if(images.width > images.height){
        // 横長の画像は横のサイズを指定値にあわせる
        const ratio = images.height/images.width;
        width = THUMBNAIL_WIDTH;
        height = THUMBNAIL_WIDTH * ratio;
      } else {
        // 縦長の画像は縦のサイズを指定値にあわせる
        const ratio = images.width/images.height;
        width = THUMBNAIL_HEIGHT * ratio;
        height = THUMBNAIL_HEIGHT;
      }
      // サムネ描画用canvasのサイズを上で算出した値に変更
      let canvas = $('#canvas')
                   .attr('width', width)
                   .attr('height', height);
      let ctx = canvas[0].getContext('2d');
      // canvasに既に描画されている画像をクリア
      ctx.clearRect(0,0,width,height);
      // canvasにサムネイルを描画
      ctx.drawImage(image,0,0,images.width,images.height,0,0,width,height);
      // canvasからbase64画像データを取得
      const base64 = canvas.get(0).toDataURL('image/jpeg');
      // base64からBlobデータを作成
      let barr, bin, i, len;
      bin = atob(base64.split('base64,')[1]);
      len = bin.length;
      barr = new Uint8Array(len);
      i = 0;
      while (i < len) {
        barr[i] = bin.charCodeAt(i);
        i++;
      }
      blob = new Blob([barr], {type: 'image/jpeg'});
    }
    images.src = e.target.result;
  }
  reader.readAsDataURL(file);
};

// アップロード開始ボタンがクリックされたら
this.load = function(){
  const data = canvas.toDataURL('files');
  // ファイルが指定されていなければ何も起こらない
  if(!image.file || !image.blob) {
    alert("指定されてないぞ");
    return;
  }
  //var name, fd = new FormData();
  //fd.append('file', blob); // ファイルを添付する
  $.ajax({
    url: "file", // 送信先
    type: 'POST',
    dataType: 'json',
    processData: false,
    contentType: false,
    data:{'data':data}
  })
  .done(function(res) {
    const elem = document.getElementById("image");
    elem.src=data;
  })
  .fail(function(res) {
    // 送信失敗
    alert("送信失敗");
  });
};
