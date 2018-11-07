<?php
ini_set('display_errors',1); //错误信息 
ini_set('display_startup_errors',1); //php启动错误信息 
error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';
include_once 'functions.php';
include_once 'sqlutils.php';

function getNewWeather(){
	
	$dataRes = gzdecode(file_get_contents("http://wthrcdn.etouch.cn/weather_mini?citykey=101010100"));
	// $xml_array=simplexml_load_string($dataRes);
	$json = json_decode($dataRes,true);

	// print_r($json);

	// $weather=$json['forecast'];
	// echo $json['forecast'];

	// file_put_contents('../weathercached/weather.json', json_encode($weather,JSON_UNESCAPED_UNICODE));
	return  $json;
}

function getXHNumber($tDate,$sDate) {
	// return $tDate .'-'. $sDate;
    $nDayNum = date('w', $tDate) == 0 ? 7 : date('w', $tDate);
    if ($nDayNum > 5) return $nDayNum;
    $nDiff = ($tDate - $sDate)  / 3600 / 24 / 7 / 13;
    $nDiff = floor($nDiff) % 5;
    $nDayNum = 5 - $nDiff + $nDayNum;
    if ($nDayNum > 5) $nDayNum -= 5;
    return $nDayNum;
}

function getXianhaoArray($tDate){
	$xianhao=array();
	$xianhao[]='5,0限行(节假日不限)';
    $xianhao[]= '1,6限行(节假日不限)';
    $xianhao[]= '2,7限行(节假日不限)';
    $xianhao[]= '3,8限行(节假日不限)';
    $xianhao[]= '4,9限行(节假日不限)';
    $xianhao[]= '不限行';
    $xianhao[]= '不限行';

    $newarr=array();
    for ($i=0; $i <5; $i++) { 
    	$newarr[]=$xianhao[getXHNumber(strtotime('+'.$i.' day'),strtotime('2014-04-14'))-1];
    }

    return $newarr;
}

$db = getDb();

$newtopics="";

$sql = "select * from ".getTablePrefix()."_articles where `type` <99 and deleted=0 order by createdate desc LIMIT 3";
$res=mysql_query($sql,$db) or die(mysql_error());

while ($row = mysql_fetch_assoc($res)) {

    $item=parseArticleSimpleItem($row);

    if(count($item['vids'])>0)$item['text']='[视频]'.$item['text'];

    $item['text']=mb_substr($item['text'], 0,12,"UTF-8");
    if(mb_strlen($item['text'],"UTF-8")>=12)$item['text']=$item['text']."...";

    $newtopics="\r\n\r\n📢".$item['text'].$newtopics;
}

//推广位
$newtopics=$newtopics."\r\n\r\n🎁悦工厂专业瑜伽5节课仅售99元，每节课60分钟";

$now=time();

$weather=getNewWeather();
$xianhao=getXianhaoArray(strtotime($now));

$fengli="";//$weather["data"]["forecast"]["0"]["fengli"]

$text="☀️早上好，今天是".date("m月",$now).$weather["data"]["forecast"]["0"]["date"]."，尾号".$xianhao["0"]."。".$weather["data"]["forecast"]["0"]["type"]."，空气指数：".$weather["data"]["aqi"]."，".$weather["data"]["forecast"]["0"]["high"]."，".$weather["data"]["forecast"]["0"]["low"]."，".$weather["data"]["forecast"]["0"]["fengxiang"].$fengli."。".$weather["data"]["ganmao"].$newtopics;
// print_r($text);
// print_r($xianhao);

$data=array(
    'keyword1'=>array('value'=>$text,'color'=>'#ff5500'),
    'keyword2'=>array('value'=>date("Y-m-d H:i:s",$now),'color'=>'#666666'),
    'keyword3'=>array('value'=>'金隅滨和园便民服务','color'=>'#666666'),
);


$sql="select ownerid,formid from ".getTablePrefix()."_formids where id in (select min(id) from ".getTablePrefix()."_formids group by ownerid)";
$res=mysql_query($sql,$db) or die(mysql_error());

//sendNotice("oHSAe0fdixzRZUPBFCSwCPjos2R8","FSh7ONdmR2FbefvtVC0eSJ5O1iF6MVT38xDNe_SSS_w",$data,'pages/billboard/index');

while ($row = mysql_fetch_assoc($res)) {
	// print_r($row['ownerid']);
	sendNotice($row['ownerid'],"FSh7ONdmR2FbefvtVC0eSJ5O1iF6MVT38xDNe_SSS_w",$data,'pages/billboard/index');
}

?>