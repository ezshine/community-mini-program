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

$page=0;
if($jsondata->page!=""){
	$page=$jsondata->page;
}
$limit=10;

function makeStrMasked($str){
	$final="";
	for($i=0;$i<mb_strlen($str,"utf8");$i++){
		$final=$final."▓";
	}
	return $final.base64_encode(mb_substr($str, mb_strlen($str,"utf8")-1,1,"utf8"));
}

$db = getDb();
$sql = "select * from ".getTablePrefix()."_articles where `id`='$articleid' and deleted=0 order by createdate desc LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());
$row = mysql_fetch_assoc($res);

$list = getCommentList($articleid,$page,$limit,"desc");

if($row["masked"]==1){
	for ($i=0; $i < count($list); $i++) { 
		$list[$i]['authorInfo']['openid']="spotlight";
		$list[$i]['authorInfo']["headimg"]="http://jnsii.com/jybhy/images/maskedface.jpg";
		$list[$i]['authorInfo']['nickname']=makeStrMasked($list[$i]['authorInfo']['nickname']);
		if($list[$i]['replyid'])$list[$i]['reply']['authorInfo']['nickname']=makeStrMasked($list[$i]['reply']['authorInfo']['nickname']);
	}
}

exitJson(0,"",$list);


?>