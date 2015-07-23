<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

require('xmlrpc-3.0.1/lib/xmlrpc.inc');

$globalerr = null;

$xmlrpcurl = 'http://codingninjas.co/xmlrpc.php';
$username = 'test';//'postnikov@gmail.com';
$password = 'test';//'11111111';

$charset_encoding = 'utf8';

$titleAA = "Test";
$contentAA = "Hi there!";


function wordpress_new_post($xmlrpcurl, $username, $password, $blogid = 0, $slug = "", $wp_password="", $author_id = "0", $title, $content, $excerpt, $text_more, $keywords, $allowcomments = "0", $allowpings = "0", $pingurls, $categories, $date_created = '', $customfields = '', $publish = "1", $proxyipports = ""){
	global $globalerr;
	$client = new xmlrpc_client($xmlrpcurl);
    $client->setSSLVerifyPeer(false);
    $client->verifypeer = 0;
	$params[] = new xmlrpcval($blogid);
	$params[] = new xmlrpcval($username);
	$params[] = new xmlrpcval($password);
	if($date_created == '') $date_created = date("Ymd\TH:i:s", time());
	$cat = array();
	if($categories != ""){
		if(is_array($categories)){
			foreach($categories as $category){
				if($category != ""){
					$cat[] = new xmlrpcval($category, "string");
				}
			}
		}
		else {
			$cat = array(new xmlrpcval($categories, "string"));
		}
	}
	$cf = array();
	if($customfields != ''){
		if(is_array($customfields)){
			$cf = php_xmlrpc_encode($customfields);
		}
	}
	$rpcstruct= new xmlrpcval(
		array(
			"wp_slug" => new xmlrpcval($slug, "string"),
			"wp_password" => new xmlrpcval($wp_password, "string"),
			"wp_author_id" => new xmlrpcval($author_id, "int"),
			"title" => new xmlrpcval($title, "string"),
			"description" => new xmlrpcval($content, "string"),
			"mt_excerpt" => new xmlrpcval($excerpt, "string"),
			"mt_text_more" => new xmlrpcval($text_more, "string"),
			"mt_keywords" => new xmlrpcval($keywords, "string"),
			"mt_allow_comments" => new xmlrpcval($allowcomments, "int"),
			"mt_allow_pings" => new xmlrpcval($allowpings, "int"),
			"mt_tb_ping_urls" => new xmlrpcval($pingurls, "string"),
			//"categories" => $cat,
			//"custom_fields" => $cf,
			"dateCreated" => new xmlrpcval($date_created, "dateTime.iso8601"),
  		),
		"struct");
	$params[] = $rpcstruct;
	$params[] = new xmlrpcval($publish);
	$msg = new xmlrpcmsg("metaWeblog.newPost",$params);
        if(is_array($proxyipports)){
                $proxyipport = $proxyipports[array_rand($proxyipports)];
        }
        elseif($proxyipports != ""){
                $proxyipport = $proxyipports;
        }
        else {
                $proxyipport = "";
        }
        if($proxyipport != ""){
                if(preg_match("/@/", $proxyipport)){
                        $proxyparts = explode("@", $proxyipport);
                        $proxyauth = explode(":",$proxyparts[0]);
                        $proxyuser = $proxyauth[0];
                        $proxypass = $proxyauth[1];
                        $proxy = explode(":", $proxyparts[1]);
                        $proxyip = $proxy[0];
                        $proxyport = $proxy[1];
                        $client->setProxy($proxyip, $proxyport, $proxyuser, $proxypass);
                }
                else {
                        $proxy = explode(":",$proxyipport);
                        $proxyip = $proxy[0];
                        $proxyport = $proxy[1];
                        $client->setProxy($proxyip, $proxyport);
                }
        }
	$r = $client->send($msg);
	if($r === false){
                $globalerr = "XMLRPC ERROR - Could not send xmlrpc message";
		return(false);
	}
	if (!$r ->faultCode()) {
		return(php_xmlrpc_decode($r->value()));
	}
	else {
                $globalerr = "XMLRPC ERROR - Code: " . htmlspecialchars($r->faultCode()) . " Reason: '" . htmlspecialchars($r->faultString()). "'";
	}
	return(false);
}


echo "1";
try {
$pages = wordpress_new_post($xmlrpcurl, $username, $password,
	0,"",
	"", 
	"2", 
	$titleAA, 
	$contentAA, 
	"", "",
	"","0", "0", "","", '', '',"1","");
echo "!!";
echo $pages;
echo "...";
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}
?>