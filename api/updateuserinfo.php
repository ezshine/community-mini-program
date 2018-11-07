<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';

$postdata=file_get_contents("php://input");

$jsondata=json_decode($postdata);

$area=$jsondata->area;
$slogan=$jsondata->slogan;
$career=$jsondata->career;
$mobile=$jsondata->mobile;
$qq=$jsondata->qq;
$wechatid=$jsondata->wechatid;
$tags=$jsondata->tags;
$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}
$uid=$_SESSION['openid'];


$db = getDb();


$sqlParams=array();

array_push($sqlParams,"wechatid='$wechatid'");
array_push($sqlParams,"qq='$qq'");
array_push($sqlParams,"mobile='$mobile'");
array_push($sqlParams,"slogan='$slogan'");
array_push($sqlParams,"career='$career'");
if($area!=""){
	array_push($sqlParams,"area='$area'");
}
if(count($tags)>0){
	$tags_str=join(",",$tags);
	array_push($sqlParams,"tags='$tags_str'");
}

$sqlp_str=join(",",$sqlParams);

$sql="UPDATE `".getTablePrefix()."_members` set $sqlp_str where openid='$uid' ";
$res=mysql_query($sql,$db) or die(mysql_error());

exitJson(0,"资料已更新");



?>