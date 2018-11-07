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

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}

$uid=$_SESSION['openid'];

$db = getDb();
$sql = "select * from ".getTablePrefix()."_articles where `type` = '$type' and `id`='$goodsid' LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());
$row = mysql_fetch_assoc($res);

$item=parseMarketItem($row);
$item['authorInfo']=getUserSimpleInfo($row['authorid']);


$page=0;
if($jsondata->page!=""){
	$page=$jsondata->page;
}
$limit=10;

if($uid==$row['authorid']){
	$sql = "select * from ".getTablePrefix()."_exchangehistory where `goodsid` = '$goodsid' order by exchangetime desc,createdate desc LIMIT ".$limit*$page.",$limit";
}else{
	$sql = "select * from ".getTablePrefix()."_exchangehistory where `goodsid` = '$goodsid' and `ownerid`='$uid' order by exchangetime desc,createdate desc LIMIT ".$limit*$page.",$limit";
}
$res=mysql_query($sql,$db) or die(mysql_error());
$list = array();
while ($row = mysql_fetch_assoc($res)) {

	$row['createdate']=date('Y-m-d H:i:s', $row['createdate']);
	if($row['exchangetime']>0)$row['exchangetime']=date('Y-m-d H:i:s', $row['exchangetime']);
	else $row['exchangetime']='';
	$row['ownerInfo']=getUserSimpleInfo($row['ownerid']);
	$list[] = $row;
}

exitJson(0,"",array("userInfo"=>getUserSimpleInfo($uid),"exchangehistory"=>$list,"goodsdetail"=>$item));


?>