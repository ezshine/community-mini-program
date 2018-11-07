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

$uid=$jsondata->uid;
$keyword=$jsondata->keyword;

$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}

$page=0;
if($jsondata->page!=""){
	$page=$jsondata->page;
}
$limit=6;

$db = getDb();
$sql = "select * from ".getTablePrefix()."_articles where `type` = 101 and deleted=0 order by updatetime desc LIMIT ".$limit*$page.",$limit";
if($uid!=""){
	$sql = "select * from ".getTablePrefix()."_articles where `type` = 101 and deleted=0 and authorid='$uid' order by updatetime desc LIMIT ".$limit*$page.",$limit";
}else if($keyword=="积分"){
	$sql = "select * from ".getTablePrefix()."_articles where `type` = 101 and deleted=0 and exchangecoin>0 order by updatetime desc LIMIT ".$limit*$page.",$limit";
}else if($keyword!=""){
	$sql = "select * from ".getTablePrefix()."_articles where `type` = 101 and deleted=0 and `title` like '%$keyword%' order by updatetime desc LIMIT ".$limit*$page.",$limit";
}
$res=mysql_query($sql,$db) or die(mysql_error());

$list = array();
while ($row = mysql_fetch_assoc($res)) {

	$list[]=parseMarketItem($row);
}

if(!isDitributionMode($jsondata->bv)){
	$list = array();
}

exitJson(0,"",$list);


?>