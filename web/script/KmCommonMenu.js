/*
 * KmCommonMenu.js　 
 *
 * All Rights Reserved, Copyright ITざっくばらん会 ものづくり部 2016 
 * 
 * 2016.09.17 m.asaoka Ver1.0-01 新規作成
 *
 */
//---------------------------------------
// マップ用スライドメニュー表示
//---------------------------------------
function LoadMapMenu()
{
   $(function(){
		$(".menuformap dt").on("click", function() {
			$(this).prev().slideToggle(100);
		});
	}); 
}