/*
 * KmMainResize.js
 *
 * All Rights Reserved, Copyright ITざっくばらん会 ものづくり部 2016 
 * 
 * メイン画面のリサイズ処理を行います。
 * 
 * 2016.10.10 m.asaoka Ver1.0-01 新規作成
 *
 */

/* デフォルトサイズ定義 */
var DEFAULT_PC_WIDTH = 480;   //PC横幅サイズ
var DEFAULT_ICON_HEIGHT = 50; //Iconメニューデフォルト高さ
var DEFAULT_ADJAST = 66;      
//------------------------------------
// Window Resize時の処理
//------------------------------------
$(window).resize(function(){
       setBodySizeForMain(); //リサイズ処理実行
});
//------------------------------------
// Bodyサイズを設定します
//------------------------------------
function setBodySizeForMain()
{
    //ブラウザの縦横幅を取得
    var browserWidth = window.innerWidth;
    var browserHeight = window.innerHeight;

    var bodyWidth = browserWidth + "px";
    var bodyHeight = browserHeight + "px";
    var bodyWidthMath = browserHeight;
    var bodyHeightMath = browserHeight;
    var bodyLeftMargin = "0px";

    //480pxを超える場合
    if(browserWidth >= 480)
    {
       bodyWidth = DEFAULT_PC_WIDTH + "px";
       bodyWidthMath = DEFAULT_PC_WIDTH;
       var bodySpace = parseInt(browserWidth, 10) - parseInt(bodyWidth, 10);
       bodyLeftMargin = bodySpace > 0 ? (bodySpace / 2) + "px" : "0px";
    }
    //Bodyサイズの調整 //センタリングが有効化されないので、調整
    $("body").width(bodyWidth);
    $("body").css({"margin-left" : bodyLeftMargin });
        
}