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

$page=0;
$limit=10;

$db = getDb();
$sql = "select * from ".getTablePrefix()."_articles where `type` = 99 order by createdate desc LIMIT ".$limit*$page.",$limit";
$res=mysql_query($sql,$db) or die(mysql_error());

$list = array();
while ($row = mysql_fetch_assoc($res)) {

	$pics=[];

	if($row['pics']!=''){
		$pics_arr=explode(",", $row['pics']);
		for ($i=0; $i < count($pics_arr); $i++) { 
			array_push($pics, date('Y', $row['createdate'])."/".date('m-d', $row['createdate'])."/".$pics_arr[$i]);
		}
	}
	
	$list[] = array(
		'id'=>$row['id'],
		'createdate'=> date('Y-m-d H:i:s', $row['createdate']),
		'title'=>$row['title'],
		'text'=>$row['text'],
		'pics'=>$pics
	);
}


exitJson(0,"",$list);


?>