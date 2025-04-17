<?php

header('Content-Type: application/json');

$username = 'cli';
$password = '12344321';
$city = isset($_GET['city']) ? trim($_GET['city']) : null;
$weight = isset($_GET['weight']) ? trim($_GET['weight']) : null;

if (empty($city) || empty($weight)) {
    echo json_encode(['error' => 'Вы не указали город и вес (сервер нельзя обманывать) .']);
    exit;
}

if (!is_numeric($weight) || $weight <= 0) {
    echo json_encode(['error' => 'Вам удалось обмануть клиентскую часть, но введите положительное число.']);
    exit;
}

$apiUrl = 'http://exercise.develop.maximaster.ru/service/delivery';

$options = [
    'http' => [
        'method' => 'GET',
        'header' => [
            'Authorization: Basic ' . base64_encode("$username:$password"),
            'Content-Type: application/json',
            'Accept: application/json'
        ],
        'ignore_errors' => true
    ]
];

$context = stream_context_create($options);
$response = file_get_contents($apiUrl . "?city=" . urlencode($city) . "&weight=" . urlencode($weight), false, $context);

if ($response === FALSE) {
    echo json_encode(['error' => 'Ошибка при запросе к серверу Максимастер.']);
} else {
    echo $response;
}

