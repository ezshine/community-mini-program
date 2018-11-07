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

$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}
$uid=$_SESSION['openid'];


// $sql = "select * from ".getTablePrefix()."_articles where `id`='$articleid' and deleted=0 order by createdate desc LIMIT 1";
// $res=mysql_query($sql,$db) or die(mysql_error());
// $row = mysql_fetch_assoc($res);

function alreadyCheckined($targettime){
	$db = getDb();
	$uid=$_SESSION['openid'];
	$sql = "select id from ".getTablePrefix()."_coinhistory where `ownerid`='$uid' and `type`=0 and createdate>$targettime order by id asc LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());
	if(mysql_num_rows($res)<=0){
		return false;
	}else{
		return true;
	}
}


if(!alreadyCheckined(strtotime(date("Y-m-d 00:00:00")))){
	if(alreadyCheckined(strtotime('yesterday'))){
		addCoinHistory(0,10,"连续每日签到");
		exitJson(0,"签到成功",array("value"=>10));
	}else{
		addCoinHistory(0,7,"每日签到");
		exitJson(0,"签到成功",array("value"=>7));
	}
	
}else{
	exitJson(1,"今天已经签过了");
}


?>