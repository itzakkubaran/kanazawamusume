/*
 * KmCommonLoad.js
 *
 * All Rights Reserved, Copyright IT�������΂��� ���̂Â��蕔 2016 
 * 
 * ��ʂ̓ǂݍ��ݏ������s���܂��B
 * 
 * 2016.10.02 m.asaoka Ver1.0-01 �V�K�쐬
 *
 */

/* �f�t�H���g�T�C�Y��` */
var DEFAULT_PC_WIDTH = 480;   //PC�����T�C�Y
var DEFAULT_ICON_HEIGHT = 30; //Icon���j���[�f�t�H���g����
var DEFAULT_ADJAST = 66;      

//------------------------------------
// Body�T�C�Y��ݒ肵�܂�
//------------------------------------
function setBodySizeForMain()
{
    //�u���E�U�̏c�������擾
    var browserWidth = window.innerWidth;
    var browserHeight = window.innerHeight;

    var bodyWidth = browserWidth + "px";
    var bodyHeight = browserHeight + "px";
    var bodyWidthMath = browserHeight;
    var bodyHeightMath = browserHeight;
    var bodyLeftMargin = "0px";

    //480px�𒴂���ꍇ
    if(browserWidth >= 480)
    {
       bodyWidth = DEFAULT_PC_WIDTH + "px";
       bodyWidthMath = DEFAULT_PC_WIDTH;
       var bodyWhite = parseInt(browserWidth, 10) - parseInt(bodyWidth, 10);
       bodyLeftMargin = bodyWhite > 0 ? (bodyWhite / 2) + "px" : "0px";
    }
    //Body�T�C�Y�̒���
    $("body").width(bodyWidth);
    $("body").css({"margin-left" : bodyLeftMargin });
     
    //Icon���j���[�{�^���̒���
    $("#iconTop").width(bodyWidth);
    $("#iconTop").css({"left" : bodyLeftMargin });
    $("#iconTop").height(DEFAULT_ICON_HEIGHT);
    $("#iconTop").css({"line-height" : DEFAULT_ICON_HEIGHT + "px"});
}