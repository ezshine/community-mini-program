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

$uid=$_SESSION['openid'];
if($uid!=""){
	$todaystart=strtotime(date("Y-m-d 00:00:00"));
	$db = getDb();
	$sql="select * from ".getTablePrefix()."_werun where ownerid='$uid' and updatetime>$todaystart LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());
	$todaystep = mysql_fetch_assoc($res);

	$todaystep['stepcount']=$todaystep['stepcount'];
	$todaystep['timestamp']=date("Y-m-d H:i:s",$todaystep['timestamp']);
	$todaystep['updatetime']=date("Y-m-d H:i:s",$todaystep['updatetime']);


	$sql="select * from ".getTablePrefix()."_werun where updatetime>$todaystart order by stepcount desc LIMIT 10";
	$res=mysql_query($sql,$db) or die(mysql_error());
	$todaypersonal = array();
	while ($row = mysql_fetch_assoc($res)) {
		
		$item = $row;
		$item['userInfo']=getUserSimpleInfo($row['ownerid']);
		$item['timestamp']=date("Y-m-d H:i:s",$item['timestamp']);
		$item['updatetime']=date("Y-m-d H:i:s",$item['updatetime']);

		$todaypersonal[]=$item;
	}

	$yesterdaystart=strtotime("yesterday");
	$sql="select * from ".getTablePrefix()."_werun where updatetime>$yesterdaystart and updatetime<$todaystart order by stepcount desc LIMIT 10";
	$res=mysql_query($sql,$db) or die(mysql_error());
	$yesterdaypersonal = array();
	while ($row = mysql_fetch_assoc($res)) {
		
		$item = $row;
		$item['userInfo']=getUserSimpleInfo($row['ownerid']);
		$item['timestamp']=date("Y-m-d H:i:s",$item['timestamp']);
		$item['updatetime']=date("Y-m-d H:i:s",$item['updatetime']);

		$yesterdaypersonal[]=$item;
	}

	$monthstart=strtotime(date("Y-m-01 00:00:00"));
	$sql = "select ownerid,id,updatetime,timestamp,sum(stepcount) as stepcount from ".getTablePrefix()."_werun where updatetime>$monthstart group by ownerid order by stepcount desc LIMIT 10";
	// echo $sql;
	$res=mysql_query($sql,$db) or die(mysql_error());
	$monthpersonal = array();
	while ($row = mysql_fetch_assoc($res)) {
		
		$item = $row;
		$item['userInfo']=getUserSimpleInfo($row['ownerid']);
		$item['timestamp']=date("Y-m-d H:i:s",$item['timestamp']);
		$item['updatetime']=date("Y-m-d H:i:s",$item['updatetime']);

		$monthpersonal[]=$item;
	}

	$lastmonthEnd=date("Y-m-01 00:00:00");
	$lastmonthstart=strtotime("$lastmonthEnd -1 month");
	$sql = "select ownerid,id,updatetime,timestamp,sum(stepcount) as stepcount from ".getTablePrefix()."_werun where updatetime>$lastmonthstart and updatetime<$monthstart group by ownerid order by stepcount desc LIMIT 10";
	// echo $sql;
	$res=mysql_query($sql,$db) or die(mysql_error());
	$lastmonthpersonal = array();
	while ($row = mysql_fetch_assoc($res)) {
		
		$item = $row;
		$item['userInfo']=getUserSimpleInfo($row['ownerid']);
		$item['timestamp']=date("Y-m-d H:i:s",$item['timestamp']);
		$item['updatetime']=date("Y-m-d H:i:s",$item['updatetime']);

		$lastmonthpersonal[]=$item;
	}

	exitJson(0,"",array("todaystep"=>$todaystep,"todaypersonal"=>$todaypersonal,"yesterdaypersonal"=>$yesterdaypersonal,"monthpersonal"=>$monthpersonal,"lastmonthpersonal"=>$lastmonthpersonal));

}else{
	exitJson(1,"缺少必要的参数");
}



?>