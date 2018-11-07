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

$uid=$jsondata->uid;
$keyword=$jsondata->keyword;
$isbn=$jsondata->isbn;

$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}

$page=0;
if($jsondata->page!=""){
	$page=$jsondata->page;
}
$limit=9;

$db = getDb();
$sql = "select *, count(distinct isbn) from ".getTablePrefix()."_books group by isbn order by createdate desc LIMIT ".$limit*$page.",$limit";
if($uid!=""){
	$sql = "select * from ".getTablePrefix()."_books where ownerid='$uid' order by createdate desc LIMIT ".$limit*$page.",$limit";
}else if($keyword!=""){
	$sql = "select *, count(distinct isbn) from ".getTablePrefix()."_books where title like '%$keyword%' group by isbn order by createdate desc LIMIT ".$limit*$page.",$limit";
}else if($isbn!=""){
	$sql = "select `ownerid`,`telephone`,`status` from ".getTablePrefix()."_books where isbn='$isbn' order by createdate desc LIMIT ".$limit*$page.",$limit";
}
$res=mysql_query($sql,$db) or die(mysql_error());

$list = array();


if($isbn!=""){
	while ($row = mysql_fetch_assoc($res)) {

		$item=getUserSimpleInfo($row['ownerid']);
		$item['telephone']=$row['telephone'];

		$list[]=$item;
	}
	exitJson(0,"",array("detail"=>getBookDetail($isbn),"list"=>$list));
}else{
	while ($row = mysql_fetch_assoc($res)) {

		$list[]=$row;
	}
}
exitJson(0,"",$list);


?>