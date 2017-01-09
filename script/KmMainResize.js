/*
 * KmMainResize.js
 *
 * All Rights Reserved, Copyright IT�������΂��� ���̂Â��蕔 2016 
 * 
 * ���C����ʂ̃��T�C�Y�������s���܂��B
 * 
 * 2016.10.10 m.asaoka Ver1.0-01 �V�K�쐬
 *
 */

/* �f�t�H���g�T�C�Y��` */
var DEFAULT_PC_WIDTH = 480;   //PC�����T�C�Y
var DEFAULT_ICON_HEIGHT = 50; //Icon���j���[�f�t�H���g����
var DEFAULT_ADJAST = 66;      
//------------------------------------
// Window Resize���̏���
//------------------------------------
$(window).resize(function(){
       setBodySizeForMain(); //���T�C�Y�������s
});
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
       var bodySpace = parseInt(browserWidth, 10) - parseInt(bodyWidth, 10);
       bodyLeftMargin = bodySpace > 0 ? (bodySpace / 2) + "px" : "0px";
    }
    //Body�T�C�Y�̒��� //�Z���^�����O���L��������Ȃ��̂ŁA����
    $("body").width(bodyWidth);
    $("body").css({"margin-left" : bodyLeftMargin });
        
}