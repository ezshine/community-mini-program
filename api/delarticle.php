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


$articleid=$jsondata->articleid;
$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}
$uid=$_SESSION['openid'];


$userInfo=getUserSimpleInfo($uid);

$db = getDb();
if($userInfo['type']==1){
	$sql = "UPDATE ".getTablePrefix()."_articles set deleted=1 where `id` = '$articleid' LIMIT 1";
}else{
	if(!addCoinHistory(1,-3,"社区生活删帖"))exitJson(1,"积分不足");
	$sql = "UPDATE ".getTablePrefix()."_articles set deleted=1 where `id` = '$articleid' and authorid='$uid' LIMIT 1";
}

$res=mysql_query($sql,$db) or die(mysql_error());


$sql="select `deleted` from ".getTablePrefix()."_articles where `id`='$articleid' LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());
$row = mysql_fetch_assoc($res);

if($row['deleted']==1){
	if($userInfo['type']==1)exitJson(0,'删除成功!');
	else exitJson(0,'删除成功~');
}else{
	exitJson(1,'您无权删除此条');
}



?>