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
$comment=$jsondata->text;
$token=$jsondata->token;

session_start();
if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}
$uid=$_SESSION['openid'];

if($articleid!="" && $uid!=""){

	$db = getDb();
	$now=time();

	$sql="select id from ".getTablePrefix()."_comment where articleid='$articleid' and authorid='$uid' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	if(mysql_num_rows($res)<=0){

		$sql="insert into ".getTablePrefix()."_comment (authorid,articleid,createdate,text) values('$uid','$articleid','$now','$comment')";
		$res=mysql_query($sql,$db) or die(mysql_error());

		exitJson(0,'接龙成功');
	}else{
		$row = mysql_fetch_assoc($res);
		$id=$row['id'];

		$sql="update ".getTablePrefix()."_comment set createdate='$now',text='$comment' where authorid='$uid' and articleid='$articleid' and `id`='$id' LIMIT 1";
		$res=mysql_query($sql,$db) or die(mysql_error());

		exitJson(1,'接龙已更新');
	}
}else{
	exitJson(1,'缺少必要的参数');
}



?>