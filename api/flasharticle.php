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
$now=time();
if(!addCoinHistory(5,-50,"置顶帖子"))exitJson(1,'积分不足');
$sql = "UPDATE ".getTablePrefix()."_articles set updatetime='$now' where `id` = '$articleid' LIMIT 1";

$res=mysql_query($sql,$db) or die(mysql_error());

exitJson(0,'置顶成功');



?>