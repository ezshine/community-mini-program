<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';

function getMillisecond() {
	list($t1, $t2) = explode(' ', microtime());
	return (float)sprintf('%.0f',(floatval($t1)+floatval($t2))*1000);
}

$articleid = isset($_POST['articleid']) ? $_POST['articleid'] : '';
$curindex = isset($_POST['curindex']) ? $_POST['curindex'] : '';
$totalcount = isset($_POST['totalcount']) ? $_POST['totalcount'] : '';
$token = isset($_POST['token']) ? $_POST['token'] : '';

session_start();
if($_SESSION['token']!=$token){
	exitJson(2,'非法请求，请重新登录');
}
$uid=$_SESSION['openid'];

$lastsession=$_SESSION['uploadstr'];
unset($_SESSION['uploadstr']);
if($articleid!="" && $curindex!="" && $totalcount!=""){
	$now=time();
	$dirPath="../upload/".date('Y', $now)."/".date('m-d', $now);

	$fileName=getMillisecond();
	$filePath=$dirPath."/".$fileName.".jpg";

	if (!is_dir($dirPath)){  
		$res=mkdir(iconv("UTF-8", "GBK", $dirPath),0777,true); 
	}

	if(move_uploaded_file($_FILES["picture"]["tmp_name"],$filePath)){
		
	}
	

	if(intval($curindex)>=intval($totalcount)){
		$_SESSION['uploadstr']=$lastsession.$fileName;
		$arr_str=$_SESSION['uploadstr'];
		unset($_SESSION[$articleid]);
		unset($_SESSION['uploadstr']);

		$db = getDb();
		$sql = "update `".getTablePrefix()."_articles` set pics='$arr_str' where authorid='$uid' and id='$articleid' ";
		mysql_query($sql, $db) or die(mysql_error());

		exitJson(0,'上传成功',$arr_str);
	}else{
		$_SESSION['uploadstr']=$lastsession.$fileName.",";
		$arr_str=$_SESSION['uploadstr'];
		unset($_SESSION[$articleid]);

		exitJson(0,'上传成功',$arr_str);
	}
	
}else{
	exitJson(1,'缺少必要的参数');
}



?>