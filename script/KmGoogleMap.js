/*
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
 */

/* マップ表示デフォルト値 */
var DEFAULT_LAT = 36.5780574; 		//緯度(金沢駅)
var DEFAULT_LNG = 136.64865959999997;	//経度(金沢駅）
var DEFAULT_ZOOM = 16;			//縮尺

var SMARTPHONE_STYLE_WIDTH  = '100%';    //スマホ用マップ表示スタイル（横）
var SMARTPHONE_STYLE_HEIGHT = '480px';   //スマホ用マップ表示スタイル（縦）

var DEFAULT_STYLE_WIDTH  = '100%';      //マップ表示スタイル（横）
var DEFAULT_STYLE_HEIGHT = '480px';     //マップ表示スタイル（縦）

/* デバイス情報取得結果 */
var DEVICE_SUCCESS = 0;                 //デバイス取得成功
var PERMISSION_DENIED = 1;              //位置情報の利用が許可されていない
var POSITION_UNAVAILABLE = 2;           //デバイス情報取得エラー
var TIMEOUT = 3;		        //タイムアウト

/* デバイス情報取得設定 */
var DEVICE_TIMEOUT = 6000;             　　　//タイムアウト値（6秒)
var DEVICE_ENABLE_HIGH_ACCURACY = true;      //位置情報の精度(TRUE=高くする)
var DEVICE_MAXIMUM_AGE = 600000;             //有効期限（10分）

/* CSVデータ読み込み処理 */
var CSV_FILE_NAME = "shopMapDataList.csv"; 　//ファイル名
var csvDataArray = [];                       //取得したCSVのデータ一覧

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
var CSV_SECTION_UNIQUEID = 0;                //UniqueID
var CSV_SECTION_STORENAME = 1;               //施設名
var CSV_SECTION_ADDRESS = 2;		     //住所
var CSV_SECTION_LAT = 3;		     //緯度
var CSV_SECTION_LNG = 4;                     //経度
var CSV_SECTION_STORETYPE = 5;               //お店の種類
var CSV_SECTION_URL = 6;                  　 //URL
var CSV_SECTION_DETAIL = 7;                  //詳細説明
var CSV_SECTION_NOTOPENDAY = 8;              //定休日
var CSV_SECTION_OPENTIME = 9;                //営業時間
var CSV_SECTION_GOODS = 10;                  //かわいい商品（文字列）

/* お店の種類 */
var STORE_KIND_RESTLANT = 1;                 //飲食店
var STORE_KIND_WAGASHI = 2;                  //和菓子屋
var STORE_KIND_GOODS = 3;                    //おみあげ・グッズ
var STORE_KIND_OTHER = 4;　　　              //その他

/* インターバル処理 */
var timerID;
var retryCount = 0;                          //リトライ回数
var DEFAULT_INTERVAL_TIME = 1000;            //インターバル時間(msec)
var DEFAULT_MAX_COUNT_FOR_CSV_LOAD = 10;     //最大読み込み回数（最大10秒）

/* 現在位置 */
var current_lat = DEFAULT_LAT;  //緯度
var current_lng = DEFAULT_LNG;  //経度

//---------------------------
// 初期処理
//---------------------------
function OnStartUp()
{
   //サポートしている場合のみ取得
　 if(navigator.geolocation)
   {
      //ユーザーの位置情報を取得
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
   }
   else
   {
      //許可されていないので、デフォルト値（金沢駅近辺）を中心にマップを表示
　　　initializeMaps();
   }     
}
//---------------------------
// Map表示初期化処理
//---------------------------
function initializeMaps()
{  
　　//CSVファイルから各お店の配置情報を取得
 　 getCSV(CSV_FILE_NAME);
    
    //1秒間隔でCSVファイルの取得を待ち合わせをして、表示
  　timerID = setInterval("onloadMaps()", DEFAULT_INTERVAL_TIME);
}
//------------------------------------------
// マップ読み込み処理
//------------------------------------------
function onloadMaps()
{
　 //タイムアウトまたはCSVが取得できた場合
   if(retryCount > DEFAULT_MAX_COUNT_FOR_CSV_LOAD ||
      csvDataArray.length !=0)
   {
    　//インターバル時間をクリア
      clearInterval(timerID);
      retryCount = 0;
　　  //googleMapの読み込みを開始
　　　showGoogleMaps(current_lat, current_lng);
      return;
   }
   retryCount++;
}
//------------------------------------------
// GoogleMap表示処理
//------------------------------------------
function showGoogleMaps(x, y)
{
   var mapdiv = document.getElementById("map-canvas");
   var latlng = new google.maps.LatLng(x,y); //中心部の座標をセット
   
   //表示するマップのスタイルを設定
   mapdiv = SetMapDivStyle(mapdiv);
   
   var opts = {
     zoom: DEFAULT_ZOOM,
     center: latlng,
     mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  //マップ情報を設定
  var map = new google.maps.Map(mapdiv, opts);
  
  //マーカーを地図上に配置
　SetMarkerFromCSVData(csvDataArray, map);

}
//------------------------------------------
// マーカーを地図上に配置する
//------------------------------------------
function SetMarkerFromCSVData(markers, mapObj)
{	
   //markers.length の配列要素分、繰り返し処理
   for (var i = 1; i < markers.length; i++) 
   {
      var storeData = "<div>"
      storeData += "<li>" + "【お店の名前】" + markers[i][CSV_SECTION_STORENAME] + "</li>"; //施設名
      storeData += "<li>" + "【住所】" + markers[i][CSV_SECTION_ADDRESS] + "</li>";         //施設住所
　　　storeData += "<li>" + "【URL】" + "<a href='" +  markers[i][CSV_SECTION_URL] + "'" + " target='_blank'>";  //URLリンク
      storeData += markers[i][CSV_SECTION_URL] + "</a>";
　　　storeData += "<li>" + "【お店の紹介】" + markers[i][CSV_SECTION_DETAIL] + "</li>";    //お店の説明
　　　storeData += "<li>" + "【定休日】 " + markers[i][CSV_SECTION_NOTOPENDAY] + "</li>";   //定休日
      storeData += "<li>" + "【営業時間】" + markers[i][CSV_SECTION_OPENTIME] + "</li>";    //営業時間
      storeData += "<li>" + "【おすすめ商品】" + markers[i][CSV_SECTION_GOODS] + "</li>";   //取り扱い商品 
      storeData += "</div>";
      //緯度、経度を設定
      var latlng = new google.maps.LatLng(markers[i][CSV_SECTION_LAT],markers[i][CSV_SECTION_LNG]);
      //マーカーを作成
　　　CreateMarker(storeData, latlng, mapObj);
   }
} 
//------------------------------------------
// マーカーを作成する
//------------------------------------------
function CreateMarker(storeData, latlng, mapObj)
{
   var infoWindow = new google.maps.InfoWindow();
   var marker = new google.maps.Marker({position: latlng, map: mapObj});
   
   //地図上のmarkarがクリックされると詳細情報を表示するイベント登録
　 google.maps.event.addListener(marker, 'click', function()  {
      //インフォメーションウィンドウの名前をセット
      infoWindow.setContent(storeData);
　　　infoWindow.open(mapObj,marker);
   });
} 
//------------------------------------------
// GoogleMapの表示スタイルをセットする
//------------------------------------------
function SetMapDivStyle(mapdiv)
{
   if(mapdiv !=null)
   {      
      mapdiv.style.width = DEFAULT_STYLE_WIDTH;
      mapdiv.style.height = DEFAULT_STYLE_HEIGHT;
      //スマートフォンアクセスかどうか判定  
      if(isSmartPhoneAccess() == true)
      {  
　　　　 mapdiv.style.width = SMARTPHONE_STYLE_WIDTH;
         mapdiv.style.height = SMARTPHONE_STYLE_HEIGHT;
      }　
   }
   return mapdiv;
}
//------------------------------------
// ユーザー位置情報取得成功処理
//------------------------------------
function successCallback(position)
{
   //緯度をセット
   current_lat = position.coords.latitude;
   //経度をセット
　 current_lng = position.coords.longitude;
   
   //マップを初期化
　 initializeMaps();
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
  initializeMaps(); 
}
//---------------------------------------
// スマートフォンアクセスかどうか判定する
//---------------------------------------
function isSmartPhoneAccess()
{
   var useragent = navigator.userAgent;
   //iPhoneもしくはAndroidからのアクセスの場合
   if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1)
   {
       return true;
   }
   return false;
}
//---------------------------
// CSVファイルを読み込む
//---------------------------
function getCSV(csvfileName)
{
　　// HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    var req = new XMLHttpRequest();
    var csvUrl = "./data/" + csvfileName;
    req.onreadystatechange = function(){
       if (req.readyState == 4 && req.status == 200) {
           convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
       }
    };
    req.open("GET", csvUrl, true);
    req.send(null); // HTTPリクエストの発行
}
//------------------------------------------
// 読み込んだCSVデータを二次元配列に変換する
//------------------------------------------
function convertCSVtoArray(str)
{ 
    // 読み込んだCSVデータが文字列として渡される
    var result = []; // 最終的な二次元配列を入れるための配列
    var tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成 
    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for(var i=0;i<tmp.length;++i){
        result[i] = tmp[i].split(',');
    }
    csvDataArray = result;
}
