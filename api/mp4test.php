<?php

  $str = '公园散步，掠影 http://gslb.miaopai.com/stream/DcC6MNwwLeQW26rIDfFxQl2gBwz-hYm2u~erfw__.mp4 测试 http://gslb.miaopai.com/stream/DcC6MNwwLeQW26rIDfFxQl2gBwz-hYm2u~erfw__.mp4 ';
  $pa = '%http://(.*?).mp4%si';
  $preg_result=preg_match_all($pa,$str,$match);
  echo '<pre>';
  print_r($match);
  echo "<pre>";

  echo preg_replace($pa, '', $str);


 ?>