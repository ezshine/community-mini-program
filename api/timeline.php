<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");
$jsondata=json_decode($postdata);

$uid=$jsondata->uid;
$page=0;
$token=$jsondata->token;

session_start();

$limit=10;

if($uid!=''){
	$db = getDb();

	$userInfo = getUserInfo($uid);

	// $sql = "select * from ".getTablePrefix()."_articles where authorid = '$uid' and `type`=0 order by createdate desc LIMIT ".$limit*$page.",$limit";
	// $res=mysql_query($sql,$db) or die(mysql_error());

	// $list = array();
	// while ($row = mysql_fetch_assoc($res)) {

	// 	$list[]=parseArticleItem($row);
	// }

	$mode=false;
	if($jsondata->bv!=''){
		$mode=isDitributionMode($jsondata->bv);
	}

	exitJson(0,'',array('userInfo'=>$userInfo,'mode'=>$mode,'list'=>array()));

}else{
	exitJson(1,'缺少必要的参数');
}

?>