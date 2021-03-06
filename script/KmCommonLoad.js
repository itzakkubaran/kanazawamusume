/*
 * KmCommonLoad.js
 *
 * All Rights Reserved, Copyright ITざっくばらん会 ものづくり部 2016 
 * 
 * 画面の読み込み処理を行います。
 * 
 * 2016.10.02 m.asaoka Ver1.0-01 新規作成
 *
 */

/* デフォルトサイズ定義 */
var DEFAULT_PC_WIDTH = 480;   //PC横幅サイズ
var DEFAULT_ICON_HEIGHT = 30; //Iconメニューデフォルト高さ
var DEFAULT_ADJAST = 66;      

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
       var bodyWhite = parseInt(browserWidth, 10) - parseInt(bodyWidth, 10);
       bodyLeftMargin = bodyWhite > 0 ? (bodyWhite / 2) + "px" : "0px";
    }
    //Bodyサイズの調整
    $("body").width(bodyWidth);
    $("body").css({"margin-left" : bodyLeftMargin });
     
    //Iconメニューボタンの調整
    $("#iconTop").width(bodyWidth);
    $("#iconTop").css({"left" : bodyLeftMargin });
    $("#iconTop").height(DEFAULT_ICON_HEIGHT);
    $("#iconTop").css({"line-height" : DEFAULT_ICON_HEIGHT + "px"});
}