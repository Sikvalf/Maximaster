<?php
date_default_timezone_set('Europe/Moscow');
try {
    $db = new PDO('sqlite:Bookofguests.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Не удалось подключиться к базе данных: " . $e->getMessage());
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name']);
    $message = trim($_POST['message']);

    if (!empty($message)) {
        if (empty($name)) {
            $name = "Анонимно";
        }

        $stmt = $db->prepare('INSERT INTO Bookofguests (name, message) VALUES (:name, :message)');
        $stmt->bindValue(':name', $name, PDO::PARAM_STR);
        $stmt->bindValue(':message', $message, PDO::PARAM_STR);
        $stmt->execute();
    }
}

$results = $db->query('SELECT * FROM Bookofguests ORDER BY created_at DESC');
$messages = $results->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Гостевая книга</title>
    <link rel="stylesheet" href="Bookofguests.css">
</head>
<body>
<?php foreach ($messages as $msg): ?>
    <div class="message">
        <div class="message-date"><?php echo date('d.m.Y H:i', strtotime($msg['created_at']) + 3 * 60 * 60); ?></div>
        <div class="message-author"><?php echo htmlspecialchars($msg['name']); ?></div>
        <p><?php echo nl2br(htmlspecialchars($msg['message'])); ?></p>
    </div>
<?php endforeach; ?>

<hr>
<form method="POST">
    <label for="name"> </label>
    <input type="text" id="name" name="name" placeholder="Имя">
    <label for="message"> </label>
    <textarea id="message" name="message" required  placeholder="Ваше сообщение"></textarea>
    <button type="submit">Отправить</button>
</form>
</body>
</html>
