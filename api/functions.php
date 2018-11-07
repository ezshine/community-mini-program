<?php

function getGet($var, $default = '')
{
	return isset($_GET[$var]) ? $_GET[$var] : $default;
}
function getPost($var,$default='')
{
	return isset($_POST[$var]) ? $_POST[$var] : $default;
}

function exitJson($err, $msg , $result)
{
	echo json_encode(array('err'=>$err, 'msg'=>$msg , 'result'=>$result));
	exit();
}
function getToken($len = 32, $md5 = true) {
	# Seed random number generator
	# Only needed for PHP versions prior to 4.2
	mt_srand((double) microtime() * 1000000);
	# Array of characters, adjust as desired
	$chars = array (
		'Q',
		'@',
		'8',
		'y',
		'%',
		'^',
		'5',
		'Z',
		'(',
		'G',
		'_',
		'O',
		'`',
		'S',
		'-',
		'N',
		'<',
		'D',
		'{',
		'}',
		'[',
		']',
		'h',
		';',
		'W',
		'.',
		'/',
		'|',
		':',
		'1',
		'E',
		'L',
		'4',
		'&',
		'6',
		'7',
		'#',
		'9',
		'a',
		'A',
		'b',
		'B',
		'~',
		'C',
		'd',
		'>',
		'e',
		'2',
		'f',
		'P',
		'g',
		')',
		'?',
		'H',
		'i',
		'X',
		'U',
		'J',
		'k',
		'r',
		'l',
		'3',
		't',
		'M',
		'n',
		'=',
		'o',
		'+',
		'p',
		'F',
		'q',
		'!',
		'K',
		'R',
		's',
		'c',
		'm',
		'T',
		'v',
		'j',
		'u',
		'V',
		'w',
		',',
		'x',
		'I',
		'$',
		'Y',
		'z',
		'*'
	);
	# Array indice friendly number of chars;
	$numChars = count($chars) - 1;
	$token = '';
	# Create random token at the specified length
	for ($i = 0; $i < $len; $i++)
		$token .= $chars[mt_rand(0, $numChars)];
	# Should token be run through md5?
	if ($md5) {
		# Number of 32 char chunks
		$chunks = ceil(strlen($token) / 32);
		$md5token = '';
		# Run each chunk through md5
		for ($i = 1; $i <= $chunks; $i++)
			$md5token .= md5(substr($token, $i * 32 - 32, 32));
		# Trim the token
		$token = substr($md5token, 0, $len);
	}
	return $token;
}
function doPost($url, $data){
        $postdata = http_build_query(
            $data
        );
        $opts = array('http' =>
                      array(
                          'method'  => 'POST',
                          'header'  => 'Content-type: application/x-www-form-urlencoded',
                          'content' => $postdata
                      )
        );
        $context = stream_context_create($opts);
        $result = file_get_contents($url, false, $context);
        return $result;
}

?>