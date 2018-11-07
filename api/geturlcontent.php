<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

include './lib/phpQuery/phpQuery.php'; 


$postdata=file_get_contents("php://input");

$jsondata=json_decode($postdata);

$url=$jsondata->url;


if($url){
	// phpQuery::newDocumentFile($url); 
	$t=file_get_contents($url);

	phpQuery::newDocumentHTML($t,$charset = 'utf-8');
// 	$t = mb_convert_encoding($t,'ISO-8859-1','utf-8');
// $t = mb_convert_encoding($t,'utf-8','GBK');
	exitJson(0,"",pq("#js_content")->html());
}else{
	exitJson(1,"缺少必要的参数");
}


?>