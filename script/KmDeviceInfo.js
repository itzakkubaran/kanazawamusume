/*
 * KmDeviceInfo.js�@ 
 *
 * All Rights Reserved, Copyright IT�������΂��� Makers 2016 
 * 
 * 2016.09.01 m.asaoka Ver1.0-01 �V�K�쐬
 *
 */

/* ���݈ʒu�擾���� */
var now_lat = -999;                       //���݈ʒu�̈ܓx
var now_lng = -999;                       //���݈ʒu�̌o�x
var deviceResult = -1;                  �@//���݈ʒu�̎擾�̐�����

/* �f�o�C�X���擾���� */
var DEVICE_SUCCESS = 0;                 //�f�o�C�X�擾����
var PERMISSION_DENIED = 1;              //�ʒu���̗��p��������Ă��Ȃ�
var POSITION_UNAVAILABLE = 2;           //�f�o�C�X���擾�G���[
var TIMEOUT = 3;		        //�^�C���A�E�g

/* �f�o�C�X���擾�ݒ� */
var DEVICE_TIMEOUT = 6000;             �@�@�@//�^�C���A�E�g�l�i6�b)
var DEVICE_ENABLE_HIGH_ACCURACY = true;      //�ʒu���̐��x(TRUE=��������)
var DEVICE_MAXIMUM_AGE = 600000;             //�L�������i10���j

//------------------------------------
// �f�o�C�X���擾����
//------------------------------------
function GetCurrentPosition()
{
   //�T�|�[�g���Ă���ꍇ�̂ݎ擾
�@ if(navigator.geolocation)
   {
�@�@�@var opts = 
      {
         enableHighAccuracy: DEVICE_ENABLE_HIGH_ACCURACY;
         timeout:DEVICE_TIMEOUT; 
         maximumAge:DEVICE_MAXIMUM_AGE;
         
      };
�@�@�@//���[�U�[�̈ʒu�����擾
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback, opts);
   }
}
//------------------------------------
// ���[�U�[�ʒu���擾��������
//------------------------------------
function successCallback(position)
{
   //�ܓx���Z�b�g
   now_lat = position.coords.latitude;
   //�o�x���Z�b�g
�@ now_lng = position.coords.longitude;
   //�f�o�C�X���ʂ��Z�b�g
�@ deviceResult = DEVICE_SUCCESS;
}
//------------------------------------
// �擾���s���̏���
//------------------------------------
function errorCallback(error)
{
  var err_msg = "";
  switch(error.code)
  {
    case PERMISSION_DENIED:
      err_msg = "�ʒu���̗��p��������Ă��܂���";
      break;
    case POSITION_UNAVAILABLE:
      err_msg = "�f�o�C�X�̈ʒu������ł��܂���";
      break;
    case TIMEOUT:
      err_msg = "�^�C���A�E�g���܂���";
      break;
    default:
      break;
  }
  //for debug
  // alert(err_msg);
}
//------------------------------------
// ���݈ʒu�̈ܓx���擾
//------------------------------------
function getCurrentLatitude()
{
�@ return now_lat;
}
//------------------------------------
// ���݈ʒu�̌o�x���擾
//------------------------------------
function getCurrentLongitude()
{
�@ return now_lng;
}
//------------------------------------
// ���݈ʒu�̌o�x���擾
//------------------------------------
function getDeviceStatus()
{
   return deviceResult;
}

