<?php
declare(strict_types=1);
require __DIR__ . '/vendor/autoload.php';
$mongoUri = getenv('MONGODB_URI') ?: 'mongodb://127.0.0.1:27017';
$dbName = getenv('DB_NAME') ?: 'venda';
$collectionName = getenv('COLLECTION_NAME') ?: 'funcionario';
$client = new MongoDB\Client($mongoUri, [], ['serverSelectionTimeoutMS' => 5000]);
$collection = $client->selectCollection($dbName, $collectionName);
$collection->createIndex(['matricula' => 1], ['unique' => true]);
