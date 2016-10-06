/*
 * KmMapResize.js
 *
 * All Rights Reserved, Copyright ITざっくばらん会 ものづくり部 2016 
 * 
 * マップ画面のサイズ調整処理を行います。
 * 
 * 2016.10.02 m.asaoka Ver1.0-01 新規作成
 * 2016.10.04 m.asaoka Ver1.0-02 a.kamemotoの処理をマージ
 * 2016.10.06 m.asaoka Ver1.0-03 メニュークリック時に空白ができるバグ修正
 *
 */
/* デフォルトサイズ定義 */
var DEFAULT_TOP_HEIGHT = 50; //トップメニューの縦幅

/* 読み込み時サイズ */
var DEFAULT_FOOTER_HEIGHT_CLOSE = 52;   //Close時のfooterの高さ(px)
var DEFAULT_FOOTER_HEIGHT_OPEN = 188;   //Open時のfooterの高さ(px)

//------------------------------------
// Window Resize時の処理
//------------------------------------
$(window).resize(function(){
       //現在のメニューの高さを取得
       var menuHeight = $('footer').height(); 
       setMapSize(menuHeight);
});
//------------------------------------
// toggleMenuクリック時の処理
//------------------------------------
function onToggleMenuClick()
{
    //クリック時のメニューの高さを取得
    var menuHeight = $('footer').height(); 
    //クリック前の状態を取得
    if(isToggleMenuShown(menuHeight) == true)
    {
        //Close状態でマップをリサイズ
        setMapSize(DEFAULT_FOOTER_HEIGHT_CLOSE);
        return;
    }
    //Open状態でマップをリサイズ
    setMapSize(DEFAULT_FOOTER_HEIGHT_OPEN);    
}
//------------------------------------
// マップ画面のリサイズを行います
//------------------------------------
function ResizeforMap()
{   
    //現在のメニューサイズを取得
    var menuHeight = $('footer').height(); 
    
    //Mapサイズを設定
    setMapSize(menuHeight);
    
    //トップメニューのサイズをセット
    setTopBarSize();
}
//------------------------------------
// マップのサイズを設定します
//------------------------------------
function setMapSize(menuHeight)
{
   //マップの再調整  
   var hsize = $(window).height() - menuHeight;
   $("#map-canvas").css("height", hsize + "px");
}
//------------------------------------
// Toggleメニューが表示状態かどうか判定
//------------------------------------
function isToggleMenuShown(menuHeight)
{
   if(menuHeight > DEFAULT_FOOTER_HEIGHT_CLOSE)
   {
       return true;
   }
   return false;
}
//----------------------------------------------
// マップ画面のトップバーのリサイズを行います。
//----------------------------------------------
function setTopBarSize()
{				
    $("#iconTop").height(DEFAULT_TOP_HEIGHT);
    $("#iconTop").css({"line-height" : DEFAULT_TOP_HEIGHT + "px"});
}
