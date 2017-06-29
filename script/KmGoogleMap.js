﻿/*
 * KmGoogleMap.js(GoogleMap連携処理) 
 *
 * All Rights Reserved, Copyright ITざっくばらん会 ものづくり部 2016 
 * 
 * 2016.08.28 m.asaoka Ver1.0-01 新規作成
 * 2016.08.30 m.asaoka Ver1.0-02 デバイス情報取得処理追加
 * 2016.09.02 m.asaoka Ver1.0-03 デバイス情報取得処理統一化
 * 2016.09.03 m.asaoka Ver1.0-04 CSV読み込み処理追加
 * 2016.09.21 m.asaoka Ver1.0-05 マップ上にお店情報、タグ情報追加
 * 2016.10.01 m.asaoka Ver1.0-06 CSVファイルの非同期処理修正
 * 2016.10.08 m.asaoka Ver1.0-07 位置情報設定を反映
 * 2016.10.09 m.asaoka Ver1.0-08 ルート検索機能を追加
 * 2016.10.09 m.asaoka Ver1.0-08 ピンクリック時に開く情報ウィンドウを1個のみに修正
 * 2016.10.19 m.asaoka Ver1.0-09 マップ絞込機能を追加
 */

/* マップ表示デフォルト値 */
var DEFAULT_LAT = 36.56112;   //緯度(金沢学生のまち市民交流館)
var DEFAULT_LNG = 136.651998; //経度(金沢学生のまち市民交流館)

var STATION_LAT = 36.5780574;         //緯度(金沢駅)
var STATION_LNG = 136.64865959999997; //経度(金沢駅)

var DEFAULT_ZOOM = 16; //縮尺

var map;                        //googleMapオブジェクト
var currentInfoWindow = null;	//最後に開いた情報ウィンドウを記憶

/* ピン表示・非表示 */
var markersArray = new Array(); //マーカー一覧

var MARKER_WIN_HEIGHT = 65;     //MarkerWindowサイズ(高さ(%))
var MARKER_WIN_WIDTH = 50;      //MarkerWindowサイズ(幅(%))

var PIN_SIZE_WIDTH = 31;        //ピンのサイズ（幅）
var PIN_SIZE_HEIGHT = 40;       //ピンのサイズ（高さ）

var MARKER_KEY_KIND = 'KEY_KIND';             //マーカーの種別
var MARKER_KEY_OBJ = 'KEY_GMAP_MARKER_OBJ';   //マーカーのオブジェクト

/* デバイス情報取得結果 */
var DEVICE_SUCCESS = 0;         //デバイス取得成功
var PERMISSION_DENIED = 1;      //位置情報の利用が許可されていない
var POSITION_UNAVAILABLE = 2;   //デバイス情報取得エラー
var TIMEOUT = 3;                //タイムアウト

/* デバイス情報取得設定 */
var DEVICE_TIMEOUT = 6000; //タイムアウト値（6秒)
var DEVICE_ENABLE_HIGH_ACCURACY = true; //位置情報の精度(TRUE=高くする)
var DEVICE_MAXIMUM_AGE = 600000; //有効期限（10分）

/* CSVデータ読み込み処理 */
var CSV_FILE_NAME = "shopMapDataList.csv"; //ファイル名
var csvDataArray = []; //取得したCSVのデータ一覧

/* マップデータのCSVファイルは以下の構成
/* [セクション0］一意の番号（紐づけ）
/* [セクション1］施設名
/* [セクション2］住所
/* [セクション3］緯度
/* [セクション4］経度
/* [セクション5］取り扱い商品種別
/* [セクション6］お店のURL
/* [セクション7］お店の説明
/* [セクション8］定休日
/* [セクション9］かわいい商品（文字列）
*/
var CSV_SECTION_UNIQUEID = 0;     //UniqueID
var CSV_SECTION_STORENAME = 1;    //施設名
var CSV_SECTION_ADDRESS = 2;      //住所
var CSV_SECTION_LAT = 3;          //緯度
var CSV_SECTION_LNG = 4;          //経度
var CSV_SECTION_STORETYPE = 5;    //お店の種類
var CSV_SECTION_URL = 6;          //URL
var CSV_SECTION_DETAIL = 7;       //詳細説明
var CSV_SECTION_NOTOPENDAY = 8;   //定休日
var CSV_SECTION_OPENTIME = 9;     //営業時間
var CSV_SECTION_GOODS = 10;       //かわいい商品（文字列）

/* お店の種類 */
var STORE_KIND_RESTLANT = 1;   //飲食店
var STORE_KIND_WAGASHI = 2;    //和菓子屋
var STORE_KIND_GOODS = 3;      //おみやげ・グッズ
var STORE_KIND_KOUGEI = 4;     //工芸品
var STORE_KIND_OTHER = 5;      //その他

/* ピンのアイコンパス */
var STORE_ICON_RESTLANT = "./img/pin_innshoku.png";  //飲食店アイコン
var STORE_ICON_WAGATHI = "./img/pin_wagashi.png";    //和菓子アイコン
var STORE_ICON_GOODS   = "./img/pin_omiyage.png";    //おみやげアイコン
var STORE_ICON_KOUGEI   = "./img/pin_kougei.png";    //工芸品アイコン
var STORE_ICON_OTHER  = "./img/pin_omiyage.png";     //その他アイコン

/* ピンの表示チェックボックスID */
var STORE_KIND_CHK_INNSHOKU_ID = "chk_inshoku"; //飲食店（チェックボックス)
var STORE_KIND_CHK_WAGASHI_ID = "chk_wagashi";  //和菓子屋（チェックボックス）
var STORE_KIND_CHK_OMIYAGE_ID = "chk_omiyage";  //お土産（チェックボックス)
var STORE_KIND_CHK_KOUGEI_ID = "chk_kougei";    //工芸品（チェックボックス）
var STORE_KIND_CHK_OTHER_ID = "chk_omiyage";    //その他（チェックボックス）

/*インターバル処理 */
var timerID;
var retryCount = 0;                       //リトライ回数
var DEFAULT_INTERVAL_TIME = 1000;         //インターバル時間(msec)
var DEFAULT_MAX_COUNT_FOR_CSV_LOAD = 10;  //最大読み込み回数（最大10秒）

/* 現在位置 */
var current_lat = DEFAULT_LAT; //緯度
var current_lng = DEFAULT_LNG; //経度

/**
* 初期処理
*/
function OnStartUp() 
{
    //現在位置の取得を要求されている場合
    if (document.getElementById("radio_current_pos").checked) {
        //サポートしている場合のみ取得
        if (navigator.geolocation) {
            //ユーザーの位置情報を取得
            navigator.geolocation.getCurrentPosition(successCallback,
                errorCallback, { enableHighAccuracy: true, timeout: 10000, maximumAge: 6000 });
        } else {
            //位置情報の取得を未サポートなので初期値で表示する
            initializeMaps();
        }
    } else {
        //金沢駅に設定されている場合、金沢駅の座標にセット
        if (document.getElementById("radio_station_pos").checked) {
            setCurrentLatLng(STATION_LAT, STATION_LNG);
        } else {
            setCurrentLatLng(DEFAULT_LAT, DEFAULT_LNG);
        }
        //マップの初期呼び出しを実施
        initializeMaps();
    }
}
/**
* マップ再読み込み処理
*/
function ReloadMaps() 
{
    //現在位置の取得を要求されている場合
    if (document.getElementById("radio_current_pos").checked) {
        //サポートしている場合のみ取得
        if (navigator.geolocation) {
            //ユーザーの位置情報を取得(再読み込み）
            navigator.geolocation.getCurrentPosition(successCallback, 
                                                     errorCallback, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
        } else {
            //位置情報の取得を未サポートなので初期値で表示する
            initializeMaps();
        }
    } else {
        //金沢駅に設定されている場合、金沢駅の座標にセット
        if (document.getElementById("radio_station_pos").checked) {
            setCurrentLatLng(STATION_LAT, STATION_LNG);
        } else {
            setCurrentLatLng(DEFAULT_LAT, DEFAULT_LNG);
        }
        //マップの中央位置を移動
        setMapCenterLatLng();
    }
}
/**
* Map表示初期化処理
*/
function initializeMaps()
{
    //CSVファイルから各お店の配置情報を取得
    getCSV(CSV_FILE_NAME);

    //1秒間隔でCSVファイルの取得を待ち合わせをして、表示
    timerID = setInterval("onloadMaps()", DEFAULT_INTERVAL_TIME);
}
/**
* マップ読み込み処理
*/
function onloadMaps()
{
    //タイムアウトまたはCSVが取得できた場合
    if (retryCount > DEFAULT_MAX_COUNT_FOR_CSV_LOAD ||
        csvDataArray.length != 0) {
        //インターバル時間をクリア
        clearInterval(timerID);
        retryCount = 0;
        //googleMapの読み込みを開始
        showGoogleMaps(current_lat, current_lng);
        return;
    }
    retryCount++;
}
/**
* GoogleMap表示処理
*
* @param {int} x 緯度
* @param {int} y 経度
*/
function showGoogleMaps(x, y) 
{
    var mapdiv = document.getElementById("map-canvas");
    var latlng = new google.maps.LatLng(x, y); //中心部の座標をセット

    var opts = {
        zoom: DEFAULT_ZOOM,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    //マップ情報を設定
    map = new google.maps.Map(mapdiv, opts);

    //マーカーを地図上に配置
    SetMarkerFromCSVData(csvDataArray, map);
}
/**
* マーカーを地図上に配置する
*
* @param {array}     markers マーカー一覧
* @param {googleMap} mapObj  googleMapオブジェクト
*
*/
function SetMarkerFromCSVData(markers, mapObj) 
{
    //マーカーのサイズを取得
    var m_height = getMarkerWindowHeight();
    var m_width = getMarkerWindowWidth();

    //markers.length の配列要素分、繰り返し処理
    for (var i = 1; i < markers.length; i++) {
        var storeData = "<div style='maxWidth:" + m_width + "px;" + "maxHeight:" + m_height + "px;padding:0px;margin:0px;'>";
        storeData += "<input type='button' onClick='onClickMarkerButton(" + markers[i][CSV_SECTION_LAT] + "," + markers[i][CSV_SECTION_LNG] + ");' value='ここに行く'>";
        storeData += "<br />";
        storeData += "<dl>";
        storeData += "<dt>" + "【お店の名前】"+ "</dt>";
        storeData += "<dd>" + markers[i][CSV_SECTION_STORENAME] + "</dd>"; //施設名
        storeData += "<dt>" + "【住所】" + "</dt>";
        storeData += "<dd>" + markers[i][CSV_SECTION_ADDRESS] + "</dd>"; //施設住所
        storeData += "<dt>" + "【URL】" + "</dt>";
        storeData += "<dd>" + "<a href='" + markers[i][CSV_SECTION_URL] + "'" + " target='_blank'>"; //URLリンク
        storeData += markers[i][CSV_SECTION_URL] + "</a>" + "</dd>";
        storeData += "<dt>" + "【お店の紹介】" + "</dt>";
        storeData += "<dd>" + markers[i][CSV_SECTION_DETAIL] + "</dd>"; //お店の説明
        storeData += "<dt>" + "【定休日】 " + "</dt>";
        storeData += "<dd>" + markers[i][CSV_SECTION_NOTOPENDAY] + "</dd>"; //定休日
        storeData += "<dt>" + "【営業時間】" + "</dt>";
        storeData += "<dd>" + markers[i][CSV_SECTION_OPENTIME] + "</dd>"; //営業時間
        storeData += "<dt>" + "【おすすめ商品】" + "<dt>";
        storeData += "<dd>" + markers[i][CSV_SECTION_GOODS] + "</dd>"; //取り扱い商品 
        storeData += "</div>";

        //緯度、経度を設定
        var latlng = new google.maps.LatLng(markers[i][CSV_SECTION_LAT], markers[i][CSV_SECTION_LNG]);
        
        var i_skind = parseInt(markers[i][CSV_SECTION_STORETYPE]);
        
        //ピンのイメージパスを取得
        var pinImagePath = getMarkerImage(i_skind);

        //マーカーを作成
        CreateMarker(i, i_skind, storeData, latlng, pinImagePath, mapObj);
    }
}
/**
*
* マーカーを作成する
*
* @param {int} markerNo         マーカー一覧の番号
* @param {int} kind             お店の種別
* @param {string} storeData     表示するHTMLのデータ
* @latlng {googleMapLatLng}     座標（緯度、経度）
* @pinImage {string}            ピンのイメージURL
* @mapObj   {googleMap}         マップオブジェクト
*/
function CreateMarker(markerNo, kind, storeData, latlng, pinImage, mapObj) 
{
    var infoWindow = new google.maps.InfoWindow();
    var pinImageObj = createMarkerImage(pinImage);
    var marker = new google.maps.Marker({ position: latlng, map: mapObj, icon: pinImageObj});

    //地図上のmarkarがクリックされると詳細情報を表示するイベント登録
    google.maps.event.addListener(marker, 'click', function() {
        //先に開いたWindowがあれば閉じる
        if(currentInfoWindow)
        {
           currentInfoWindow.close();
        }
        //インフォメーションウィンドウの名前をセット
        infoWindow.setContent(storeData);
        infoWindow.open(mapObj, marker);
        currentInfoWindow = infoWindow;
    });
    //マーカーの表示非表示をセット
    marker.setVisible(IsNeedMarkerVisible(kind));

    //表示上のデータとしてキーと値をセット
    setMarker(markerNo, kind, marker);
}
/**
* マップを中央位置を設定
*/
function setMapCenterLatLng() 
{
    var latlng = new google.maps.LatLng(current_lat, current_lng);
    map.setCenter(latlng);
}
/**
* ユーザー位置情報取得成功処理
* @param position 位置情報（緯度、経度）
*/
function successCallback(position) 
{
    //緯度、経度をセット
    setCurrentLatLng(position.coords.latitude, position.coords.longitude);

    //マップを初期化
    initializeMaps();
}
/**
* ユーザー位置情報取得成功処理（再読み込み）
*/
function successCallbackForReload() 
{
    //緯度、経度をセット
    setCurrentLatLng(position.coords.latitude, position.coords.longitude);

    //マップの中央位置を移動
    setMapCenterLatLng();
}
/**
* ユーザー位置情報取得失敗処理
*/
function errorCallback(error) {
    var err_msg = "";
    switch (error.code) {
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
            err_msg = "位置情報の取得に失敗しました"
            break;
    }
    alert(err_msg);

    setCurrentLatLng(DEFAULT_LAT, DEFAULT_LNG);

    //マップを表示
    initializeMaps();
}
/**
* ユーザー位置情報取得失敗処理（再読み込み）
*/
function errorCallbackForReload(error) {
    var err_msg = "";
    switch (error.code) {
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
            err_msg = "位置情報の取得に失敗しました"
            break;
    }
    alert(err_msg);
}
/**
* CSVファイル取得処理
*
* @param {string} csvfileName CSVファイル名
*/
function getCSV(csvfileName) {
    // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    var req = new XMLHttpRequest();
    var csvUrl = "./data/" + csvfileName;
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
        }
    }
    req.open("GET", csvUrl, true);
    req.send(null); // HTTPリクエストの発行
}
/**
* 読み込んだCSVデータを二次元配列に変換する
*
* @param {string} str 文字列
*/
function convertCSVtoArray(str) {
    // 読み込んだCSVデータが文字列として渡される
    var result = []; // 最終的な二次元配列を入れるための配列
    var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成 
    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for (var i = 0; i < tmp.length; ++i) {
        result[i] = tmp[i].split(',');
    }
    csvDataArray = result;
}
/**
* マーカーの表示の必要があるか判定します。
* 
* @param {int} markerKind マーカー種別
*/
function IsNeedMarkerVisible(markerKind){
  
  var chkId = null;
  switch(markerKind)
  {
     case STORE_KIND_RESTLANT: //飲食店
       chkId = STORE_KIND_CHK_INNSHOKU_ID;
       break;
     case STORE_KIND_WAGASHI:  //和菓子屋
       chkId = STORE_KIND_CHK_WAGASHI_ID;
       break;
     case STORE_KIND_GOODS:    //おみやげ
       chkId = STORE_KIND_CHK_OMIYAGE_ID;
       break;
     case STORE_KIND_KOUGEI:  //工芸品
       chkId = STORE_KIND_CHK_KOUGEI_ID;
       break;
     case STORE_ICON_OTHER:  //その他、デフォルト
     default:
       chkId = STORE_KIND_CHK_OTHER_ID;
       break;
  }
  return getCheckBoxStatus(chkId);
}
/**
* チェックボックスのステータスを取得します。
* @param {int} id HTMLID
*/
function getCheckBoxStatus(id){
   return document.getElementById(id).checked;
}
/**
* マーカー情報を設定します。
*
* @param {int}  markerNo マーカー番号
* @param {kind} kind  マーカー種別
* @param {googleMapMarker} g_MarkerObj googleMapMarkerオブジェクト
*/
function setMarker(markerNo, kind, g_MarkerObj){
   var markerDisp = new Object();
   
   //表示上のキーと値をセット
   markerDisp[MARKER_KEY_KIND] = kind;
   markerDisp[MARKER_KEY_OBJ] = g_MarkerObj;
   
   //ArrayListに追加
   markersArray[markerNo] = markerDisp;
}
/**
*
* マーカー情報を取得します。
*
* @param {int} markerNo マーカー番号
*/
function getMarker(markerNo) {
   if(markersArray == null || markersArray.length == 0) 
   { 
     return null; 
   }
   return markersArray[markerNo];
}
/**
* マップ上にマーカーを表示させます。
*/
function showMarkerOnMap() {
    for (var i = 0; i < markersArray.length; i++) {
        var markerObj = getMarker(i);
        if(markerObj != null) 
        {
            //表示するべきマーカーなのかチェック
            var markerVisible = IsNeedMarkerVisible(markerObj[MARKER_KEY_KIND]);
            var g_markerObj = markerObj[MARKER_KEY_OBJ];
            if(g_markerObj != null) { g_markerObj.setVisible(markerVisible); }
        }
    }
}
/**
*
* 現在位置の緯度、経度を設定します。
*
* @param  {int} lat 緯度
* @param  {int} lng 経度
*/
function setCurrentLatLng(lat, lng) {
    current_lat = lat;
    current_lng = lng;
}
/**
* MarkerWindowのボタンクリック時処理
* 
* @param {int} lat 緯度
* @param {int} lng 経度
*/
var g_mapWin;// 現在のMarkerWindow
function onClickMarkerButton(lat, lng) {
    var url = "http://maps.google.com/maps?daddr="
    url += lat + "," + lng + "&saddr=現在地&dirflg=d";
    var features = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
    g_mapWin = window.open(url, "g_root", features);
}
/**
* MarkerWindowの高さを算出する
*/
function getMarkerWindowHeight(){
    //マップのサイズを取得
    var mapHeight = $("#map-canvas").height();
    
    var windowHeight = mapHeight * (MARKER_WIN_HEIGHT / 100);
    return windowHeight;
}
/**
* MarkerWindowの幅を算出する
*/
function getMarkerWindowWidth(){
    //マップのサイズを取得
    var mapWidth = $("#map-canvas").width();
    
    var windowWidth = mapWidth * (MARKER_WIN_WIDTH / 100);
    return windowWidth;
}
/**
*
* マーカーのイメージをマップ上に作成
*
* @param {string} pinImagePath イメージファイルUrl
*/
function createMarkerImage(pinImagePath){
  return new google.maps.MarkerImage(
    pinImagePath,                // url
    new google.maps.Size(PIN_SIZE_WIDTH, PIN_SIZE_HEIGHT)  // size
  );
}
/**
*
* マーカーのイメージを取得します
* @param {int} storeKind イメージの種類
*/
function getMarkerImage(storeKind){
     var filePath = null;
     switch(storeKind)
     {
        //飲食店
        case STORE_KIND_RESTLANT:
          filePath = STORE_ICON_RESTLANT;
          break;
        //和菓子
        case STORE_KIND_WAGASHI:
          filePath = STORE_ICON_WAGATHI;
          break;
        //おみあげ
        case STORE_KIND_GOODS:
          filePath = STORE_ICON_GOODS;
          break;
        //工芸品
        case STORE_KIND_KOUGEI:
          filePath = STORE_ICON_KOUGEI;
          break;
        //デフォルト値
        case STORE_KIND_OTHER:
        default:
          filePath = STORE_ICON_OTHER;
          break;
     }
     return filePath;
}