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
	$xianhao[]='5,0限行';
    $xianhao[]= '1,6限行';
    $xianhao[]= '2,7限行';
    $xianhao[]= '3,8限行';
    $xianhao[]= '4,9限行';
    $xianhao[]= '不限行';
    $xianhao[]= '不限行';

    // $tNum=getXHNumber($tDate);

    $newarr=array();
    for ($i=0; $i <5; $i++) { 
    	# code...
    	// $nNum=getXHNumber();
    	// $newarr[]=getXHNumber(strtotime(date('Y-m-d')),strtotime('2014-04-14'));
    	$newarr[]=$xianhao[getXHNumber(strtotime('+'.$i.' day'),strtotime('2014-04-14'))-1];
    }

    // $subset = array_slice($xianhao, $tNum+1);  

    // $newarr=array_merge($subset,$xianhao);

    return $newarr;
}

// $weather_json=file_get_contents('../weathercached/weather.json');
// if($weather_json){
// 	$weather=json_decode($weather_json,true);

// 	// echo $weather['realtime']['date']."<br/>";
// 	// echo date("Y-m-d")."<br/>";
// 	if($weather['realtime']['date']==strtotime(date("Y-m-d"))){
// 	 	// echo "不更新";
// 	}else{
// 		// echo "要更新";
// 		$weather=getNewWeather();
// 	}
// }else{
// 	$weather=getNewWeather();
// }
// exit();
$weather=getNewWeather();
$now=date('Y-m-d');

$db = getDb();
$sql = "select * from ".getTablePrefix()."_members order by lastlogin desc LIMIT 7";
$res=mysql_query($sql,$db) or die(mysql_error());


$loginlist = array();
while ($row = mysql_fetch_assoc($res)) {
	
	$loginlist[] = getUserSimpleInfo($row['openid']);
}

$sql = "select * from ".getTablePrefix()."_articles where `type` = 99 order by createdate desc LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());

$billboardlist = array();
while ($row = mysql_fetch_assoc($res)) {
	$billboardlist[] = array(
		'id'=>$row['id'],
		'createdate'=> date('Y-m-d H:i:s', $row['createdate']),
		'title'=>$row['title'],
		'text'=>$row['text']
	);
}


$newtopics=array();

$sql = "select * from ".getTablePrefix()."_articles where `type` <99 and deleted=0 order by updatetime desc,createdate desc LIMIT 9";
$res=mysql_query($sql,$db) or die(mysql_error());

while ($row = mysql_fetch_assoc($res)) {

    $item=parseArticleSimpleItem($row);

    if(count($item['vids'])>0)$item['text']='[视频]'.$item['text'];

    $item['text']=mb_substr($item['text'], 0,60,"UTF-8");
    if(mb_strlen($item['text'],"UTF-8")>=60)$item['text']=$item['text']."...";

    $newtopics[]=$item;
}


$newgoods=array();

$sql = "select * from ".getTablePrefix()."_articles where `type` =101 and deleted=0 order by updatetime desc,createdate desc LIMIT 3";
$res=mysql_query($sql,$db) or die(mysql_error());

while ($row = mysql_fetch_assoc($res)) {

    $item=parseMarketItem($row);

    $newgoods[]=$item;
}

// $newcomments=array();

// $sql = "select * from ".getTablePrefix()."_comment where deleted=0 order by createdate desc LIMIT 5";
// $res=mysql_query($sql,$db) or die(mysql_error());

// while ($row = mysql_fetch_assoc($res)) {

//     $item=getCommentById($row['id']);

//     $newcomments[]=$item;
// }

$newvotes=array();
$sql = "select * from ".getTablePrefix()."_articles where `type`=102 and deleted=0 and TO_DAYS(NOW()) - TO_DAYS(createdate)<=30 order by createdate desc LIMIT 3";
$res=mysql_query($sql,$db) or die(mysql_error());

while ($row = mysql_fetch_assoc($res)) {

    $item=parsePKItem($row);

    $newvotes[]=$item;
}

$topbanner=array(
	array('picurl' => 'http://jnsii.com/jybhy/images/banner_yoga.gif','navigateto'=>'/pages/talent/goodsdetail?goodsid=1194')
    );


$fastnav=array(
    array("title"=>"一键呼叫","page"=>"/pages/fuwu/index","icon"=>"icon-remind_fill"),
    array("title"=>"积分中心","page"=>"/pages/coincenter/index","icon"=>"icon-transaction_fill"),
    array("title"=>"车位路况","page"=>"/pages/livecam/index","icon"=>"icon-live_fill","badge"=>"恢复"),
    array("title"=>"接龙拼团","page"=>"/pages/tuan/index","icon"=>"icon-share_fill","badge"=>""),
    array("title"=>"餐饮外卖","page"=>"/pages/fuwu/index?type=2","icon"=>"icon-meishi"),
    array("title"=>"快递服务","page"=>"https://jnsii.com/jybhy/app/express/","type"=>"url","icon"=>"icon-mail_fill","badge"=>"专享"),
    array("title"=>"民意投票","page"=>"/pages/pk/index","icon"=>"icon-pk"),
    array("title"=>"微信步数","page"=>"/pages/pk/werun","icon"=>"icon-bushu"),
    array("title"=>"手机电视","page"=>"https://jnsii.com/jybhy/app/livetv/","type"=>"url","icon"=>"icon-live"),
    array("title"=>"友邻市集","page"=>"/pages/talent/list","icon"=>"icon-shop_fill"),
    array("title"=>"萌宠乐园","page"=>"/pages/forum/topiclist?type=2&title=萌宠乐园","icon"=>"icon-chongwu"),
    array("title"=>"房屋租售","page"=>"/pages/forum/topiclist?type=3&title=房屋租赁","icon"=>"icon-homepage_fill"),
    array("title"=>"汽车之家","page"=>"/pages/forum/topiclist?type=7&title=汽车之家","icon"=>"icon-che"),
    array("title"=>"美食烹饪","page"=>"/pages/forum/topiclist?type=6&title=美食烹饪","icon"=>"icon-meishi2"),
    array("title"=>"健康养生","page"=>"/pages/forum/topiclist?type=5&title=健康养生","icon"=>"icon-jiankang"),
    array("title"=>"匿名曝光","page"=>"/pages/forum/topiclist?type=8&title=匿名曝光","icon"=>"icon-mianju"),
    array("title"=>"社区书屋","page"=>"/pages/book/index","icon"=>"icon-shu"),
    array("title"=>"版务区","page"=>"/pages/forum/topiclist?type=9&title=建议投诉","icon"=>"icon-warning_fill"),
    );

if(!isDitributionMode($jsondata->bv)){
    $topbanner=array(
    // array('picurl' => 'http://jnsii.com/jybhy/images/bbs_banner.jpg','navigateto'=>'/pages/forum/detail?topicid=291'),
    // array('picurl' => 'http://jnsii.com/jybhy/images/qun_banner.jpg','navigateto'=>'/pages/forum/detail?topicid=369'),
    array('picurl' => 'http://jnsii.com/jybhy/images/bushu_banner.jpg','navigateto'=>'/pages/pk/werun'),
    // array('picurl' => 'http://jnsii.com/jybhy/images/niming_banner.jpg','navigateto'=>'/pages/forum/topiclist?type=8&title=匿名曝光台'),
    // array('picurl' => 'http://jnsii.com/jybhy/images/jifen_banner.jpg','navigateto'=>'/pages/forum/detail?topicid=166')
    );
    $newgoods=false;
    $newvotes=false;
    $newtopics=false;
    $fastnav=array(
    array("title"=>"一键呼叫","page"=>"/pages/fuwu/index","icon"=>"icon-remind_fill"),
    array("title"=>"快递服务","page"=>"https://jnsii.com/jybhy/app/express/","type"=>"url","icon"=>"icon-mail_fill"),
    // array("title"=>"积分中心","page"=>"/pages/coincenter/index","icon"=>"icon-transaction_fill"),
    array("title"=>"车位路况","page"=>"/pages/livecam/index","icon"=>"icon-live_fill","badge"=>"测试"),
    // array("title"=>"友邻市集","page"=>"/pages/talent/index","icon"=>"icon-shop_fill","type"=>"tab"),
    array("title"=>"餐饮外卖","page"=>"/pages/fuwu/index?type=2","icon"=>"icon-meishi","badge"=>"热门"),
    // array("title"=>"房屋租售","page"=>"/pages/forum/topiclist?type=3&title=房屋租赁","icon"=>"icon-homepage_fill"),
    // array("title"=>"民意投票","page"=>"/pages/pk/index","icon"=>"icon-pk"),
    array("title"=>"微信步数","page"=>"/pages/pk/werun","icon"=>"icon-bushu"),
    // array("title"=>"萌宠乐园","page"=>"/pages/forum/topiclist?type=2&title=萌宠乐园","icon"=>"icon-chongwu"),
    // array("title"=>"汽车之家","page"=>"/pages/forum/topiclist?type=7&title=汽车之家","icon"=>"icon-che"),
    // array("title"=>"摄影分享","page"=>"/pages/forum/topiclist?type=1&title=摄影分享","icon"=>"icon-camera_fill"),
    // array("title"=>"美食烹饪","page"=>"/pages/forum/topiclist?type=6&title=美食烹饪","icon"=>"icon-meishi2"),
    // array("title"=>"健康养生","page"=>"/pages/forum/topiclist?type=5&title=健康养生","icon"=>"icon-jiankang"),
    // array("title"=>"匿名曝光","page"=>"/pages/forum/topiclist?type=8&title=匿名曝光","icon"=>"icon-mianju"),
    array("title"=>"社区书屋","page"=>"/pages/book/index","icon"=>"icon-shu"),
    // array("title"=>"版务区","page"=>"/pages/forum/topiclist?type=9&title=建议投诉","icon"=>"icon-warning_fill"),
    );
}

exitJson(0,"",array("fastnavpagecount"=>8,"now"=>$now,"topbanner"=>$topbanner,"fastnav"=>$fastnav,"newgoods"=>$newgoods,"newvotes"=>$newvotes,"xianhao"=>getXianhaoArray(strtotime($now)),"totalmembers"=>getTotalMemberCount(),"weather"=>$weather,"loginlist"=>$loginlist,"billboardlist"=>$billboardlist,"newtopics"=>$newtopics));


?>