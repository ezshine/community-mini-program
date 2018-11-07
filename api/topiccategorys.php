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

function countTodayTopics($type){
	$start = strtotime(date('Y-m-d 00:00:00'));
	$end = strtotime(date('Y-m-d H:i:s'));

	$db = getDb();
	$sql = "select count(id) from ".getTablePrefix()."_articles where `type`=$type and createdate>=$start and createdate<=$end and deleted=0";
	$res=mysql_query($sql,$db) or die(mysql_error());
	$row=mysql_fetch_row($res);
	return $row[0];
}

function countAllTopics($type){
	$db = getDb();
	$sql = "select count(id) from ".getTablePrefix()."_articles where `type`=$type  and deleted=0";
	$res=mysql_query($sql,$db) or die(mysql_error());
	$row=mysql_fetch_row($res);
	return $row[0];
}


$category=array();
$category[]=array("title"=>"生活杂谈","type"=>0,"subtitle"=>"分享你所关心的大事小情","icon"=>"http://jnsii.com/jybhy/images/banner0.jpg");
$category[]=array("title"=>"匿名曝光台","type"=>8,"subtitle"=>"随手拍匿名曝光社区不文明现象","icon"=>"http://jnsii.com/jybhy/images/banner8.jpg");
$category[]=array("title"=>"摄影分享","type"=>1,"subtitle"=>"用镜头探索光影变幻大美家园","icon"=>"http://jnsii.com/jybhy/images/banner1.jpg");
$category[]=array("title"=>"汽车之家","type"=>7,"subtitle"=>"分享选车购车养车行车安全心得","icon"=>"http://jnsii.com/jybhy/images/banner7.jpg");
$category[]=array("title"=>"家有萌宠","type"=>2,"subtitle"=>"猫猫狗狗花鸟鱼虫萌翻天","icon"=>"http://jnsii.com/jybhy/images/banner2.jpg");
$category[]=array("title"=>"运动健康","type"=>5,"subtitle"=>"绕湖慢跑散步遛弯身心健康比什么都重要","icon"=>"http://jnsii.com/jybhy/images/banner5.jpg");
$category[]=array("title"=>"美食烹饪","type"=>6,"subtitle"=>"煎炸炒蒸烘焙分享厨房那点儿事","icon"=>"http://jnsii.com/jybhy/images/banner6.jpg");
$category[]=array("title"=>"房屋租赁","type"=>3,"subtitle"=>"金隅滨和园社区房屋出租寻租资讯","icon"=>"http://jnsii.com/jybhy/images/banner3.jpg");
$category[]=array("title"=>"招聘求职","type"=>4,"subtitle"=>"为社区居民提供优质工作招聘信息","icon"=>"");
$category[]=array("title"=>"版务区","type"=>9,"subtitle"=>"欢迎邻居提建议帮助我们做得更好","icon"=>"");

if(!isDitributionMode($jsondata->bv)){
	$category=array();
}


exitjson(0,"",$category);



?>