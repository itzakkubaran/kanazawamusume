 /*
 * KmCommonMenu.js
 *
 * All Rights Reserved, Copyright ITざっくばらん会 ものづくり部 2016 
 * 
 * 2016.10.08 m.asaoka Ver1.0-01 新規作成
 *
 */

/* マップメニューキー */
var KEY_MAP_POS_SETTING = "KEY_KANAMUSU_MAP_POS";  //マップ位置設定

/* マップメニュー設定種別 */
var TYPE_MAP_POS_KANAZAWA_TOWN = 0;    //かなざわ学生のまち交流館
var TYPE_MAP_POS_KANAZAWA_STATION = 1; //金沢駅
var TYPE_MAP_POS_CURRENT = 2;          //現在位置

/* マップメニューラジオボタンID名 */
var MAP_RADIO_BTN_ID_DEFAULT_POS = "radio_default_pos";  //学生のまち交流館
var MAP_RADIO_BTN_ID_STATION_POS = "radio_station_pos";  //金沢駅
var MAP_RADIO_BTN_ID_CURRENT_POS = "radio_current_pos";  //現在位置

//---------------------------------------
// マップメニュー設定を復元します。
//---------------------------------------
function LoadMapSetting()
{
    //マップの位置情報をセット
    loadMapPosSetting();
}
//-------------------------------------------
// マップ位置情報を画面に反映する
//-------------------------------------------
function loadMapPosSetting()
{
   //一度ラジオボタンの状態をクリア
   clearMapPosSetting();

   //ストレージからマップ中央位置設定を取得
   var value = getLocalStrageValue(KEY_MAP_POS_SETTING, TYPE_MAP_POS_KANAZAWA_TOWN);
   //金沢駅の場合
   if(value == TYPE_MAP_POS_KANAZAWA_STATION)
   {
      setRadioButton(MAP_RADIO_BTN_ID_STATION_POS, true);
   }
   //現在位置の場合
   else if(value == TYPE_MAP_POS_CURRENT)
   {
      setRadioButton(MAP_RADIO_BTN_ID_CURRENT_POS, true);
   }
   //その他は金沢学生の町交流会館
   else
   {
      setRadioButton(MAP_RADIO_BTN_ID_DEFAULT_POS, true);
   }
}
//-------------------------------------------
// マップ位置情報を保存する
//-------------------------------------------
function SaveMapPosSetting()
{
   //ローカルストレージに保存
   setLocalStrageValue(KEY_MAP_POS_SETTING, getMapPosSaveValue());
}
//-------------------------------------------
// マップ位置情報を保存形式に変換する
//-------------------------------------------
function getMapPosSaveValue()
{
   var value = TYPE_MAP_POS_KANAZAWA_TOWN;
   if(getRadioButton(MAP_RADIO_BTN_ID_STATION_POS))
   {
       value = TYPE_MAP_POS_KANAZAWA_STATION;
   }
   else if (getRadioButton(MAP_RADIO_BTN_ID_CURRENT_POS))
   {
       value = TYPE_MAP_POS_CURRENT;
   }
   return value;
}
//-------------------------------------------
// マップ位置情報をクリアする
//-------------------------------------------
function clearMapPosSetting()
{
   setRadioButton(MAP_RADIO_BTN_ID_DEFAULT_POS, false);
   setRadioButton(MAP_RADIO_BTN_ID_STATION_POS, false);
   setRadioButton(MAP_RADIO_BTN_ID_CURRENT_POS, false);
}
//-------------------------------------------
// ローカルストレージをサポートしているか判定
//-------------------------------------------
function isSupportedLocalStrage()
{
    if(('localStorage' in window) && (window.localStorage != null)) 
    {
        return true;
    }
    return false;
}
//-------------------------------------------
// ローカルストレージから値を取得する。
//-------------------------------------------
function getLocalStrageValue(keyname, defaultValue)
{
   if(isSupportedLocalStrage() == true)
   {
      var value = localStorage.getItem(keyname);
      if(value != null)
      { 
         return value;
      }
   }
   return defaultValue;
}
//-------------------------------------------
// ローカルストレージに値を保存する。
//-------------------------------------------
function setLocalStrageValue(keyname, value)
{
   if(isSupportedLocalStrage() == true)
   {
      localStorage.setItem(keyname, value);
   }
}
//-------------------------------------------
// Radioボタンの状態をセットする。
//-------------------------------------------
function setRadioButton(elementName, value)
{
   var r_button = document.getElementById(elementName);
   if(r_button != null)
   {
      r_button.checked = value;
   }
}
//-------------------------------------------
// Radioボタンの状態を取得する
//-------------------------------------------
function getRadioButton(elementName, defaultValue)
{
   var r_button = document.getElementById(elementName);
   if(r_button != null)
   {
      return r_button.checked;
   }
   return defaultValue;
}