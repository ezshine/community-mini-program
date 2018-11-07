<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
ini_set('max_execution_time', '0');
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';


$db = getDb();
$sql="select ownerid,formid from ".getTablePrefix()."_formids where id in (select min(id) from ".getTablePrefix()."_formids group by ownerid)";
$res=mysql_query($sql,$db) or die(mysql_error());

$data=array(
        'keyword1'=>array('value'=>"[失物招领]图片中蓝色衣服的邻居，您的苹果手机落在了天天超市。如果您是失主或您认识图中的失主请及时留言回复。",'color'=>'#ff0000'),
        'keyword2'=>array('value'=>date("Y-m-d H:i:s",time()),'color'=>'#666666'),
        'keyword3'=>array('value'=>'滨和园便民服务','color'=>'#666666'),
    );

$sended=0;
while ($row = mysql_fetch_assoc($res)) {
	//if($row['ownerid']=="oHSAe0YeRMlEfQl53aFQ3AsU-85M"){
		sendNotice($row['ownerid'],"FSh7ONdmR2FbefvtVC0eSJ5O1iF6MVT38xDNe_SSS_w",$data,'pages/billboard/index?topicid=1289');
		$sended+=1;
		echo $row['ownerid']." | ".$row['formid']."<br>";
	//}
}

echo $sended." notice send done<br>";




?>