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


$headimg=$jsondata->avatarUrl;
$city=$jsondata->city;
$country=$jsondata->country;
$gender=$jsondata->gender;
$language=$jsondata->language;
$nickname=$jsondata->nickName;
$openid=$jsondata->openid;
$province=$jsondata->province;


$db = getDb();

if($headimg!="" && $openid!="" && $nickname!=""){
	
	$sql = "select * from ".getTablePrefix()."_members where openid = '$openid' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$now = time();
	if(mysql_num_rows($res)<=0){
		$sql = "insert into `".getTablePrefix()."_members` (openid, nickname, headimg, gender, city,province,country,joindate,lastlogin) values('$openid', '$nickname', '$headimg' ,'$gender' ,'$city' ,'$province', '$country','$now','$now')";
		mysql_query($sql, $db) or die(mysql_error());
	}else{
		$row = mysql_fetch_assoc($res);
		if($row['baned']){
			exitJson(1, '您已被关小黑屋');
		}
		$sql = "update `".getTablePrefix()."_members` set nickname='$nickname', headimg='$headimg',lastlogin='$now' where openid='$openid' ";
		mysql_query($sql, $db) or die(mysql_error());
	}

	$token = getToken();
	session_start();
	$_SESSION['token'] = $token;
	$_SESSION['openid'] = $openid;
	exitJson(0, '',array('token'=>$_SESSION['token'],'sessionid'=>session_id())+getUserInfo($openid));
}else{
	exitJson(2, '登录失败，请授权获得昵称和头像');
}
?>