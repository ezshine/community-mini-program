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

$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}

$page=0;
$limit=10;

//select  字段列表 from Btab where 帖子uid in (select uid字段 from Atab where uid=myuid) order by createdate desc limit 0,30

$uid=$_SESSION['openid'];

$db = getDb();
$sql = "select * from ".getTablePrefix()."_articles where id in (select articleid from ".getTablePrefix()."_comment where authorid='$uid') and `type`=100 order by createdate desc LIMIT ".$limit*$page.",$limit";
$res=mysql_query($sql,$db) or die(mysql_error());

$list = array();
while ($row = mysql_fetch_assoc($res)) {

	$list[]=parseMarketItem($row);
}

exitJson(0,"",$list);


?>