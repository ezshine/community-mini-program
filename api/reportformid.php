<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");

$jsondata=json_decode($postdata);

$formid=$jsondata->formid;
$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}


$uid=$_SESSION['openid'];
if($formid!="" && $uid!=""){
	if(trim($formid)=="the formId is a mock one"){
		exitJson(1,'formid 错误');
	}
	
	$db = getDb();
	$now=time();
	$sql="insert into ".getTablePrefix()."_formids (ownerid,formid,createdate) values('$uid','$formid','$now')";
	mysql_query($sql, $db) or die(mysql_error());

	exitJson(0,'提交成功');
}else{
	exitJson(1,'缺少必要的参数');
}


?>