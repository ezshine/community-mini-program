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

$page=0;
if($jsondata->page!=""){
	$page=$jsondata->page;
}
$limit=10;

$db = getDb();
$sql = "select * from ".getTablePrefix()."_coinhistory where `ownerid` = '$uid' order by createdate desc LIMIT ".$limit*$page.",$limit";
$res=mysql_query($sql,$db) or die(mysql_error());

$list = array();
while ($row = mysql_fetch_assoc($res)) {
	$row['createdate']=date('Y-m-d H:i:s', $row['createdate']);
	$list[]=$row;
}

exitJson(0,"",$list);


?>