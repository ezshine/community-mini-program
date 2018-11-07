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

function checkShareToday($targettime){
	$db = getDb();
	$uid=$_SESSION['openid'];
	$sql = "select id from ".getTablePrefix()."_coinhistory where `ownerid`='$uid' and `type`=9 and createdate>$targettime order by id asc LIMIT 10";
	$res=mysql_query($sql,$db) or die(mysql_error());
	if(mysql_num_rows($res)<10){
		return false;
	}else{
		return true;
	}
}


if(!checkShareToday(strtotime(date("Y-m-d 00:00:00")))){
	addCoinHistory(9,1,"分享小程序");
	exitJson(0,"分享成功",array("value"=>1));
}else{
	exitJson(1,"今天已获得10分");
}


?>