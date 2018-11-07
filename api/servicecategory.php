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

$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}

$category=array();
$category[]=array("name"=>"物业","type"=>0);
$category[]=array("name"=>"超市","type"=>1);
$category[]=array("name"=>"餐饮","type"=>2);
$category[]=array("name"=>"家政","type"=>3);
$category[]=array("name"=>"维修","type"=>4);
$category[]=array("name"=>"教育","type"=>6);
$category[]=array("name"=>"宠物","type"=>7);
$category[]=array("name"=>"健康","type"=>8);
$category[]=array("name"=>"其他","type"=>5);

exitJson(0,"",$category);


?>