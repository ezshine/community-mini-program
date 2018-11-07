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

$goodsid=$jsondata->goodsid;
$type=$jsondata->type;

$token=$jsondata->token;

session_start();

$db = getDb();
$sql = "select * from ".getTablePrefix()."_articles where `type` = '$type' and `id`='$goodsid' LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());
$row = mysql_fetch_assoc($res);

if($row['id']){
	$sql2="update `".getTablePrefix()."_articles` set viewcount=viewcount+1 where `id`='$goodsid' LIMIT 1";
	mysql_query($sql2,$db) or die(mysql_error());
}

$uid=$_SESSION['openid'];

$item=parseMarketItem($row);
$item['text']=$row['text'];
$item['telephone']=$row['telephone'];
$item['viewcount']=intval($item['viewcount'])+1;
$item['authorInfo']=getUserSimpleInfo($row['authorid']);
$item['commentcount']=getCommentCount($row['id']);
//$item['commentlist']=getCommentList($row['id'],0,20,'desc');
$item['isliked']=isLiked($uid,$row['id']);
$item['likelist']=getLikeList($row['id'],0,50,'desc');
$item['disablecomment']=intval($row['disablecomment']);

if(!isDitributionMode($jsondata->bv)){
	$item['disablecomment']=1;
}

exitJson(0,"",$item);


?>