<?php
header("Content-type:text/html;charset=utf-8");
include_once 'mysql.php';

function isDitributionMode($buildVersion){
	$buildVersion=intval($buildVersion);
	if($buildVersion>0){
		return $buildVersion<=1008;
	}else{
		return true;
	}
}

function textFilter($text){
	$replace = array(
	'共产党', '国民党','习近平','温家宝','江泽民','毛泽东','华国锋','邓小平','政府','上访','信访','法轮功','地下党','李克强','赵紫阳','朱镕基','薄熙来','逼','鸡巴','操你','操他','操她','操它','干你');
	return str_replace($replace, '**', $text);
}

function getFeedCount($openid){
	$db = getDb();
	$sql = "select count(*) from ".getTablePrefix()."_articles where authorid = '$openid'";
	$res=mysql_query($sql,$db) or die(mysql_error());
	$row=mysql_fetch_row($res);
	return $row[0];
}

function getBookDetail($isbn){
	$db = getDb();
	$sql = "select * from ISBN where isbn = '$isbn' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row = mysql_fetch_assoc($res);
	$row['coverurl']='https://jnsii.com/ISBN/'.$row['coverurl'];

	return $row;
}

function addCoinHistory($type,$value,$msg,$touid=''){
	$uid=$_SESSION['openid'];
	if($touid!='')$uid=$touid;

	$userinfo=getUserSimpleInfo($uid);
	if($userinfo['coin']+$value<0){
		return false;
	}

	$db = getDb();
	$now=time();
	$sql = "insert into ".getTablePrefix()."_coinhistory (`type`,`value`,`msg`,createdate,ownerid) values('$type','$value','$msg','$now','$uid')";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$sql = "update ".getTablePrefix()."_members set coin=coin+$value where `openid`='$uid' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	return true;
}

function getUserSimpleInfo($openid){
	$db = getDb();
	$sql = "select `nickname`,`headimg`,`slogan`,`type`,`openid`,`joindate`,`lastlogin`,`wechatid`,`mobile`,`qq`,`coin` from ".getTablePrefix()."_members where openid = '$openid' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row = mysql_fetch_assoc($res);

	$row['lastlogin']= date('Y-m-d H:i:s', $row['lastlogin']);
	$row['joindate']= date('Y-m-d H:i:s', $row['joindate']);
	
	return $row;
}

function getUserInfo($openid){
	$db = getDb();
	$sql = "select * from ".getTablePrefix()."_members where openid = '$openid' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row = mysql_fetch_assoc($res);

	$tags_arr=$row['tags']==""?array():explode(",", $row['tags']);

	$row['lastlogin']= date('Y-m-d H:i:s', $row['lastlogin']);
	$row['joindate']= date('Y-m-d H:i:s', $row['joindate']);
	$row['showmedal']=$row['showmedal']=="1";
	$row['showweek']=$row['showweek']=="1";
	$row['showquan']=$row['showquan']=="1";
	$row['tags']=$tags_arr;
	$row['totalfeed']=getFeedCount($openid);

	return $row;
}

function getCommentById($commentid){
	$db = getDb();
	$sql = "select * from ".getTablePrefix()."_comment where id = '$commentid' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$row = mysql_fetch_assoc($res);

	$row['authorInfo']=getUserSimpleInfo($row['authorid']);

	return $row;
}

function getCommentList($articleid,$page=0,$limit=10,$sortby='asc'){
	$db = getDb();
	$sql = "select * from ".getTablePrefix()."_comment where articleid = '$articleid' and deleted=0 order by createdate $sortby LIMIT ".$page*$limit.",$limit";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$list=[];
	while ($row = mysql_fetch_assoc($res)) {
		$item = array(
			'createdate'=> date('Y-m-d H:i:s', $row['createdate']),
			'id'=>$row['id'],
			'replyid'=>$row['replyid'],
			'authorInfo'=>getUserSimpleInfo($row['authorid']),
			'text'=>$row['text']
		);

		if($row['replyid'])$item['reply']=getCommentById($row['replyid']);

		$list[]=$item;
	}

	return $list;
}

function getLikeList($articleid,$page=0,$limit=10,$sortby='asc'){
	$db = getDb();
	$sql = "select * from ".getTablePrefix()."_like where articleid = '$articleid' order by createdate $sortby LIMIT ".$page*$limit.",$limit";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$list=[];
	while ($row = mysql_fetch_assoc($res)) {
		$item = array(
			'createdate'=> date('Y-m-d H:i:s', $row['createdate']),
			'id'=>$row['id'],
			'authorInfo'=>getUserSimpleInfo($row['uid'])
		);

		$list[]=$item;
	}

	return $list;
}

function getArticleById($articleid){
	$db = getDb();
	$sql = "select * from ".getTablePrefix()."_articles where id = '$articleid' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());
	$row = mysql_fetch_assoc($res);

	return $row;
}

function parseArticleSimpleItem($row){
	$pics=[];

	if($row['pics']!=''){
		$pics_arr=explode(",", $row['pics']);
		for ($i=0; $i < count($pics_arr); $i++) { 
			array_push($pics, date('Y', $row['createdate'])."/".date('m-d', $row['createdate'])."/".$pics_arr[$i]);
		}
	}


	$text=$row['text'];
	$vids=array();
	$pa = '%http://(.*?).mp4%si';

  	$pre_result=preg_match_all($pa,$text,$match);
	if($pre_result){
		$vids=$match[0];
	}
	$text=preg_replace($pa, '', $text);

	if($row['masked']==1)$row['authorid']="spotlight";
	
	$item = array(
		'id'=>$row['id'],
		'createdate'=> date('Y-m-d H:i:s', $row['createdate']),
		'text'=>$text,
		'title'=>$row['title'],
		'gps'=>$row['gps'],
		'gpsaddr'=>$row['gpsaddr'],
		'gpscity'=>$row['gpscity'],
		'pics'=>$pics,
		'vids'=>$vids,
		'authorid'=>$row['authorid'],
		'authorInfo'=>getUserSimpleInfo($row['authorid']),
		'likecount'=>getLikeCount($row['id']),
		'viewcount'=>$row['viewcount'],
		'commentcount'=>getCommentCount($row['id']),
		'disablecomment'=>intval($row['disablecomment'])
	);

	return $item;
}

function parseArticleItem($row){
	$uid=$_SESSION['openid'];
	$pics=[];

	if($row['pics']!=''){
		$pics_arr=explode(",", $row['pics']);
		for ($i=0; $i < count($pics_arr); $i++) { 
			array_push($pics, date('Y', $row['createdate'])."/".date('m-d', $row['createdate'])."/".$pics_arr[$i]);
		}
	}


	$text=$row['text'];
	$vids=array();
	$pa = '%http://(.*?).mp4%si';

  	$pre_result=preg_match_all($pa,$text,$match);
	if($pre_result){
		$vids=$match[0];
	}
	$text=preg_replace($pa, '', $text);
	
	//if($row['masked']==1)$row['authorid']="spotlight";
	
	$item = array(
		'id'=>$row['id'],
		'createdate'=> date('Y-m-d H:i:s', $row['createdate']),
		'text'=>$text,
		'title'=>$row['title'],
		'gps'=>$row['gps'],
		'gpsaddr'=>$row['gpsaddr'],
		'gpscity'=>$row['gpscity'],
		'pics'=>$pics,
		'vids'=>$vids,
		'authorid'=>$row['authorid'],
		'authorInfo'=>getUserSimpleInfo($row['authorid']),
		'isliked'=>isLiked($uid,$row['id']),
		'likecount'=>getLikeCount($row['id']),
		'viewcount'=>$row['viewcount'],
		'commentcount'=>getCommentCount($row['id']),
		//'commentlist'=>getCommentList($row['id'],0,20),
		'disablecomment'=>intval($row['disablecomment'])
	);

	return $item;
}

function parseMarketItem($row){
	$uid=$_SESSION['openid'];
	$pics=[];

	if($row['pics']!=''){
		$pics_arr=explode(",", $row['pics']);
		for ($i=0; $i < count($pics_arr); $i++) { 
			array_push($pics, date('Y', $row['createdate'])."/".date('m-d', $row['createdate'])."/".$pics_arr[$i]);
		}
	}
	
	$item = array(
		'id'=>$row['id'],
		'authorid'=>$row['authorid'],
		'createdate'=> date('Y-m-d H:i:s', $row['createdate']),
		'pics'=>$pics,
		'price'=>intval($row['price'])/100,
		'unit'=>$row['unit'],
		'exchangecoin'=>$row['exchangecoin'],
		'exchangeprice'=>$row['exchangeprice'],
		'exchangedesc'=>$row['exchangedesc'],
		'title'=>$row['title'],
		'viewcount'=>$row['viewcount'],
		'likecount'=>getLikeCount($row['id'])
	);

	return $item;
}

function getVoteCount($articleid,$votevalue){
	$db = getDb();
	$sql = "select count(*) from ".getTablePrefix()."_vote where articleid = '$articleid' and votevalue=$votevalue";
	$res=mysql_query($sql,$db) or die(mysql_error());
	$row=mysql_fetch_row($res);
	return $row[0];
}

function parsePKItem($row){
	
	$item = array(
		'id'=>$row['id'],
		'authorid'=>$row['authorid'],
		'createdate'=> date('Y-m-d H:i:s', $row['createdate']),
		'title'=>$row['title'],
		'viewcount'=>$row['viewcount'],
		'supportcount'=>intval(getVoteCount($row['id'],2)),
		'opposecount'=>intval(getVoteCount($row['id'],1))
	);

	return $item;
}

function getTotalMemberCount(){
	$db = getDb();
	$sql = "select count(*) from ".getTablePrefix()."_members";
	$res=mysql_query($sql,$db) or die(mysql_error());
	$row=mysql_fetch_row($res);
	return $row[0];
}

function getCommentCount($articleid){
	$db = getDb();
	$sql = "select count(*) from ".getTablePrefix()."_comment where articleid = '$articleid' and deleted=0";
	$res=mysql_query($sql,$db) or die(mysql_error());
	$row=mysql_fetch_row($res);
	return $row[0];
}

function getLikeCount($articleid){
	$db = getDb();
	$sql = "select count(*) from ".getTablePrefix()."_like where articleid = '$articleid'";
	$res=mysql_query($sql,$db) or die(mysql_error());
	$row=mysql_fetch_row($res);
	return $row[0];
}

function isLiked($uid,$articleid){
	$db = getDb();
	$sql = "select `id` from ".getTablePrefix()."_like where uid = '$uid' and articleid='$articleid' LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());

	if(mysql_num_rows($res)<=0){
		return false;
	}else{
		return true;
	}
}

function getFormId($uid){
	$db = getDb();
	$time=strtotime('-7 day');
	$sql = "select * from ".getTablePrefix()."_formids where ownerid = '$uid' and used=0 and createdate>$time order by createdate asc LIMIT 1";
	$res=mysql_query($sql,$db) or die(mysql_error());
	if(mysql_num_rows($res)<=0){
		return false;
	}
	$row = mysql_fetch_assoc($res);
	return $row['formid'];
}

function deleteFormId($formid){
	$db = getDb();
	$sql="delete from ".getTablePrefix()."_formids where formid='$formid'";
	$res=mysql_query($sql,$db) or die(mysql_error());
}

function httpGet($url) {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_TIMEOUT, 500);
    curl_setopt($curl, CURLOPT_URL, $url);

    $res = curl_exec($curl);
    curl_close($curl);

    return $res;
  }

function getAccessToken(){
    $data = json_decode(file_get_contents("access_token.json"));
    if ($data->expire_time < time()) {
      $url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=".getAppId()."&secret=".getAppSecret();
      $res = json_decode(httpGet($url));
      $access_token = $res->access_token;
      if ($access_token) {
        $data->expire_time = time() + 7000;
        $data->access_token = $access_token;
        $fp = fopen("access_token.json", "w");
        fwrite($fp, json_encode($data));
        fclose($fp);
      }
    } else {
      $access_token = $data->access_token;
    }
    return $access_token;
}

//发送模板消息：fsockopen模式
function sendNotice($uid,$templateid,$data,$turl,$color=''){
    $formid=getFormId($uid);
	if(!$formid){
		return;
	}

	$template = array(
	    'touser' => $uid,
	    'template_id' => $templateid,
	    'page' => $turl,
	    'form_id'=>$formid,
	    'color'=>$color, 
	    'data' => $data
	);
	
    $access_token = getAccessToken();
    
    $params = json_encode($template);
    $start_time = microtime(true);

	$fp = fsockopen('api.weixin.qq.com', 80, $error, $errstr, 1);
	$http = "POST /cgi-bin/message/wxopen/template/send?access_token={$access_token} HTTP/1.1\r\nHost: api.weixin.qq.com\r\nContent-type: application/x-www-form-urlencoded\r\nContent-Length: " . strlen($params) . "\r\nConnection:close\r\n\r\n$params\r\n\r\n";
	fwrite($fp, $http);
	fclose($fp);

	deleteFormId($formid);
}

function sendUnreadNoticeToAll($text,$color='#ff0000',$page='pages/billboard/index'){
	$db = getDb();
	$sql="select ownerid,formid from ".getTablePrefix()."_formids where id in (select min(id) from ".getTablePrefix()."_formids group by ownerid)";
	$res=mysql_query($sql,$db) or die(mysql_error());

	$data=array(
	        'keyword1'=>array('value'=>$text,'color'=>$color),
	        'keyword2'=>array('value'=>date("Y-m-d H:i:s",time()),'color'=>'#666666'),
	        'keyword3'=>array('value'=>'金隅滨和园便民服务','color'=>'#666666'),
	    );

	$sended=0;
	while ($row = mysql_fetch_assoc($res)) {
		//if($row['ownerid']=="oHSAe0fdixzRZUPBFCSwCPjos2R8"){
			sendNotice($row['ownerid'],"FSh7ONdmR2FbefvtVC0eSJ5O1iF6MVT38xDNe_SSS_w",$data,$page);
			$sended+=1;
		//}
	}

	return $sended;
}

function request_post($url = '', $param = '') {
    if (empty($url) || empty($param)) {
        return false;
    }
    
    $postUrl = $url;
    $curlPost = $param;
    $ch = curl_init();//初始化curl
    curl_setopt($ch, CURLOPT_URL,$postUrl);//抓取指定网页
    curl_setopt($ch, CURLOPT_HEADER, 0);//设置header
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//要求结果为字符串且输出到屏幕上
    curl_setopt($ch, CURLOPT_POST, 1);//post提交方式
    curl_setopt($ch, CURLOPT_POSTFIELDS, $curlPost);
    $data = curl_exec($ch);//运行curl
    curl_close($ch);
    
    return $data;
}

?>