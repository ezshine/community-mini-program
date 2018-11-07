<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");

$jsondata=json_decode($postdata);

$text=$jsondata->text;
$testing=$jsondata->testing;
$goodsid=$jsondata->goodsid;
$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}
$uid=$_SESSION['openid'];

$text=trim($text);

if($text!='' && $uid!=''){
	$db = getDb();
	$now=time();

	$marketitem=getArticleById($goodsid);
	if($marketitem['authorid']==$uid){

		$data=array(
	        'keyword1'=>array('value'=>$text,'color'=>'#ff0000'),
	        'keyword2'=>array('value'=>date("Y-m-d H:i:s",time()),'color'=>'#666666'),
	        'keyword3'=>array('value'=>$marketitem['title'],'color'=>'#666666'),
	    );

		if($testing==true){
			sendNotice($uid,"FSh7ONdmR2FbefvtVC0eSJ5O1iF6MVT38xDNe_SSS_w",$data,'pages/billboard/index?goodsid='.$goodsid);
			exitJson(0,'测试模式发布成功');
		}else{
			if(!addCoinHistory(11,-100,"发布店长通知：".$marketitem['title']))exitJson(0,"积分不足");

			$sql="select uid from ".getTablePrefix()."_like where articleid='$goodsid'";
			$res=mysql_query($sql,$db) or die(mysql_error());

			$sended=0;
			while ($row = mysql_fetch_assoc($res)) {
				sendNotice($row['uid'],"FSh7ONdmR2FbefvtVC0eSJ5O1iF6MVT38xDNe_SSS_w",$data,'pages/billboard/index?goodsid='.$goodsid);
				$sended+=1;
			}

			exitJson(0,'发布成功，已通知'.$sended.'人');
		}
	}else{
		exitJson(1,'没有权限发布通知');
	}
}else{
	exitJson(1,'缺少必要的参数');
}

?>