/*
 * KmCSVLoader.js�@ 
 *
 * All Rights Reserved, Copyright IT�������΂��� Makers 2016 
 * 
 * 2016.08.28 m.asaoka Ver1.0-01 �V�K�쐬
 *
 */
var csvFileName = "fieldWorkData.csv"; //�t�@�C����
//
//---------------------------
// CSV�t�@�C����ǂݍ���
//---------------------------
function getCSV()
{
    // HTTP�Ńt�@�C����ǂݍ��ނ��߂�XMLHttpRrequest�I�u�W�F�N�g�𐶐�
    var req = new XMLHttpRequest();
    
�@�@// �A�N�Z�X����t�@�C�����w��
�@�@req.open("get", csvFileName, true);
    req.send(null); // HTTP���N�G�X�g�̔��s

    // ���X�|���X���Ԃ��Ă�����convertCSVtoArray()���Ă�	
    req.onload = function(){
	convertCSVtoArray(req.responseText); // �n�����͓̂ǂݍ���CSV�f�[�^
    }
}
//------------------------------------------
// �ǂݍ���CSV�f�[�^��񎟌��z��ɕϊ�����
//------------------------------------------
function convertCSVtoArray(str)
{ 
    // �ǂݍ���CSV�f�[�^��������Ƃ��ēn�����
    var result = []; // �ŏI�I�ȓ񎟌��z������邽�߂̔z��
    var tmp = str.split("\n"); // ���s����؂蕶���Ƃ��čs��v�f�Ƃ����z��𐶐�
 
    // �e�s���ƂɃJ���}�ŋ�؂����������v�f�Ƃ����񎟌��z��𐶐�
    for(var i=0;i<tmp.length;++i){
        result[i] = tmp[i].split(',');
    }
    return result;
}