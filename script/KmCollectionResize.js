/*
 * KmCollectionResize.js
 *
 * All Rights Reserved, Copyright IT�������΂��� ���̂Â��蕔 2016 
 * 
 * �}�Ӊ�ʂ̃T�C�Y�����������s���܂��B
 * 
 * 2016.12.25 m.asaoka Ver1.0-01 �V�K�쐬
 *
 */
/* �f�t�H���g�T�C�Y��` */
var DEFAULT_TOP_HEIGHT = 50; //�g�b�v���j���[�̏c��

/* �ǂݍ��ݎ��T�C�Y */
var DEFAULT_FOOTER_HEIGHT_CLOSE = 52;   //Close����footer�̍���(px)
var DEFAULT_FOOTER_HEIGHT_OPEN = 178;   //Open����footer�̍���(px)

//------------------------------------
// Window Resize���̏���
//------------------------------------
$(window).resize(function(){
       //���݂̃��j���[�̍������擾
       var headerHeight = $('header').height();
       var menuHeight   = $('footer').height(); 
       setCollectionSize(menuHeight + headerHeight);
});
//------------------------------------
// toggleMenu�N���b�N���̏���
//------------------------------------
function onToggleMenuClick()
{
    //�N���b�N���̃��j���[�̍������擾
    var headerHeight = $('header').height();    
    var menuHeight = $('footer').height(); 
    //�N���b�N�O�̏�Ԃ��擾
    if(isToggleMenuShown(menuHeight) == true)
    {
        //Close��ԂŃ}�b�v�����T�C�Y
        setCollectionSize(headerHeight + DEFAULT_FOOTER_HEIGHT_CLOSE);
        return;
    }
    setCollectionSize(headerHeight + DEFAULT_FOOTER_HEIGHT_OPEN);
}
//------------------------------------
// ���T�C�Y���������{���܂��B
//------------------------------------
function ResizeforCollection()
{   
    //���݂̃��j���[�T�C�Y���擾
    var headerHeight = $('header').height();
    var menuHeight = $('footer').height(); 
    
    //Map�T�C�Y��ݒ�
    setCollectionSize(menuHeight + headerHeight);
    
    //�g�b�v���j���[�̃T�C�Y���Z�b�g
    setTopBarSize();
}
//------------------------------------
// �}�b�v�̃T�C�Y��ݒ肵�܂�
//------------------------------------
function setCollectionSize(menuHeight)
{
   //�}�b�v�̍Ē���  
   var hsize = $(window).height() - menuHeight;
   $("#collectionFields").css("height", hsize + "px");
   alert(hsize);
}
//------------------------------------
// Toggle���j���[���\����Ԃ��ǂ�������
//------------------------------------
function isToggleMenuShown(menuHeight)
{
   if(menuHeight > DEFAULT_FOOTER_HEIGHT_CLOSE)
   {
       return true;
   }
   return false;
}
//----------------------------------------------
// �}�b�v��ʂ̃g�b�v�o�[�̃��T�C�Y���s���܂��B
//----------------------------------------------
function setTopBarSize()
{				
    $("#iconTop").height(DEFAULT_TOP_HEIGHT);
    $("#iconTop").css({"line-height" : DEFAULT_TOP_HEIGHT + "px"});
}
