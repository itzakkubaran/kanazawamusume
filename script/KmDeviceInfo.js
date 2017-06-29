/*
 * KmDeviceInfo.js　 
 *
 * All Rights Reserved, Copyright ITざっくばらん会 Makers 2016 
 * 
 * 2016.09.01 m.asaoka Ver1.0-01 新規作成
 *
 */

/* 現在位置取得結果 */
var now_lat = -999;                       //現在位置の緯度
var now_lng = -999;                       //現在位置の経度
var deviceResult = -1;                  　//現在位置の取得の成功可否

/* デバイス情報取得結果 */
var DEVICE_SUCCESS = 0;                 //デバイス取得成功
var PERMISSION_DENIED = 1;              //位置情報の利用が許可されていない
var POSITION_UNAVAILABLE = 2;           //デバイス情報取得エラー
var TIMEOUT = 3;		        //タイムアウト

/* デバイス情報取得設定 */
var DEVICE_TIMEOUT = 6000;             　　　//タイムアウト値（6秒)
var DEVICE_ENABLE_HIGH_ACCURACY = true;      //位置情報の精度(TRUE=高くする)
var DEVICE_MAXIMUM_AGE = 600000;             //有効期限（10分）

//------------------------------------
// デバイス情報取得処理
//------------------------------------
function GetCurrentPosition()
{
   //サポートしている場合のみ取得
　 if(navigator.geolocation)
   {
　　　var opts = 
      {
         enableHighAccuracy: DEVICE_ENABLE_HIGH_ACCURACY;
         timeout:DEVICE_TIMEOUT; 
         maximumAge:DEVICE_MAXIMUM_AGE;
         
      };
　　　//ユーザーの位置情報を取得
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, opts);
   }
}
//------------------------------------
// ユーザー位置情報取得成功処理
//------------------------------------
function successCallback(position)
{
   //緯度をセット
   now_lat = position.coords.latitude;
   //経度をセット
　 now_lng = position.coords.longitude;
   //デバイス結果をセット
　 deviceResult = DEVICE_SUCCESS;
}
//------------------------------------
// 取得失敗時の処理
//------------------------------------
function errorCallback(error)
{
  var err_msg = "";
  switch(error.code)
  {
    case PERMISSION_DENIED:
      err_msg = "位置情報の利用が許可されていません";
      break;
    case POSITION_UNAVAILABLE:
      err_msg = "デバイスの位置が判定できません";
      break;
    case TIMEOUT:
      err_msg = "タイムアウトしました";
      break;
    default:
      break;
  }
  //for debug
  // alert(err_msg);
}
//------------------------------------
// 現在位置の緯度を取得
//------------------------------------
function getCurrentLatitude()
{
　 return now_lat;
}
//------------------------------------
// 現在位置の経度を取得
//------------------------------------
function getCurrentLongitude()
{
　 return now_lng;
}
//------------------------------------
// 現在位置の経度を取得
//------------------------------------
function getDeviceStatus()
{
   return deviceResult;
}

