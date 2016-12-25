/*
 * KmCollections.js(�}�Ӑ�������) 
 *
 * All Rights Reserved, Copyright IT�������΂��� ���̂Â��蕔 2016 
 * 
 * 2016.11.20 s.kaji 	Ver1.0-01 �V�K�쐬
 * 2016.11.27 m.asaoka	Ver1.0-02 �}�Ӑ����@�\��ǉ�
 */

/* CSV�f�[�^�ǂݍ��ݏ��� */
var CSV_FILE_NAME = "kanamusuShopLibrary.csv"; //�t�@�C����
var csvDataArray = []; 			       //�擾����CSV�̃f�[�^�ꗗ

/* �_�C�A���O�����p�ꗗ */
var DIALOG_SECTION_COLLECTIONNAME = 0;  //�������ߏ��i��
var DIALOG_SECTION_PHOTONAME = 1;       //�ʐ^�t�@�C����
var DIALOG_SECTION_COLLECTIONTYPE = 2;  //���i�̎��
var DIALOG_SECTION_STORENAME = 3;       //���X�̖��O
var DIALOG_SECTION_ADDRESS = 4;         //�Z��
var DIALOG_SECTION_LAT = 5;             //�ܓx(�n�}�\���p�j
var DIALOG_SECTION_LNG = 6;             //�o�x(�n�}�\���p�j
var DIALOG_SECTION_DETAIL = 7;          //�Љ�L��
var DIALOG_SECTION_NOTOPENDAY = 8;      //��x��
var DIALOG_SECTION_OPENTIME = 9;        //�c�Ǝ���
var DIALOG_SECTION_RECOMENDER = 10;      //���E�l

/* �}�b�v�f�[�^��CSV�t�@�C���͈ȉ��̍\��
/* [�Z�N�V����0�n��ӂ̔ԍ��i�R�Â��j
/* [�Z�N�V����1�n�������ߏ��i��
/* [�Z�N�V����2�n�ʐ^�t�@�C����
/* [�Z�N�V����3�n���i�̎��
/* [�Z�N�V����4�n���X�̖��O
/* [�Z�N�V����5�n�Z��
/* [�Z�N�V����6�n�ܓx
/* [�Z�N�V����7�n�o�x
/* [�Z�N�V����8�n�Љ�
/* [�Z�N�V����9�n��x��
/* [�Z�N�V����10�n�c�Ǝ���
/* [�Z�N�V����11�n���E�l
*/
var CSV_SECTION_UNIQUEID = 0;         //UniqueID
var CSV_SECTION_COLLECTIONS = 1;      //�������ߏ��i��
var CSV_SECTION_PHOTONAME = 2;        //�ʐ^�t�@�C����
var CSV_SECTION_COLLECTIONTYPE = 3;   //���i�̎��
var CSV_SECTION_STORENAME = 4;        //���X�̖��O
var CSV_SECTION_ADDRESS = 5;          //�Z��
var CSV_SECTION_LAT = 6;              //�ܓx
var CSV_SECTION_LNG = 7;              //�o�x
var CSV_SECTION_DETAIL = 8;           //�Љ�
var CSV_SECTION_NOTOPENDAY = 9;       //��x��
var CSV_SECTION_OPENTIME = 10;         //�c�Ǝ���
var CSV_SECTION_RECOMENDER = 11;      //���E�l

/*�C���^�[�o������ */
var timerID;
var retryCount = 0;                       //���g���C��
var DEFAULT_INTERVAL_TIME = 1000;         //�C���^�[�o������(msec)
var DEFAULT_MAX_COUNT_FOR_CSV_LOAD = 10;  //�ő�ǂݍ��݉񐔁i�ő�10�b�j

/* �}�b�v�ݒ�*/
var MAPZOOM = 18;		//�}�b�v�Y�[����

/**
* ��ʃ��[�h���̏���
*/
$(document).ready(function(){
       OnStartUp();
});
/**
* ��������
*/
function OnStartUp()
{
   //�������������s
   initializeCollections();
   //Least�Z�b�g�A�b�v
   jQuery('#gallery').least({
	'random': true,
	'lazyload': false,
	'scrollToGallery': false
	});

}
/**
* Collection�\������������
*/
function initializeCollections()
{
    //CSV�t�@�C������e���X�̔z�u�����擾
    getCSV(CSV_FILE_NAME);

    //1�b�Ԋu��CSV�t�@�C���̎擾��҂����킹�����āA�\��
    timerID = setInterval("onloadCollections()", DEFAULT_INTERVAL_TIME);
}
/**
* Collection�ꗗ�f�[�^�ǂݍ��ݏ���
*/
function onloadCollections()
{
    //�^�C���A�E�g�܂���CSV���擾�ł����ꍇ
    if (retryCount > DEFAULT_MAX_COUNT_FOR_CSV_LOAD ||
        csvDataArray.length != 0) {
        //�C���^�[�o�����Ԃ��N���A
        clearInterval(timerID);
        retryCount = 0;
        // �ǂݍ���CSV�f�[�^�����Ƃ�Collection�ݒ�
        setCollections();
        setSorting();
        return;
    }
    retryCount++;
}
/**
/* Google�n�}��\������
/*
/* @param lat:�ܓx lng:�o�x mapAreaId:�\������̈��ID
*/
function showGoogleMap(lat, lng, mapAreaId)
{
  var coordinate = new google.maps.LatLng(lat, lng);
  //�}�b�v��ݒ肷��
  var mapOptions = {
	zoom: MAPZOOM,  	//�}�b�v�\���g�嗦
        center: coordinate,	//���S�_
	mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  //�}�b�v��\��
  var map = new google.maps.Map(document.getElementById(mapAreaId), mapOptions);
  //ToDo:�ʒu�ɒ��S�ʒu�Ƀs���𗧂Ă遚
  
}
/**
* CSV�t�@�C���擾����
*
* @param {string} csvfileName CSV�t�@�C����
*/
function getCSV(csvfileName) {
    // HTTP�Ńt�@�C����ǂݍ��ނ��߂�XMLHttpRrequest�I�u�W�F�N�g�𐶐�
    var req = new XMLHttpRequest();
    var csvUrl = "./data/" + csvfileName;
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            convertCSVtoArray(req.responseText); // �n�����͓̂ǂݍ���CSV�f�[�^
        }
    }
    req.open("GET", csvUrl, true);
    req.send(null); // HTTP���N�G�X�g�̔��s
}
/**
* �ǂݍ���CSV�f�[�^��񎟌��z��ɕϊ�����
*
* @param {string} str ������
*/
function convertCSVtoArray(str) {
    // �ǂݍ���CSV�f�[�^��������Ƃ��ēn�����
    var result = []; // �ŏI�I�ȓ񎟌��z������邽�߂̔z��
    var tmp = str.split("\n"); // ���s����؂蕶���Ƃ��čs��v�f�Ƃ����z��𐶐� 
    // �e�s���ƂɃJ���}�ŋ�؂����������v�f�Ƃ����񎟌��z��𐶐�
    for (var i = 0; i < tmp.length; ++i) {
        result[i] = tmp[i].split(',');
    }
    csvDataArray = result;
}
/**
* �u�����֍s���v�{�^���N���b�N������
* 
* @param {int} lat �ܓx
* @param {int} lng �o�x
*/
var g_mapWin;// ���݂�MarkerWindow
function onClickNavigateButton(lat, lng) {
    var url = "http://maps.google.com/maps?daddr="
    url += lat + "," + lng + "&saddr=���ݒn&dirflg=d";
    var features = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
    g_mapWin = window.open(url, "g_root", features);
}
/**
* �R���N�V�����ꗗ�쐬�ileast�j
*/
function setCollections(){
    // Element with data-caption
    // csvDataArray[i][CSV_SECTION_COLLECTIONS];       //���i��
    // csvDataArray[i][CSV_SECTION_PHOTONAME];         //�ʐ^�t�@�C��
    // csvDataArray[i][CSV_SECTION_COLLECTIONTYPE];    //���i�̎��
    // csvDataArray[i][CSV_SECTION_STORENAME];         //���X�f�[�^
    // csvDataArray[i][CSV_SECTION_ADDRESS];           //�Z��
    // csvDataArray[i][CSV_SECTION_LAT];               //�ܓx
    // csvDataArray[i][CSV_SECTION_LNG];               //�o�x
    // csvDataArray[i][CSV_SECTION_DETAIL];            //�Љ���
    // csvDataArray[i][CSV_SECTION_NOTOPENDAY];        //��x��
    // csvDataArray[i][CSV_SECTION_OPENTIME];          //�c�Ǝ���
    // csvDataArray[i][CSV_SECTION_RECOMENDER];        //���E�l
    var collectionData = "";
    var groupName = "";
    for (var i = 1; i < csvDataArray.length - 1; i++) {
        // add group for shuffle.js (data-groups='[\"group**\"]')
        groupName = "group" + csvDataArray[i][CSV_SECTION_COLLECTIONTYPE];
        //collectionData += "<li>";
        collectionData += "<li data-groups='[\"" + groupName + "\"]'>";
        collectionData += "<a href='./media/" + csvDataArray[i][CSV_SECTION_PHOTONAME] + "' title='" + csvDataArray[i][CSV_SECTION_COLLECTIONS] + "' data-subtitle='" + csvDataArray[i][CSV_SECTION_STORENAME] + "' data-caption='<strong>" + csvDataArray[i][CSV_SECTION_STORENAME] + "</strong> " + csvDataArray[i][CSV_SECTION_COLLECTIONS] + "'>";
        collectionData += "<img src='./media/" + csvDataArray[i][CSV_SECTION_PHOTONAME] + "' alt='Alt Image Text' />";
        collectionData += "</a>";
        collectionData += "</li>";
    }

    $('.least-gallery').append(collectionData);
    $('.least-gallery').least();
}

/**
* ���ёւ��̐ݒ�ishuffle�j
*/
function setSorting() {
    var $grid = $('#grid');
    $grid.shuffle({
        group: 'all',
        speed: 300,
        easing: 'ease-in-out'
    });
    $('#btn li').on('click', function() {
        var $this = $(this),
        group = $this.data('group');

        $('#btn .active').removeClass('active');
        $this.addClass('active');

        if(group != 'all'){
            $grid.shuffle('shuffle', function($el, shuffle) {
                return group.indexOf($el.data('groups')) > -1
            });
        }else{
                $grid.shuffle( 'shuffle', 'all' );
        }
    });
}