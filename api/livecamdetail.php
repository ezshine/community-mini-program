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

$camid=$jsondata->camid;

$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}

$db = getDb();
$sql = "select * from ".getTablePrefix()."_livecams where id='$camid' LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());

$row = mysql_fetch_assoc($res);

$row["userInfo"]=getUserSimpleInfo($row['ownerid']);

$row["commentcount"]=0;
$row["commentlist"]=array();

exitJson(0,"",$row);

?>