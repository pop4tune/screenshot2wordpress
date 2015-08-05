<?php  

include "../wp-config.php";

$categories = get_categories(array(
	'type'                     => 'ticket',
	'child_of'                 => 0,
	'parent'                   => '',
	'orderby'                  => 'name',
	'order'                    => 'ASC',
	'hide_empty'               => 0,
	'hierarchical'             => 1,
	'number'                   => '',
	'taxonomy'                 => 'website-ticket',
	'pad_counts'               => false
));
$users = get_users();
//print_r($_POST);
if(isset($_POST['userid'])) {

	$title=$_POST["title"]; // $title variable will insert your blog title 
	$body=$_POST["body"]; // $body will insert your blog content (article content) 
	$username = $_POST["userid"];//postnikov@gmail.com"; 
	//$password = $_POST["password"]; 

  //define('UPLOAD_DIR', '');
	  $img = $_POST['img'];
  	$img = str_replace('data:image/png;base64,', '', $img);
  	$img = str_replace(' ', '+', $img);
  	$data = base64_decode($img);
  	$file = "images/screenshot_" . uniqid() . '.png';
  	$success = file_put_contents($file, $data);

  	$body = $body. "<br><br><a href='/rpc/".$file."' target='_blank'>See screenshot</a>";

/*	$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_NAME);
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
	}*/


	$my_post = array(
		'post_type' => 'ticket',
		'post_title' => $title,
		'post_content' => $body,
		'post_status' => 'publish',
		'post_author' => $username,
	);
	$ticket_id = wp_insert_post($my_post);

	$tk_term = get_term_by('slug', $_POST['website'], 'website-ticket');
	$tid = $tk_term->term_id;
	update_post_meta($ticket_id, '_wpas_field_name', $tk_term->name, '');
	update_post_meta($ticket_id, '_wpas_field_website', get_metadata('taxonomy', $tid, 'cmsfrm', true), '');
	update_post_meta($ticket_id, '_wpas_field_cms_admin_link', get_metadata('taxonomy', $tid, 'linkadmin', true), '');
	update_post_meta($ticket_id, '_wpas_field_cms_login', get_metadata('taxonomy', $tid, 'login', true), '');
	update_post_meta($ticket_id, '_wpas_field_cms_pass', get_metadata('taxonomy', $tid, 'password', true), '');
	update_post_meta($ticket_id, '_wpas_field_ftp_server', get_metadata('taxonomy', $tid, 'frpserver', true), '');
	update_post_meta($ticket_id, '_wpas_field_ftp_login', get_metadata('taxonomy', $tid, 'ftplogin', true), '');
	update_post_meta($ticket_id, '_wpas_field_ftp_pass', get_metadata('taxonomy', $tid, 'ftppassword', true), '');
	update_post_meta($ticket_id, '_wpas_field_ip', get_metadata('taxonomy', $tid, 'ipaddr', true), '');

	wp_set_object_terms( $ticket_id, array($_POST['website']), 'website-ticket', true );
	print_r("SUCCESS:".$ticket_id);
	die();
}

?>
<div style="padding:20px 100px;">
	<?php
	if(is_numeric($ticket_id)) {
		print_r("<div class='mess'>Ticket ".$ticket_id." was created</div>");
	}
	?>
	<form method="post" action="http://codingninjas.co/rpc/submit-ticket.php" id="submit-ticket" enctype="multipart/form-data">
		<div style="margin-bottom:30px;">
			<label>Subject</label><br/>
			<input name="title" type="text" class="wpas-form-control" value="" placeholder="What is this about?">
		</div>

		<div style="margin-bottom:30px;">
			<label>User</label><br/>
			<select name="user" class="wpas-form-control" required="required">
				<?php foreach($users as $user) { print_r("<option value='".$user->data->ID."'>".$user->data->user_login."</option>"); } ?>
			</select>
		</div>

		<div style="margin-bottom:30px;">
			<label>Website</label><br/>
			<select name="website" class="wpas-form-control" required="required">
				<option value="none">Choose website</option>
				<?php foreach($categories as $cat) { print_r("<option value='".$cat->slug."' data-cat->".$cat->name."</option>"); } ?>
			</select>
		</div>

		<div style="margin-bottom:30px;">
			<label>Description</label><br/>
			<textarea class="wpas-form-control wpas-wysiwyg wp-editor-area" rows="10" tabindex="2" cols="40" name="message"></textarea>
		</div>

		<div style="margin-bottom:30px;">
			<label for="wpas-file-upload">Attachments</label>
			<br>
			<input type="hidden" id="wpas-filepicker-data" name="wpas-filepicker-data">
			<a id="wpas-filepicker-upload" href="javascript:void(0);" data-maxfiles="This site only allows you to upload 2 files at a time">Click to upload file(s)</a>
			<ul class="wpas-attachments-list" style="display: none;"></ul>
			<p class="wpas-help-block">You can upload up to 3 files of the following types: <code>.jpg</code>, <code>.jpeg</code>, <code>.png</code>, <code>.gif</code>, <code>.pdf</code>, <code>.doc</code>, <code>.docx</code>, <code>.ppt</code>, <code>.pptx</code>, <code>.pps</code>, <code>.ppsx</code>, <code>.odt</code>, <code>.xls</code>, <code>.xlsx</code>, <code>.mp3</code>, <code>.m4a</code>, <code>.ogg</code>, <code>.wav</code>, <code>.mp4</code>, <code>.m4v</code>, <code>.mov</code>, <code>.wmv</code>, <code>.avi</code>, <code>.mpg</code>, <code>.ogv</code>, <code>.3gp</code>, <code>.3g2</code>, <code>.zip</code></p>
		</div>

		<input type="submit" name="submit" value="Submit task" />
	</form>
</div>

<style type="text/css">
	label {
		color: rgba(0, 0, 0, 0.7);
		font-family: Lato;
		font-size: 17px;
		font-weight: 700;
		margin-bottom: 5px;
		max-width: 100%;
	}
	input, textarea, select {
		background-color: #fff;
		background-image: none;
		border: 1px solid #ccc;
		box-shadow: 0 1px 1px rgba(0, 0, 0, 0.075) inset;
		color: #555;
		display: block;
		font-size: 14px;
		height: 34px;
		line-height: 1.42857;
		padding: 6px 12px;
		transition: border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s;
		width: 100%;
	}
	textarea {
		height:102px;
	}
	.mess {
	    border: 1px solid green;
	    width: 100%;
	    height: 35px;
	    padding: 0px 5px;
	    margin: 10px;
	    line-height: 2;
	}
</style>