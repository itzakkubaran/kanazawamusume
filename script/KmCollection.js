/*
 * KmCollections.js(図鑑生成処理) 
 *
 * All Rights Reserved, Copyright ITざっくばらん会 ものづくり部 2016 - 2017 
 * 
 * 2016.11.20 s.kaji 	Ver1.0-01 新規作成
 * 2016.11.27 m.asaoka	Ver1.0-02 図鑑生成機能を追加
 * 2016.12.27 s.kaji	Ver1.0-03 読み込んだCSVファイルから図鑑生成、表示
 * 2017.01.03 m.asaoka  Ver1.0-04 GoogleMapアプリへのナビゲーション機能追加
 */

/* CSVデータ読み込み処理 */
var CSV_FILE_NAME = "kanamusuShopLibrary.csv"; //ファイル名
var csvDataArray = []; 			       //取得したCSVのデータ一覧

/* ダイアログ生成用一覧 */
var DIALOG_SECTION_COLLECTIONNAME = 0;  //おすすめ商品名
var DIALOG_SECTION_PHOTONAME = 1;       //写真ファイル名
var DIALOG_SECTION_COLLECTIONTYPE = 2;  //商品の種類
var DIALOG_SECTION_STORENAME = 3;       //お店の名前
var DIALOG_SECTION_ADDRESS = 4;         //住所
var DIALOG_SECTION_LAT = 5;             //緯度(地図表示用）
var DIALOG_SECTION_LNG = 6;             //経度(地図表示用）
var DIALOG_SECTION_DETAIL = 7;          //紹介記事
var DIALOG_SECTION_NOTOPENDAY = 8;      //定休日
var DIALOG_SECTION_OPENTIME = 9;        //営業時間
var DIALOG_SECTION_RECOMENDER = 10;     //推薦人

/* マップデータのCSVファイルは以下の構成
/* [セクション0］一意の番号（紐づけ）
/* [セクション1］おすすめ商品名
/* [セクション2］写真ファイル名
/* [セクション3］商品の種類
/* [セクション4］お店の名前
/* [セクション5］住所
/* [セクション6］緯度
/* [セクション7］経度
/* [セクション8］紹介
/* [セクション9］定休日
/* [セクション10］営業時間
/* [セクション11］推薦人
*/
var CSV_SECTION_UNIQUEID = 0;         //UniqueID
var CSV_SECTION_COLLECTIONS = 1;      //おすすめ商品名
var CSV_SECTION_PHOTONAME = 2;        //写真ファイル名
var CSV_SECTION_COLLECTIONTYPE = 3;   //商品の種類
var CSV_SECTION_STORENAME = 4;        //お店の名前
var CSV_SECTION_ADDRESS = 5;          //住所
var CSV_SECTION_LAT = 6;              //緯度
var CSV_SECTION_LNG = 7;              //経度
var CSV_SECTION_DETAIL = 8;           //紹介
var CSV_SECTION_NOTOPENDAY = 9;       //定休日
var CSV_SECTION_OPENTIME = 10;        //営業時間
var CSV_SECTION_RECOMENDER = 11;      //推薦人

/*インターバル処理 */
var timerID;
var retryCount = 0;                       //リトライ回数
var DEFAULT_INTERVAL_TIME = 1000;         //インターバル時間(msec)
var DEFAULT_MAX_COUNT_FOR_CSV_LOAD = 10;  //最大読み込み回数（最大10秒）

/* マップ設定*/
var MAPZOOM = 18;		//マップズーム率

/**
* HTML読み込み終了時の処理
*/
$(document).ready(function(){
    OnStartUp();
});
/**
* 初期処理
*/
function OnStartUp()
{
   //初期化処理実行
   initializeCollections();
}
/**
* Collection表示初期化処理
*/
function initializeCollections()
{
    //CSVファイルから各お店の配置情報を取得
    getCSV(CSV_FILE_NAME);

    //1秒間隔でCSVファイルの取得を待ち合わせをして、表示
    timerID = setInterval("onloadCollections()", DEFAULT_INTERVAL_TIME);
}
/**
* Collection一覧データ読み込み処理
*/
function onloadCollections()
{
    //タイムアウトまたはCSVが取得できた場合
    if (retryCount > DEFAULT_MAX_COUNT_FOR_CSV_LOAD ||
        csvDataArray.length != 0) {
        //インターバル時間をクリア
        clearInterval(timerID);
        retryCount = 0;
        // 読み込んだCSVデータをもとにCollection設定
        setCollections();
        setSorting();
        return;
    }
    retryCount++;
}
/**
/* Google地図を表示する
/*
/* @param lat:緯度 lng:経度 mapAreaId:表示する領域のID
*/
function showGoogleMap(lat, lng, mapAreaId)
{
  var coordinate = new google.maps.LatLng(lat, lng);
  //マップを設定する
  var mapOptions = {
	zoom: MAPZOOM,  	//マップ表示拡大率
        center: coordinate,	//中心点
	mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  //マップを表示
  var map = new google.maps.Map(document.getElementById(mapAreaId), mapOptions);
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
* 「ここへ行く」ボタンクリック時処理
* 
* @param {int} lat 緯度
* @param {int} lng 経度
*/
var g_mapWin;// 現在のMarkerWindow
function onClickNavigateButton(lat, lng) {
    var url = "http://maps.google.com/maps?daddr="
    url += lat + "," + lng + "&saddr=現在地&dirflg=d";
    var features = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
    g_mapWin = window.open(url, "g_root", features);
}
/**
* コレクション一覧作成（least）
*/
function setCollections(){
    var collectionData = "";
    var groupName = "";
    for (var i = 1; i < csvDataArray.length - 1; i++) {
        groupName = "group" + csvDataArray[i][CSV_SECTION_COLLECTIONTYPE];
        collectionData += "<li data-groups='[\"" + groupName + "\"]'>";
        collectionData += "<a href='./media/" + csvDataArray[i][CSV_SECTION_PHOTONAME] +
            "' title='" + csvDataArray[i][CSV_SECTION_COLLECTIONS] + 
            "' data-subtitle='" + csvDataArray[i][CSV_SECTION_STORENAME] + 
            "' data-caption='<strong>" + csvDataArray[i][CSV_SECTION_COLLECTIONS] + "</strong>" + 
            "<br />" +
            "<br />" +
            "【お店の情報】" + 
            "<br />"+ "<strong>" + csvDataArray[i][CSV_SECTION_STORENAME] + "</strong>" +
            "<br />" + csvDataArray[i][CSV_SECTION_DETAIL] + 
            "<br />" +
            "【営業時間】" + 
            "<br />" + csvDataArray[i][CSV_SECTION_OPENTIME] + 
            "<br />" +
            "【定休日】" + 
            "<br />" + csvDataArray[i][CSV_SECTION_NOTOPENDAY] + 
            "<br />" +
            "【住所】" +
            "<br />" + csvDataArray[i][CSV_SECTION_ADDRESS] +
            "<br />" + "<div>" +
            "<input type=\"button\"" +
            "onclick=\"onClickNavigateButton(" + csvDataArray[i][CSV_SECTION_LAT] + "," + csvDataArray[i][CSV_SECTION_LNG] + ")\" value=\"<<ここに行く>>\">" + 
            "</div>" + 
            "'>";
        collectionData += "<img src='./media/" + csvDataArray[i][CSV_SECTION_PHOTONAME] + "' alt='Alt Image Text' />";
        collectionData += "</a>";
        collectionData += "</li>";
    }

    $('.least-gallery').append(collectionData);
    var options = {
        'random': true,
        'lazyload': true,
        'scrollToGallery': true,
        'HiDPI': false
    };
    $('.least-gallery').least(options);
    $('#grid li a img').css('border-radius','100px');
    $('.least-gallery li a').mouseenter(
        function(e) {
            $(this).children('img').css('border-radius','0px');
        }
    );
    $('.least-gallery li a').mouseleave(
        function(e) {
            $(this).children('img').css('border-radius','100px');
        }
    );
    $('.least-gallery li a').click(
        function(e) {
            e.preventDefault();
            $('html, body').animate({scrollTop: 0}, 500);
        }
    );
}  

/**
* 並び替えの設定（shuffle）
*/
function setSorting() {
    $('#grid').shuffle({
        group: 'all',
        speed: 300,
        easing: 'ease-in-out'
    });
    $('#sort li').on('click', function() {
        var $this = $(this),
        group = $this.data('group');

        $('#sort .active').removeClass('active');
        $this.addClass('active');
        
        if(group != 'all'){
            $('#grid').shuffle('shuffle', function($el, shuffle) {
                return group.indexOf($el.data('groups')) > -1
            });
        }else{
            $('#grid').shuffle( 'shuffle', 'all' );
        }
    });
}