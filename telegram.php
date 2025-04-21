<?php
/* https://api.telegram.org/bot7606573933:AAFT9V7mfdLDkfedc2tiDRIAWw6JD_PI4aI/getUpdates,
где, XXXXXXXXXXXXXXXXXXXXXXX - токен вашего бота, полученный ранее */

$name = $_POST['username'];
$phone = $_POST['phone'];
$token = "7606573933:AAFT9V7mfdLDkfedc2tiDRIAWw6JD_PI4aI";
$chat_id = "-4693744228";
$arr = array(
  'Имя пользователя: ' => $name,
  'Телефон: ' => $phone,
);


foreach($arr as $key => $value) {
  $txt .= "<b>".$key."</b> ".$value."%0A";
};


$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");


if ($sendToTelegram) {
  header('Location: thank-you.html');
} else {
  echo "Error";
}
?>
