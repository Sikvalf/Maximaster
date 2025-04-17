<?php

header('Content-Type: application/json');

$username = 'cli';
$password = '12344321';
$apiUrl = 'http://exercise.develop.maximaster.ru/service/city';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");

$response = curl_exec($ch);
curl_close($ch);

echo $response;

