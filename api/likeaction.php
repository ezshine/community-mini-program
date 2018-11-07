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
if($articleid!="" && $uid!=""){
	
	$db = getDb();
	if(isLiked($uid,$articleid)){
		$sql = "DELETE FROM `".getTablePrefix()."_like` WHERE uid='$uid' AND articleid='$articleid' LIMIT 1";
		mysql_query($sql, $db) or die(mysql_error());

		exitJson(0,'已取消Like',array('action'=>0));
	}else{
		
		$now=time();
		$sql = "insert into `".getTablePrefix()."_like` (uid, articleid, createdate) values('$uid', '$articleid', '$now')";
		mysql_query($sql, $db) or die(mysql_error());

		$articledata=getArticleById($articleid);
		$data=array(
                'keyword1'=>array('value'=>$articledata['text'],'color'=>'#666666'),
                'keyword2'=>array('value'=>'给你点了赞','color'=>'#666666'),
            );
		if($articledata['type']<99)$noticeurl='pages/billboard/index?topicid='.$articleid;
		else $noticeurl='pages/billboard/index?goodsid='.$articleid;
		if($articledata['authorid']!=$uid)sendNotice($articledata['authorid'],"IZB14aNgVeskdYcllmszVF7Qx06_PP0V7QZ_WpL0CT0",$data,$noticeurl);

		exitJson(0,'Like成功',array('action'=>1));
	}
}else{
	exitJson(1,'缺少必要的参数');
}


?>