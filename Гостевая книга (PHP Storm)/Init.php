<?php
try {
    $db = new PDO('sqlite:Bookofguests.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $db->exec("CREATE TABLE IF NOT EXISTS Bookofguests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )");
    echo "БД 'Bookofguests' успешно создана ";
} catch (PDOException $e) {
    die("Не удалось подключиться к базе данных: " . $e->getMessage());
}


