/*
 * KmMainLoad.js
 *
 * All Rights Reserved, Copyright ITざっくばらん会 ものづくり部 2016 - 2017
 * 
 * トップ画面の読み込み処理
 * 
 * 2017.01.03 m.asaoka Ver1.0-01 新規作成
 *
 */
//------------------------------------
// 読み込み時トップにバルーンを表示
//------------------------------------
function onloadShowBalloon(){
  addToHomescreen({
    appID:"AddToHomescreenKanavigation",
    lifespan:0 // 0秒で表示
    });
}
