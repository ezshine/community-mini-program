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
$pause=$jsondata->pause;
$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}
$uid=$_SESSION['openid'];


$userInfo=getUserSimpleInfo($uid);

$db = getDb();
$sql = "UPDATE ".getTablePrefix()."_articles set disablecomment=$pause where `id` = '$articleid' and authorid='$uid' LIMIT 1";
if($userInfo['type']==1){
	$sql = "UPDATE ".getTablePrefix()."_articles set disablecomment=$pause where `id` = '$articleid' LIMIT 1";
}

$res=mysql_query($sql,$db) or die(mysql_error());

$sql="select `authorid`,`disablecomment` from ".getTablePrefix()."_articles where `id`='$articleid' LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());
$row = mysql_fetch_assoc($res);

if($row['authorid']==$uid || $userInfo['type']==1){
	if($row['disablecomment'])exitJson(0,'接龙已停止');
	else exitJson(0,'接龙已开启');
}else{
	exitJson(0,'你无权操作');
}



?>