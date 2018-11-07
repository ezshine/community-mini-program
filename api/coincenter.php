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

$db = getDb();
$todaystart=strtotime(date("Y-m-d 00:00:00"));

$sql = "select SUM(value) from ".getTablePrefix()."_coinhistory where `createdate`>$todaystart and ownerid='$uid'";
$res=mysql_query($sql,$db) or die(mysql_error());
$row = mysql_fetch_row($res);
$todayraise=0;
if($row[0]){
	$todayraise=$row[0];
}


$sql="SELECT openid, coin, (SELECT count(*)+1 FROM `".getTablePrefix()."_members` WHERE (coin > ( SELECT coin FROM `".getTablePrefix()."_members` WHERE openid = '$uid') )) AS mc FROM ".getTablePrefix()."_members WHERE openid = '$uid' ";
$res=mysql_query($sql,$db) or die(mysql_error());
$row = mysql_fetch_row($res);
$rank=210;
if($row[2]){
	$rank=$row[2];
}

$checkined=false;
$sql = "select id from ".getTablePrefix()."_coinhistory where `ownerid`='$uid' and `type`=0 and createdate>$todaystart LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());

if(mysql_num_rows($res)>0){
	$checkined=true;
}

exitJson(0,"",array("userinfo"=>getUserSimpleInfo($uid),"checkined"=>$checkined,"todayraise"=>$todayraise,"rank"=>$rank));


?>