<!DOCTYPE html>
<head>
    <title>Счетчик хитов</title>
</head>
<body>


<?php
date_default_timezone_set('Europe/Moscow');
$counter_file = 'Countofpage.txt';

if (!file_exists($counter_file)) {
    file_put_contents($counter_file, '0');
}

$count = file_get_contents($counter_file);
$count++;

file_put_contents($counter_file, $count);
?>

<p><b>Страница была загружена  <?php echo $count; ?> раз. Текущее время: <?php echo date('H:i:s'); ?></p>
</body>
