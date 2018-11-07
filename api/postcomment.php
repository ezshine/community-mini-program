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
$replyid=$jsondata->replyid;
$text=$jsondata->text;
$token=$jsondata->token;

$text = textFilter($text);

session_start();
if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}
$uid=$_SESSION['openid'];

$text=trim($text);
if($articleid!="" && $text!="" && $uid!=""){

	$db = getDb();
	$now=time();
	$sql = "insert into `".getTablePrefix()."_comment` (articleid,authorid, createdate, text,replyid) values('$articleid', '$uid', '$now','$text','$replyid')";
	$res=mysql_query($sql, $db) or die(mysql_error());
	$commentid=mysql_insert_id();

	addCoinHistory(2,1,"发表评论");

	$articledata=getArticleById($articleid);
	$data=array(
            'keyword1'=>array('value'=>$articledata['text'],'color'=>'#666666'),
            'keyword2'=>array('value'=>$text,'color'=>'#666666'),
        );
	if($articledata['type']<99)$noticeurl='pages/billboard/index?topicid='.$articleid;
	else $noticeurl='pages/billboard/index?goodsid='.$articleid;
	if($articledata['authorid']!=$uid)sendNotice($articledata['authorid'],"IZB14aNgVeskdYcllmszVF7Qx06_PP0V7QZ_WpL0CT0",$data,$noticeurl);

	if($replyid!=''){
		$reply=getCommentById($replyid);
		$data=array(
            'keyword1'=>array('value'=>$reply['text'],'color'=>'#666666'),
            'keyword2'=>array('value'=>$text,'color'=>'#666666'),
        );
		if($reply['authorid']!=$uid && $reply['authorid']!=$articledata['authorid'])sendNotice($reply['authorid'],"IZB14aNgVeskdYcllmszVF7Qx06_PP0V7QZ_WpL0CT0",$data,$noticeurl);
	}

	if($articledata['type']<99)
	{
		$now=time();
		$sql = "UPDATE ".getTablePrefix()."_articles set updatetime='$now' where `id` = '$articleid' LIMIT 1";
		$res=mysql_query($sql,$db) or die(mysql_error());
	}

	exitJson(0,'评论已发布',array('commentid'=>$commentid));

}else{
	exitJson(1,'缺少必要的参数');
}



?>