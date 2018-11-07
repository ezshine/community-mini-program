<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';

$postdata=file_get_contents("php://input");

$jsondata=json_decode($postdata);

$code=$jsondata->code;

if($code!=''){
	$contents = file_get_contents('https://api.weixin.qq.com/sns/jscode2session?appid='.getAppId().'&secret='.getAppSecret().'&js_code='.$code.'&grant_type=authorization_code');
	$jsondecode = json_decode($contents);
    $openid = $jsondecode->openid;//输出openid
    $session_key=$jsondecode->session_key;
    exitJson(0,'',array('openid'=>$openid,'session_key'=>$session_key));
}else{
	exitJson(1,'缺少code参数');
}

?>