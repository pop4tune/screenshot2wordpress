<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

require('xmlrpc-3.0.1/lib/xmlrpc.inc');

$globalerr = null;

$xmlrpcurl = 'http://codingninjas.co/xmlrpc.php';
$username = $_POST["user"];//test
$password = $_POST["password"]; //"test"

//ocalhost -u fundamit_wo0805 --password=LyFt1q7HEQug -D fundamit_wo0805
$servername = "localhost";
$dbusername = "fundamit_wo0805";
$dbpassword = "LyFt1q7HEQug";
$dbname = "fundamit_wo0805";


function wordpress_get_user_info($xmlrpcurl, $username, $password, $proxyipports = ""){
	global $globalerr;
	$client = new xmlrpc_client($xmlrpcurl);
    $client->setSSLVerifyPeer(false);
	$params[] = new xmlrpcval("deprecated");
	$params[] = new xmlrpcval($username);
	$params[] = new xmlrpcval($password);
	$msg = new xmlrpcmsg("blogger.getUserInfo",$params);
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

function wordpress_get_options($xmlrpcurl, $username, $password, $blogid = 0, $proxyipports = ""){
        global $globalerr;
        $client = new xmlrpc_client($xmlrpcurl);
        $client->setSSLVerifyPeer(false);
        $params[] = new xmlrpcval($blogid);
        $params[] = new xmlrpcval($username);
        $params[] = new xmlrpcval($password);
        $msg = new xmlrpcmsg("wp.getOptions",$params);
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

//$pages = wordpress_get_user_info($xmlrpcurl, $username, $password);
$pages = wordpress_get_options($xmlrpcurl, $username, $password);
if($pages == false){
    echo $globalerr."\n";
    die();
} else {
	// Create connection
	$conn = new mysqli($servername, $dbusername, $dbpassword, $dbname);
	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 
	$sql = "select * from wp_jncg_users where user_login='".$username."'";
	$result = $conn->query($sql);
	//print_r($result);

	if ($result->num_rows > 0) {
	    // output data of each row
	    while($row = $result->fetch_assoc()) {
	        $userid = $row["ID"];
	    }
	} else {
	    echo "no user";
	}
	$sql1 = "select * from wp_jncg_terms where wp_jncg_terms.term_id in (select taxonomy_id from wp_jncg_taxonomymeta where meta_key='userid' and meta_value='". $userid ."')";
	//echo $sql1;

	$result = $conn->query($sql1);
	$options = "";
	if ($result->num_rows > 0) {
	    // output data of each row
	    while($row = $result->fetch_assoc()) {
	        $options = $options . $row["name"] . "||";
	    }
	} else {
	    echo "no taxonomies";
	}
	$conn->close();

	print_r("SUCCESS:". $userid . ":::" . $options);
}
?>