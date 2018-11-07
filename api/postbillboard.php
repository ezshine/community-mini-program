<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");

$jsondata=json_decode($postdata);

$title=$jsondata->title;
$text=$jsondata->text;
$noticeall=$jsondata->noticeall;
$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}
$uid=$_SESSION['openid'];

$text=trim($text);
$title=trim($title);

if($text!='' && $title!='' && $uid!=''){
	$db = getDb();
	$now=time();

	$userInfo=getUserSimpleInfo($uid);
	if($userInfo['type']==1){
		$sql = "insert into `".getTablePrefix()."_articles` (authorid, createdate,title, text,`type`) values('$uid', '$now','$title','$text' ,'99')";
		$res=mysql_query($sql, $db) or die(mysql_error());

		if($noticeall==true){
			$noticecount=sendUnreadNoticeToAll($text);
			exitJson(0,'发布成功，已通知'.$noticecount.'人',array('articleid'=>$articleid));
		}else{
			exitJson(0,'发布成功',array('articleid'=>$articleid));
		}
	}else{
		exitJson(1,'没有权限发布公告');
	}
}else{
	exitJson(1,'缺少必要的参数');
}

?>