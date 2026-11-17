<?php
declare(strict_types=1);
session_start();
if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(24));
function h(mixed $value): string { return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function redirectStatus(string $status): never { header('Location: index.php?status=' . rawurlencode($status), true, 303); exit; }
function valuesFromPost(): array {
    $matricula = trim((string) ($_POST['matricula'] ?? ''));
    $nome = trim((string) ($_POST['nome'] ?? ''));
    $funcao = trim((string) ($_POST['funcao'] ?? ''));
    $salarioRaw = trim((string) ($_POST['salario'] ?? ''));
    $salario = filter_var($salarioRaw, FILTER_VALIDATE_FLOAT);
    if (!$matricula || strlen($matricula) > 40 || !$nome || strlen($nome) > 120 || !$funcao || strlen($funcao) > 100 || $salario === false || !is_finite((float) $salario) || $salario < 0) {
        throw new InvalidArgumentException('Preencha todos os campos e informe um salário válido.');
    }
    return compact('matricula', 'nome', 'funcao') + ['salario' => (float) $salario];
}
function validId(string $value): MongoDB\BSON\ObjectId {
    if (!preg_match('/^[a-f0-9]{24}$/i', $value)) throw new InvalidArgumentException('Identificador inválido.');
    return new MongoDB\BSON\ObjectId($value);
}
$error = '';
$editing = null;
$funcionarios = [];
try {
    require __DIR__ . '/config.php';
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (!hash_equals($_SESSION['csrf'], (string) ($_POST['csrf'] ?? ''))) throw new InvalidArgumentException('Solicitação inválida. Atualize a página.');
        $acao = (string) ($_POST['acao'] ?? '');
        if ($acao === 'criar') {
            $collection->insertOne(valuesFromPost());
            redirectStatus('criado');
        } elseif ($acao === 'editar') {
            $result = $collection->updateOne(['_id' => validId((string) ($_POST['id'] ?? ''))], ['$set' => valuesFromPost()]);
            if ($result->getMatchedCount() === 0) throw new InvalidArgumentException('Funcionário não encontrado.');
            redirectStatus('editado');
        } elseif ($acao === 'excluir') {
            $result = $collection->deleteOne(['_id' => validId((string) ($_POST['id'] ?? ''))]);
            if ($result->getDeletedCount() === 0) throw new InvalidArgumentException('Funcionário não encontrado.');
            redirectStatus('excluido');
        } else throw new InvalidArgumentException('Ação inválida.');
    }
    $idEditar = (string) ($_GET['editar'] ?? '');
    if ($idEditar !== '') {
        $editing = $collection->findOne(['_id' => validId($idEditar)]);
        if (!$editing) throw new InvalidArgumentException('Funcionário não encontrado para edição.');
    }
    $busca = trim((string) ($_GET['busca'] ?? ''));
    $busca = substr($busca, 0, 100);
    $filter = $busca === '' ? [] : ['$or' => [
        ['nome' => ['$regex' => preg_quote($busca, '/'), '$options' => 'i']],
        ['matricula' => ['$regex' => preg_quote($busca, '/'), '$options' => 'i']],
        ['funcao' => ['$regex' => preg_quote($busca, '/'), '$options' => 'i']]
    ]];
    $funcionarios = iterator_to_array($collection->find($filter, ['sort' => ['nome' => 1, '_id' => 1], 'limit' => 500]), false);
} catch (MongoDB\Driver\Exception\BulkWriteException $e) {
    $error = $e->getCode() === 11000 ? 'Esta matrícula já está cadastrada.' : 'Falha ao salvar no banco de dados.';
} catch (InvalidArgumentException $e) { $error = $e->getMessage(); }
catch (Throwable $e) { error_log((string) $e); $error = 'Erro ao acessar o MongoDB. Verifique a conexão e as dependências.'; }
$statusTexts = ['criado' => 'Funcionário cadastrado com sucesso.', 'editado' => 'Funcionário atualizado com sucesso.', 'excluido' => 'Funcionário excluído com sucesso.'];
$status = $statusTexts[(string) ($_GET['status'] ?? '')] ?? '';
require __DIR__ . '/view.php';
