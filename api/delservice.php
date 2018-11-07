<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");

$jsondata=json_decode($postdata);

$serviceid=$jsondata->serviceid;
$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}
$uid=$_SESSION['openid'];


if($serviceid!=''){
	$db = getDb();

	$userInfo=getUserSimpleInfo($uid);
	if($userInfo['type']==1){
		$sql = "delete from `".getTablePrefix()."_services` where id='$serviceid' LIMIT 1";
		$res=mysql_query($sql, $db) or die(mysql_error());
		
		exitJson(0,'删除成功');
	}else{
		exitJson(1,'没有权限删除');
	}
}else{
	exitJson(1,'缺少必要的参数');
}

?>