/*
 * KmCSVLoader.js　 
 *
 * All Rights Reserved, Copyright ITざっくばらん会 Makers 2016 
 * 
 * 2016.08.28 m.asaoka Ver1.0-01 新規作成
 *
 */
var csvFileName = "fieldWorkData.csv"; //ファイル名
//
//---------------------------
// CSVファイルを読み込む
//---------------------------
function getCSV()
{
    // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    var req = new XMLHttpRequest();
    
　　// アクセスするファイルを指定
　　req.open("get", csvFileName, true);
    req.send(null); // HTTPリクエストの発行

    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ	
    req.onload = function(){
	convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
    }
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
    return result;
}