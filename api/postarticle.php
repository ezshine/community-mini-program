<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

$postdata=file_get_contents("php://input");

$jsondata=json_decode($postdata);

$type=$jsondata->type;
$text=$jsondata->text;
$pics=$jsondata->pics;
$gps=$jsondata->gps;
$gpsaddr=$jsondata->gpsaddr;
$gpscity=$jsondata->gpscity;
$token=$jsondata->token;


$text = textFilter($text);

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}
$authorid=$_SESSION['openid'];

$isEmpty=false;

$text=trim($text);
if($text=='' && $pics==''){
	$isEmpty=true;
}

if($authorid!='' && !$isEmpty){
	$db = getDb();
	$now=time();

	if(intval($type)==100){
		$title=$jsondata->title;
		$title = textFilter($title);
		$price=($jsondata->price)*100;
		$articleid=$jsondata->goodsid;
		if($articleid!=""){
			$sql = "update `".getTablePrefix()."_articles` set text='$text',createdate='$now', gps='$gps',gpsaddr='$gpsaddr',gpscity='$gpscity',`title`='$title',`price`='$price' where `id`='$articleid' ";
		}else{
			$sql = "insert into `".getTablePrefix()."_articles` (authorid, createdate,updatetime, text, gps,gpsaddr,gpscity,`type`,`title`,`price`) values('$authorid', '$now','$now','$text' ,'$gps' ,'$gpsaddr', '$gpscity','$type','$title','$price')";
		}
	}else if(intval($type)==101){
		$title=$jsondata->title;
		$title = textFilter($title);
		$price=($jsondata->price)*100;
		$unit=$jsondata->unit;
		$telephone=$jsondata->telephone;
		$exchangecoin=$jsondata->exchangecoin;
		$exchangeprice=$jsondata->exchangeprice;
		$exchangedesc=$jsondata->exchangedesc;
		$articleid=$jsondata->goodsid;
		if($articleid!=""){
			$sql = "update `".getTablePrefix()."_articles` set text='$text',createdate='$now', gps='$gps',gpsaddr='$gpsaddr',gpscity='$gpscity',`title`='$title',`price`='$price',telephone='$telephone',`unit`='$unit',exchangecoin='$exchangecoin',exchangeprice='$exchangeprice',exchangedesc='$exchangedesc' where `id`='$articleid' ";
		}else{
			$sql = "insert into `".getTablePrefix()."_articles` (authorid, createdate,updatetime, text, gps,gpsaddr,gpscity,`type`,`title`,`price`,`telephone`,`unit`,exchangecoin,exchangeprice,exchangedesc) values('$authorid', '$now','$now','$text' ,'$gps' ,'$gpsaddr', '$gpscity','$type','$title','$price','$telephone','$unit','$exchangecoin','$exchangeprice','$exchangedesc')";
		}
		
	}else if(intval($type)==102){
		if(!addCoinHistory(12,-100,"发布投票帖"))exitJson(1,'积分不足');
		$title=$jsondata->title;
		$title = textFilter($title);
		if($articleid!=""){
			$sql = "update `".getTablePrefix()."_articles` set text='$text',createdate='$now', gps='$gps',gpsaddr='$gpsaddr',gpscity='$gpscity',`title`='$title',`price`='$price',telephone='$telephone',`unit`='$unit',exchangecoin='$exchangecoin',exchangeprice='$exchangeprice',exchangedesc='$exchangedesc' where `id`='$articleid' ";
		}else{
			$sql = "insert into `".getTablePrefix()."_articles` (authorid, createdate,updatetime, text, gps,gpsaddr,gpscity,`type`,`title`,`price`,`telephone`,`unit`,exchangecoin,exchangeprice,exchangedesc) values('$authorid', '$now','$now','$text' ,'$gps' ,'$gpsaddr', '$gpscity','$type','$title','$price','$telephone','$unit','$exchangecoin','$exchangeprice','$exchangedesc')";
		}
		
	}else if(intval($type)==103){
		if(!addCoinHistory(13,-10,"发布接龙"))exitJson(1,'积分不足');
		$title=$jsondata->title;
		$title = textFilter($title);
		$articleid=$jsondata->articleid;
		if($articleid!=""){
			$sql = "update `".getTablePrefix()."_articles` set text='$text',createdate='$now', gps='$gps',gpsaddr='$gpsaddr',gpscity='$gpscity',`title`='$title',`price`='$price',telephone='$telephone',`unit`='$unit',exchangecoin='$exchangecoin',exchangeprice='$exchangeprice',exchangedesc='$exchangedesc' where `id`='$articleid' ";
		}else{
			$sql = "insert into `".getTablePrefix()."_articles` (authorid, createdate,updatetime, text, gps,gpsaddr,gpscity,`type`,`title`,`price`,`telephone`,`unit`,exchangecoin,exchangeprice,exchangedesc) values('$authorid', '$now','$now','$text' ,'$gps' ,'$gpsaddr', '$gpscity','$type','$title','$price','$telephone','$unit','$exchangecoin','$exchangeprice','$exchangedesc')";
		}
		
	}else{
		$masked=0;
		if(intval($type)==8)$masked=1;
		$sql = "insert into `".getTablePrefix()."_articles` (authorid, createdate,updatetime, text, gps,gpsaddr,gpscity,`type`,masked) values('$authorid', '$now','$now','$text' ,'$gps' ,'$gpsaddr', '$gpscity','$type','$masked')";
	}
	$res=mysql_query($sql, $db) or die(mysql_error());
	
	
	if(mysql_insert_id($db)>0){
		$articleid = mysql_insert_id($db);
		if(intval($type)==101);
		else if(intval($type)==102);
		else if(intval($type)==103);
		else addCoinHistory(1,1,"社区生活发帖");
	}

	exitJson(0,'发布成功',array('articleid'=>$articleid));
}else{
	exitJson(1,'缺少必要的参数');
}

?>