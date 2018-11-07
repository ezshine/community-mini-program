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

function makeStrMasked($str){
	$final="";
	for($i=0;$i<mb_strlen($str,"utf8");$i++){
		$final=$final."▓";
	}
	return $final.base64_encode(mb_substr($str, mb_strlen($str,"utf8")-1,1,"utf8"));
}

$item=parseArticleItem($row);
$item['viewcount']=intval($item['viewcount'])+1;
if($row["masked"]==1){
	$maskdNickname=makeStrMasked($item['authorInfo']['nickname']);
	$item['authorInfo']=getUserSimpleInfo("spotlight");
	$item['authorInfo']['nickname']=$maskdNickname;
	for ($i=0; $i < count($item['commentlist']); $i++) { 
		$item['commentlist'][$i]['authorInfo']['openid']="spotlight";
		$item['commentlist'][$i]['authorInfo']["headimg"]="http://jnsii.com/jybhy/images/maskedface.jpg";
		$item['commentlist'][$i]['authorInfo']['nickname']=makeStrMasked($item['commentlist'][$i]['authorInfo']['nickname']);
		if($item['commentlist'][$i]['replyid'])$item['commentlist'][$i]['reply']['authorInfo']['nickname']=makeStrMasked($item['commentlist'][$i]['reply']['authorInfo']['nickname']);
	}
}

if(!isDitributionMode($jsondata->bv)){
	$item['disablecomment']=1;
}

exitJson(0,"",$item);


?>