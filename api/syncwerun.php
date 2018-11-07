<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';
include_once "./lib/wxcrypt/wxBizDataCrypt.php";

$postdata=file_get_contents("php://input");

$jsondata=json_decode($postdata);

$appid = getAppId();
$session_key = $jsondata->session_key;
$encrypteddata=$jsondata->encrypteddata;
$iv = $jsondata->iv;

$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}

function todayIsInserted($targettime){
	$db = getDb();
	$uid=$_SESSION['openid'];
	$sql = "select id from ".getTablePrefix()."_werun where `ownerid`='$uid' and updatetime>$targettime LIMIT 1";
	// echo $sql;
	$res=mysql_query($sql,$db) or die(mysql_error());
	if(mysql_num_rows($res)<=0){
		return false;
	}else{
		return true;
	}
}

$uid=$_SESSION['openid'];
if($uid!="" && $session_key!="" && $iv!="" && $encrypteddata!=""){
	$pc = new WXBizDataCrypt($appid, $session_key);
	$errCode = $pc->decryptData($encrypteddata, $iv, $data );
	// echo $data."\n";
	$output = iconv('gbk', 'utf8', $data);

	// $stepcount=$data['stepInfoList;
	// print_r (json_decode($output));
	if ($errCode == 0) {
		$json_result=json_decode($output);
		$todayStepInfo=end($json_result->stepInfoList);
		
		$stepcount=$todayStepInfo->step;
		$timestamp=$todayStepInfo->timestamp;

		if($stepcount<=0)exitJson(1,"步数为0");
		// echo $data->stepInfoList;
		$now=time();
		$db = getDb();

		$todaystart=strtotime(date("Y-m-d 00:00:00"));
		if(todayIsInserted($todaystart)){
			// echo "123";
	    	$sql="update ".getTablePrefix()."_werun set stepcount='$stepcount',updatetime='$now' where ownerid='$uid' and updatetime>$todaystart LIMIT 1";
	    }else{
	    	// echo "456";
	    	addCoinHistory(10,5,"提交微信运动步数");
	    	$sql="insert into ".getTablePrefix()."_werun (ownerid,stepcount,timestamp,updatetime) values('$uid','$stepcount','$timestamp','$now')";
	    }
	    mysql_query($sql, $db) or die(mysql_error());

	    exitJson(0,"步数已更新",array('stepcount' => $stepcount, 'timestamp'=>date("Y-m-d H:i:s",$timestamp),'updatetime'=>date("Y-m-d H:i:s",$now)));
	} else {
	    exitJson(1,$errCode);
	}
}else{
	exitJson(1,"缺少必要的参数");
}



?>