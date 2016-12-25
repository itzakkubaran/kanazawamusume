 /*
 * KmCommonMenu.js
 *
 * All Rights Reserved, Copyright ITざっくばらん会 ものづくり部 2016 
 * 
 * 2016.09.17 m.asaoka Ver1.0-01 新規作成
 * 2016.10.29 m.asaoka Ver1.0-02 絞込設定反映
 *
 */

/* マップメニューキー */
var KEY_MAP_POS_SETTING = "KEY_KANAMUSU_MAP_POS";  	//マップ位置設定
var KEY_MAP_SELECT_SETTING = "KEY_KANAMUSU_MAP_SELECT"; //絞込設定（ピンの表示非表示）

/* マップメニュー設定種別 */
var TYPE_MAP_POS_KANAZAWA_TOWN = 0;    //かなざわ学生のまち交流館
var TYPE_MAP_POS_KANAZAWA_STATION = 1; //金沢駅
var TYPE_MAP_POS_CURRENT = 2;          //現在位置

var TYPE_MAP_NARROW_ALL = "0";           //すべて選択
var TYPE_MAP_NARROW_INSHOKU = "1";       //飲食店
var TYPE_MAP_NARROW_WAGASHI = "2";       //和菓子屋
var TYPE_MAP_NARROW_OMIYAGE = "3";       //お土産
var TYPE_MAP_NARROW_KOUGEI  = "4";       //工芸品
var TYPE_MAP_NARROW_OTHER   = "5";       //その他

var CHK_OFF = 0;   //チェックオフ
var CHK_ON  = 1;   //チェックオン

/* マップメニューラジオボタンID名 */
var MAP_RADIO_BTN_ID_DEFAULT_POS = "radio_default_pos";  //学生のまち交流館
var MAP_RADIO_BTN_ID_STATION_POS = "radio_station_pos";  //金沢駅
var MAP_RADIO_BTN_ID_CURRENT_POS = "radio_current_pos";  //現在位置

var MAP_CHK_INNSHOKU_ID = "chk_inshoku"; 		 //飲食店（チェックボックス)
var MAP_CHK_WAGASHI_ID  = "chk_wagashi";  		 //和菓子屋（チェックボックス）
var MAP_CHK_OMIYAGE_ID  = "chk_omiyage";  		 //お土産（チェックボックス)
var MAP_CHK_KOUGEI_ID   = "chk_kougei";   	 	 //工芸品（チェックボックス）
var MAP_CHK_OTHER_ID    = "chk_other";    	         //その他（チェックボックス）
var MAP_CHK_ALLSELECT   = "select_all_check";            //すべて選択（チェックボックス）

/**
* マップメニュー設定を復元します。
*/
function LoadMapSetting()
{
    //マップの位置情報をセット
    loadMapPosSetting();
    //マップの表示検索条件をセット
    loadMapNarrowSetting();
}
/**
* マップ位置情報を画面に反映する
*/
function loadMapPosSetting()
{
   //一度ラジオボタンの状態をクリア
   clearMapPosSetting();

   //ストレージからマップ中央位置設定を取得
   var value = getLocalStrageValue(KEY_MAP_SELECT_SETTING, TYPE_MAP_POS_KANAZAWA_TOWN);
   //金沢駅の場合
   if(value == TYPE_MAP_POS_KANAZAWA_STATION)
   {
      setCheckButton(MAP_RADIO_BTN_ID_STATION_POS, true);
   }
   //現在位置の場合
   else if(value == TYPE_MAP_POS_CURRENT)
   {
      setCheckButton(MAP_RADIO_BTN_ID_CURRENT_POS, true);
   }
   //その他は金沢学生の町交流会館
   else
   {
      setCheckButton(MAP_RADIO_BTN_ID_DEFAULT_POS, true);
   }
}
/**
* マップ絞込情報を画面に反映する
*/
function loadMapNarrowSetting()
{
   //一度チェックボタンの状態をクリア
   clearMapNarrowSetting();

   //すべて選択状態かどうか判定
   var keyName = KEY_MAP_SELECT_SETTING + "_" + TYPE_MAP_NARROW_ALL;

   //ストレージから「すべて選択」が設定されているか判定
   var value = getLocalStrageValue(keyName, CHK_ON);
   if(value == CHK_ON)
   {
      //ボタンをすべて選択状態にする
      setCheckButton(MAP_CHK_ALLSELECT, true);
      allcheckNarrowSetting();
      return;
   }
   //「飲食店」にチェックされているか判定
   keyName = KEY_MAP_SELECT_SETTING + "_" + TYPE_MAP_NARROW_INSHOKU;
   value = getLocalStrageValue(keyName, CHK_OFF);
   setCheckButtonMapNarrow(value, MAP_CHK_INNSHOKU_ID);
   
   //「和菓子屋」にチェックされているか判定
   keyName = KEY_MAP_SELECT_SETTING + "_" + TYPE_MAP_NARROW_WAGASHI;
   value = getLocalStrageValue(keyName, CHK_OFF);
   setCheckButtonMapNarrow(value, MAP_CHK_WAGASHI_ID);

   //「お土産」にチェックされているか判定
   keyName = KEY_MAP_SELECT_SETTING + "_" + TYPE_MAP_NARROW_OMIYAGE;
   value = getLocalStrageValue(keyName, CHK_OFF);
   setCheckButtonMapNarrow(value, MAP_CHK_OMIYAGE_ID);

   //「工芸品」にチェックされているか判定
   keyName = KEY_MAP_SELECT_SETTING + "_" + TYPE_MAP_NARROW_KOUGEI;
   value = getLocalStrageValue(keyName, CHK_OFF);
   setCheckButtonMapNarrow(value, MAP_CHK_KOUGEI_ID);
}
/**
* マップ表示条件を保存する
*/
function saveMapNarrowSetting()
{
   var keyName = KEY_MAP_SELECT_SETTING + "_" + TYPE_MAP_NARROW_ALL;
   
   //「全選択」の値を保存
   setLocalStrageValue(keyName, getMapNarrowSaveValue(MAP_CHK_ALLSELECT));
   // 「飲食店」の値を保存
   keyName = KEY_MAP_SELECT_SETTING + "_" + TYPE_MAP_NARROW_INSHOKU;
   setLocalStrageValue(keyName, getMapNarrowSaveValue(MAP_CHK_INNSHOKU_ID));
   // 「和菓子」の値を保存
   keyName = KEY_MAP_SELECT_SETTING + "_" + TYPE_MAP_NARROW_WAGASHI;
   setLocalStrageValue(keyName, getMapNarrowSaveValue(MAP_CHK_WAGASHI_ID));
   // 「お土産」の値を保存
   keyName = KEY_MAP_SELECT_SETTING + "_" + TYPE_MAP_NARROW_OMIYAGE;
   setLocalStrageValue(keyName, getMapNarrowSaveValue(MAP_CHK_OMIYAGE_ID));
   // 「工芸品」の値を保存
   keyName = KEY_MAP_SELECT_SETTING + "_" + TYPE_MAP_NARROW_KOUGEI;
   setLocalStrageValue(keyName, getMapNarrowSaveValue(MAP_CHK_KOUGEI_ID));
}
/**
* マップ位置情報を保存する
*/
function SaveMapPosSetting()
{
   //ローカルストレージに保存
   setLocalStrageValue(KEY_MAP_POS_SETTING, getMapPosSaveValue());
}
/**
* マップ位置情報を保存形式に変換する
*/
function getMapPosSaveValue()
{
   var value = TYPE_MAP_POS_KANAZAWA_TOWN;
   if(getCheckButton(MAP_RADIO_BTN_ID_STATION_POS))
   {
       value = TYPE_MAP_POS_KANAZAWA_STATION;
   }
   else if (getCheckButton(MAP_RADIO_BTN_ID_CURRENT_POS))
   {
       value = TYPE_MAP_POS_CURRENT;
   }
   return value;
}
/**
* マップ表示条件を保存形式に変換する
*/
function getMapNarrowSaveValue(elementName)
{
   var chkValue = CHK_ON;
   if(getCheckButton(elementName, true))
   {
       chkValue = CHK_ON;
   }
   else
   {
       chkValue = CHK_OFF;
   }
   return chkValue;
}
/**
* マップ位置情報をクリアする
*/
function clearMapPosSetting()
{
   setCheckButton(MAP_RADIO_BTN_ID_DEFAULT_POS, false);
   setCheckButton(MAP_RADIO_BTN_ID_STATION_POS, false);
   setCheckButton(MAP_RADIO_BTN_ID_CURRENT_POS, false);
}
/**
* マップ絞込設定をクリアする
*/
function clearMapNarrowSetting()
{
   setCheckButton(MAP_CHK_ALLSELECT, false);
   //全選択解除
   allcheckNarrowSetting();
}
/**
* マップ絞込設定を全選択・解除する
*/
function allcheckNarrowSetting()
{
   var chkSetting = getCheckButton(MAP_CHK_ALLSELECT, true);
  
   setCheckButton(MAP_CHK_INNSHOKU_ID, chkSetting);
   setCheckButton(MAP_CHK_WAGASHI_ID, chkSetting);
   setCheckButton(MAP_CHK_OMIYAGE_ID, chkSetting);
   setCheckButton(MAP_CHK_KOUGEI_ID, chkSetting);
   setCheckButton(MAP_CHK_OTHER_ID, chkSetting);
}
/**
* マップ絞込設定のすべての選択状態を設定する
*/
function setSelectAllMapNarrow()
{
   if(IsNeedNarrowAllChkSelect())
   {
      //ボタンをすべて選択状態にする
      setCheckButton(MAP_CHK_ALLSELECT, true);
      return;
   }
   //すべてチェック状態を外す
   setCheckButton(MAP_CHK_ALLSELECT, false);
}
/**
/* ローカルストレージをサポートしているか判定
*/
function isSupportedLocalStrage()
{
    if(('localStorage' in window) && (window.localStorage != null)) 
    {
        return true;
    }
    return false;
}
/**
* ローカルストレージから値を取得する。
*/
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
/**
* ローカルストレージに値を保存する。
*/
function setLocalStrageValue(keyname, value)
{
   if(isSupportedLocalStrage() == true)
   {
      localStorage.setItem(keyname, value);
   }
}
/**
* 「表示条件」のチェックボタンの状態をセットする
*
*  @param [int]     narrowValue 0:未チェック 1:チェック
*  @param [string]  elementName HTMLID名
*/
function setCheckButtonMapNarrow(narrowValue, elementName)
{
    var b_value = false;
    if(narrowValue == CHK_ON)
    {
       b_value = true;
    }
    setCheckButton(elementName, b_value);
}
/**
* チェックボタンの状態をセットする。
*
* @param [string] elementName HTMLID
* @param [bool]   value True:チェック済 False:未チェック
*/
function setCheckButton(elementName, value)
{
   var r_button = document.getElementById(elementName);
   if(r_button != null)
   {
      r_button.checked = value;
   }
}
/**
* チェックボタンの状態を取得する
*
* @param [string] HTMLID
* @param [bool] デフォルト値 true:チェック済 false:未チェック
* @retrun [bool] true:チェック済 false:未チェック
*/
function getCheckButton(elementName, defaultValue)
{
   var r_button = document.getElementById(elementName);
   if(r_button != null)
   {
      return r_button.checked;
   }
   return defaultValue;
}
/**
* Map表示条件「全選択」チェックが必要か判定
*/
function IsNeedNarrowAllChkSelect()
{
   if(getCheckButton(MAP_CHK_INNSHOKU_ID) &&
      getCheckButton(MAP_CHK_WAGASHI_ID) &&
      getCheckButton(MAP_CHK_OMIYAGE_ID) &&
      getCheckButton(MAP_CHK_KOUGEI_ID))
    {
        return true;
    }
    return false;
}
/**
* Map表示条件「すべて未選択」か判定
*/
function IsShowNeedNarrowWarningMessage()
{
   if(!getCheckButton(MAP_CHK_INNSHOKU_ID) &&
      !getCheckButton(MAP_CHK_WAGASHI_ID) &&
      !getCheckButton(MAP_CHK_OMIYAGE_ID) &&
      !getCheckButton(MAP_CHK_KOUGEI_ID))
    {
        return true;
    }
    return false;
}
/**
* Map表示条件「全選択」チェック処理
*/
function OnChkNarrowAllSelect()
{
   var chkSetting = getCheckButton(MAP_CHK_ALLSELECT, true);
   if(chkSetting)
   {
      setCheckButton(MAP_CHK_ALLSELECT, true);
      allcheckNarrowSetting();
   }
}
/**
* Map表示条件 各チェック実行処理
*/
function OnChkNarrowSelect()
{
   //全選択状態の場合、「すべて選択」にチェック
   setSelectAllMapNarrow();
}
/**
* Map表示条件 「設定ボタン」クリック処理
*/
function OnNarrowSettingButton()
{
   //すべてチェック外された場合、警告を表示する
   if(IsShowNeedNarrowWarningMessage())
   {
       alert("「表示条件」をどれか選択してください。");
       return false;
   }
   //全選択状態の場合、「すべて選択」にチェック
   setSelectAllMapNarrow();
   //ストレージに保存
   saveMapNarrowSetting();
   return true;
}
