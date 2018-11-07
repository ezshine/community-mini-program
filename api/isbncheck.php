<?php
// ini_set('display_errors',1); //错误信息 
// ini_set('display_startup_errors',1); //php启动错误信息 
// error_reporting(-1); 
header("Content-type:text/html;charset=utf-8");

$postdata=file_get_contents("php://input");
$jsondata=json_decode($postdata);

$isbn=$jsondata->isbn;
$token=$jsondata->token;

session_start();

if($_SESSION['token']!=$token){
	exitJson(1,'非法请求，请重新登录');
}

function connDB($dbConf)
{
	$conn = mysql_connect($dbConf['host'], $dbConf['user'], $dbConf['pass'], true);

	if ($conn) {
		mysql_query('set names \'utf8\';', $conn);
		return $conn;
	}
	return false;
}

function getDb()
{
	$db1 = array(
		'host' => '10.165.35.203:3306',
		'user' => 'jnsjnsjns',
		'pass' => '67wXpxVCK329ZsK6',
		'DB_CHARSET'=> 'utf8mb4'
	);
	
	$db = connDB($db1);
	
	mysql_select_db('sqbm_db', $db);

	mysql_query('set names \'utf8mb4\'', $db);
	
	return $db;
}
function exitJson($err, $msg , $result)
{
	echo json_encode(array('err'=>$err, 'msg'=>$msg , 'result'=>$result));
	exit();
}

$db = getDb();
$sql="SELECT * from ISBN where isbn='$isbn' LIMIT 1";
$res=mysql_query($sql,$db) or die(mysql_error());

if(mysql_num_rows($res)<=0){
	$opt=array('http'=>array('header'=>"Referer: https://api.douban.com"));   
   	$context=stream_context_create($opt);   
	   
	$jsonfile = file_get_contents('https://api.douban.com/v2/book/isbn/'.$isbn,false, $context); 
	$doubanjson=json_decode($jsonfile);
	if($doubanjson->title){
		$isbn=$doubanjson->isbn13;
		$title=str_replace("'","''",$doubanjson->title);
		$subtitle=str_replace("'","''",$doubanjson->subtitle);
		$author=join(",",$doubanjson->author);
		$coverurl=$doubanjson->images->large;
		$publisher=str_replace("'","''",$doubanjson->publisher);
		$pubdate=$doubanjson->pubdate;
		$pages=$doubanjson->pages;
		$price=$doubanjson->price;
		$bookdesc=str_replace("'","''",$doubanjson->summary);
		$authordesc=str_replace("'","''",$doubanjson->author_intro);

		$tags=array();
		for ($i=0; $i < count($doubanjson->tags); $i++) { 
			$tags[]=$doubanjson->tags[$i]->name;
		}
		$tagsStr=join(",",$tags);

		$coverLocalUrl="covers/".$isbn.".jpg";
		file_put_contents("../../ISBN/".$coverLocalUrl, file_get_contents($coverurl));

		$sql="INSERT into ISBN (isbn,coverurl,title,subtitle,author,publisher,pubdate,pages,price,bookdesc,authordesc,tags) values('$isbn','$coverLocalUrl','$title','$subtitle','$author','$publisher','$pubdate','$pages','$price','$bookdesc','$authordesc','$tagsStr')";
		$res=mysql_query($sql,$db) or die(mysql_error());

		exitJson(0,"",array('isbn'=>$isbn,'title'=>$title,'coverurl'=>"https://jnsii.com/ISBN/".$coverLocalUrl,'subtitle'=>$subtitle,'author'=>$author,'publisher'=>$publisher,'bookdesc'=>$bookdesc));
	}else{
		exitJson(1,"没有找到相应的书籍");
	}
}else{
	$row = mysql_fetch_assoc($res);
	$isbn=$row['isbn'];
	$title=$row['title'];
	$subtitle=$row['subtitle'];
	$author=$row['author'];
	$coverurl=$row['coverurl'];
	$publisher=$row['publisher'];
	$bookdesc=$row['bookdesc'];
	exitJson(0,"",array('isbn'=>$isbn,'title'=>$title,'coverurl'=>"https://jnsii.com/ISBN/".$coverurl,'subtitle'=>$subtitle,'author'=>$author,'publisher'=>$publisher,'bookdesc'=>$bookdesc));
}

// echo 'http://douban.com/isbn/'.$isbn.'/';
// phpQuery::newDocumentFile('http://douban.com/isbn/'.$isbn.'/'); 
// echo pq("#wrapper")->html(); 


?>