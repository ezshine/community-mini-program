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

$db = getDb();
$sql = "select * from ".getTablePrefix()."_articles where `id`='$articleid' and deleted=0 order by createdate desc LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());
$row = mysql_fetch_assoc($res);

if($row['id']){
	$sql2="update `".getTablePrefix()."_articles` set viewcount=viewcount+1 where `id`='$articleid' LIMIT 1";
	mysql_query($sql2,$db) or die(mysql_error());
}else{
	exitJson(1,"话题不存在");
}

$item=parsePKItem($row);
$item['text']=$row['text'];
$item['authorInfo']=getUserSimpleInfo($row['authorid']);
$item['viewcount']=intval($item['viewcount'])+1;

exitJson(0,"",$item);


?>