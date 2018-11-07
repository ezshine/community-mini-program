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

$isbn=$jsondata->isbn;
$title=str_replace("'","''",$jsondata->title);
$coverurl=$jsondata->coverurl;

$token=$jsondata->token;

session_start();
if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}
$uid=$_SESSION['openid'];

if($isbn!="" && $title!="" && $coverurl!=""){
	$db = getDb();

	$sql = "select * from `".getTablePrefix()."_books` where isbn='$isbn' and ownerid='$uid' LIMIT 1";
	$res=mysql_query($sql, $db) or die(mysql_error());

	if(mysql_num_rows($res)<=0){
		$now=time();
		$sql = "insert into `".getTablePrefix()."_books` (isbn,ownerid,createdate, title,coverurl) values('$isbn', '$uid', '$now','$title','$coverurl')";
		$res=mysql_query($sql, $db) or die(mysql_error());

		addCoinHistory(3,5,"发布图书");

		exitJson(0,'已发布');
	}else{
		exitJson(1,'您已经发布过这本书了');
	}
	
}else{
	exitJson(1,'缺少必要的参数');
}



?>