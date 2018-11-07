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

$type=$jsondata->type;
$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}

$uid=$_SESSION['openid'];

$page=0;
$limit=10;

$db = getDb();
if($type!=""){
	$sql = "select `id`,title,telephone,`type`,ownerid from ".getTablePrefix()."_services where `type` = $type";
}else{
	$sql = "select `id`,title,telephone,`type`,ownerid from ".getTablePrefix()."_services";
}
$res=mysql_query($sql,$db) or die(mysql_error());

$list = array();
while ($row = mysql_fetch_assoc($res)) {

	$item=$row;

	if($row['ownerid']!="")$item["ownerInfo"]=getUserSimpleInfo($row['ownerid']);

	$list[]=$item;
}

exitJson(0,"",$list);


?>