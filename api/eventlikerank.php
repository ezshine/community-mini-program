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

$type=1;

$page=0;
$limit=10;

$db = getDb();
$sql = "select * from ".getTablePrefix()."_articles where `type` = $type and deleted=0 order by updatetime desc,createdate desc LIMIT ".$limit*$page.",$limit";
$res=mysql_query($sql,$db) or die(mysql_error());

$list = array();
while ($row = mysql_fetch_assoc($res)) {

	$item=parseArticleSimpleItem($row);

    if(count($item['vids'])>0)$item['text']='[视频]'.$item['text'];

    $item['text']=mb_substr($item['text'], 0,60,"UTF-8");
    if(mb_strlen($item['text'],"UTF-8")>=60)$item['text']=$item['text']."...";

    $list[]=$item;
}

exitJson(0,"",$list);


?>