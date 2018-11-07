<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include './lib/phpQuery/phpQuery.php'; 
phpQuery::newDocumentFile('http://www.bjjtgl.gov.cn'); 
echo pq("body")->html(); 

?>