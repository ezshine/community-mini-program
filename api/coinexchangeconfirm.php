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
$exchangeid=$jsondata->exchangeid;
$token=$jsondata->token;

session_start();
if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}
$uid=$_SESSION['openid'];

if($exchangeid!="" && $goodsid!=''){
	$db = getDb();

	$sql = "select * from `".getTablePrefix()."_articles` where id='$goodsid' LIMIT 1";
	$res=mysql_query($sql, $db) or die(mysql_error());
	$row = mysql_fetch_assoc($res);
	$marketItem=parseMarketItem($row);
	if($marketItem['authorid']==$uid){

		$now=time();
		$sql = "update `".getTablePrefix()."_exchangehistory` set exchangetime='$now' where id='$exchangeid' ";
		$res=mysql_query($sql, $db) or die(mysql_error());

		exitJson(0,'兑换已完成');
	}else{
		exitJson(1,"没有权限完成兑换");
	}


}else{
	exitJson(1,'缺少必要的参数');
}



?>