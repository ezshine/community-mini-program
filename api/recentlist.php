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

$db = getDb();
$sql = "select * from ".getTablePrefix()."_members order by lastlogin desc LIMIT 10";
$res=mysql_query($sql,$db) or die(mysql_error());

$list = array();
while ($row = mysql_fetch_assoc($res)) {
	
	$list[] = getUserSimpleInfo($row['openid']);
}

exitJson(0,"",array("totalmembers"=>getTotalMemberCount(),"recent"=>$list));


?>