<?php
require 'vendor/autoload.php';

use Slim\Factory\AppFactory;
use Slim\Exception\HttpNotFoundException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app = AppFactory::create();
$app->setBasePath('/simple-api');
$app->addBodyParsingMiddleware();

$db = new PDO('sqlite:products.db');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$db->exec('CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)');

function jsonResponse(Response $response, $data, int $status = 200): Response {
    $response->getBody()->write(json_encode($data, JSON_UNESCAPED_UNICODE));
    return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
}

$app->get('/test', function (Request $request, Response $response): Response {
    $response->getBody()->write("API работает!");
    return $response;
});

$app->get('/api/products', function (Request $request, Response $response) use ($db): Response {
    $stmt = $db->query('SELECT * FROM products');
    return jsonResponse($response, $stmt->fetchAll(PDO::FETCH_ASSOC));
});

$app->get('/api/products/{id}', function (Request $request, Response $response, array $args) use ($db): Response {
    $stmt = $db->prepare('SELECT * FROM products WHERE id = ?');
    $stmt->execute([$args['id']]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    return $product
        ? jsonResponse($response, $product)
        : jsonResponse($response, ['error' => 'Товар не найден'], 404);
});

$app->post('/api/products', function (Request $request, Response $response) use ($db): Response {
    $data = $request->getParsedBody();

    if (empty($data['name']) || !isset($data['price'])) {
        return jsonResponse($response, ['error' => 'Название и цена обязательны'], 400);
    }

    $stmt = $db->prepare('INSERT INTO products (name, price, description) VALUES (?, ?, ?)');
    $stmt->execute([$data['name'], $data['price'], $data['description'] ?? null]);

    return jsonResponse($response, ['id' => $db->lastInsertId()], 201);
});

$app->put('/api/products/{id}', function (Request $request, Response $response, array $args) use ($db): Response {
    $data = $request->getParsedBody();

    if (empty($data['name']) || !isset($data['price'])) {
        return jsonResponse($response, ['error' => 'Название и цена обязательны'], 400);
    }

    $stmt = $db->prepare('UPDATE products SET name=?, price=?, description=? WHERE id=?');
    $stmt->execute([$data['name'], $data['price'], $data['description'] ?? null, $args['id']]);

    return $stmt->rowCount() > 0
        ? jsonResponse($response, ['success' => true])
        : jsonResponse($response, ['error' => 'Товар не найден'], 404);
});

$app->delete('/api/products/{id}', function (Request $request, Response $response, array $args) use ($db): Response {
    $stmt = $db->prepare('DELETE FROM products WHERE id=?');
    $stmt->execute([$args['id']]);

    if ($stmt->rowCount() > 0) {
        return jsonResponse($response, ['message' => 'Товар успешно удалён'], 200);
    } else {
        return jsonResponse($response, ['error' => 'Товар не найден'], 404);
    }
});

$app->add(function (Request $request, $handler) {
    try {
        return $handler->handle($request);
    } catch (HttpNotFoundException $e) {
        $response = new \Slim\Psr7\Response();
        $response->getBody()->write(json_encode([
            'error' => 'Маршрут не найден',
            'available_routes' => [
                'GET /api/products',
                'GET /api/products/{id}',
                'POST /api/products',
                'PUT /api/products/{id}',
                'DELETE /api/products/{id}'
            ]
        ], JSON_UNESCAPED_UNICODE));
        return $response->withStatus(404)->withHeader('Content-Type', 'application/json');
    }
});

$app->run();