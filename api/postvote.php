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
$votevalue=$jsondata->votevalue;
$comment=$jsondata->comment;
$token=$jsondata->token;

session_start();
if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}
$uid=$_SESSION['openid'];

if($articleid!="" && $votevalue!="" && $uid!=""){

	$db = getDb();
	$now=time();

	$sql="select id from ".getTablePrefix()."_vote where articleid='$articleid' and uid='$uid' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	if(mysql_num_rows($res)<=0){

		$sql="insert into ".getTablePrefix()."_vote (uid,articleid,createdate,votevalue,comment) values('$uid','$articleid','$now','$votevalue','$comment')";
		$res=mysql_query($sql,$db) or die(mysql_error());

		exitJson(0,'投票成功',array('voteid'=>$voteid));
	}else{
		exitJson(1,'已经投过票了，无法更改');
	}
}else{
	exitJson(1,'缺少必要的参数');
}



?>