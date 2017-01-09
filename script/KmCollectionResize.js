/*
 * KmCollectionResize.js
 *
 * All Rights Reserved, Copyright ITざっくばらん会 ものづくり部 2016 
 * 
 * 図鑑画面のサイズ調整処理を行います。
 * 
 * 2016.12.25 m.asaoka Ver1.0-01 新規作成
 *
 */
/* デフォルトサイズ定義 */
var DEFAULT_TOP_HEIGHT = 50; //トップメニューの縦幅

/* 読み込み時サイズ */
var DEFAULT_FOOTER_HEIGHT_CLOSE = 52;   //Close時のfooterの高さ(px)
var DEFAULT_FOOTER_HEIGHT_OPEN = 178;   //Open時のfooterの高さ(px)

//------------------------------------
// Window Resize時の処理
//------------------------------------
$(window).resize(function(){
       //現在のメニューの高さを取得
       var headerHeight = $('header').height();
       var menuHeight   = $('footer').height(); 
       setCollectionSize(menuHeight + headerHeight);
});
//------------------------------------
// toggleMenuクリック時の処理
//------------------------------------
function onToggleMenuClick()
{
    //クリック時のメニューの高さを取得
    var headerHeight = $('header').height();    
    var menuHeight = $('footer').height(); 
    //クリック前の状態を取得
    if(isToggleMenuShown(menuHeight) == true)
    {
        //Close状態でマップをリサイズ
        setCollectionSize(headerHeight + DEFAULT_FOOTER_HEIGHT_CLOSE);
        return;
    }
    setCollectionSize(headerHeight + DEFAULT_FOOTER_HEIGHT_OPEN);
}
//------------------------------------
// リサイズ処理を実施します。
//------------------------------------
function ResizeforCollection()
{   
    //現在のメニューサイズを取得
    var headerHeight = $('header').height();
    var menuHeight = $('footer').height(); 
    
    //Mapサイズを設定
    setCollectionSize(menuHeight + headerHeight);
    
    //トップメニューのサイズをセット
    setTopBarSize();
}
//------------------------------------
// マップのサイズを設定します
//------------------------------------
function setCollectionSize(menuHeight)
{
   //マップの再調整  
   var hsize = $(window).height() - menuHeight;
   $("#collectionFields").css("height", hsize + "px");
   alert(hsize);
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
