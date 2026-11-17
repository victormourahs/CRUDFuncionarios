'use strict';
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
const app = express();
const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'venda';
const collectionName = process.env.COLLECTION_NAME || 'funcionario';
const port = Number(process.env.PORT || 3000);
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
let collection;

app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));
app.use(express.static(path.join(__dirname, 'public')));

function validate(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) throw Object.assign(new Error('Dados inválidos.'), { status: 400 });
  const matricula = typeof data.matricula === 'string' ? data.matricula.trim() : '';
  const nome = typeof data.nome === 'string' ? data.nome.trim() : '';
  const funcao = typeof data.funcao === 'string' ? data.funcao.trim() : '';
  const salario = typeof data.salario === 'number' ? data.salario : Number(data.salario);
  if (!matricula || matricula.length > 40 || !nome || nome.length > 120 || !funcao || funcao.length > 100 || data.salario === '' || data.salario == null || !Number.isFinite(salario) || salario < 0) {
    throw Object.assign(new Error('Informe matrícula, nome, função e salário válido (maior ou igual a zero).'), { status: 400 });
  }
  return { matricula, nome, funcao, salario };
}
function objectId(value) {
  if (!/^[0-9a-fA-F]{24}$/.test(value)) throw Object.assign(new Error('Identificador inválido.'), { status: 400 });
  return new ObjectId(value);
}
function output(doc) {
  return { id: doc._id.toString(), matricula: doc.matricula, nome: doc.nome, funcao: doc.funcao, salario: Number(doc.salario) };
}
const wrap = fn => (req, res, next) => Promise.resolve(fn(req, res)).catch(next);

app.get('/api/funcionarios', wrap(async (req, res) => {
  const busca = String(req.query.busca || '').trim().slice(0, 100);
  let query = {};
  if (busca) {
    const escaped = busca.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query = { $or: [{ nome: { $regex: escaped, $options: 'i' } }, { matricula: { $regex: escaped, $options: 'i' } }, { funcao: { $regex: escaped, $options: 'i' } }] };
  }
  const docs = await collection.find(query).sort({ nome: 1, _id: 1 }).limit(500).toArray();
  res.json(docs.map(output));
}));
app.post('/api/funcionarios', wrap(async (req, res) => {
  const funcionario = validate(req.body);
  const { insertedId } = await collection.insertOne(funcionario);
  res.status(201).json({ ...funcionario, id: insertedId.toString() });
}));
app.put('/api/funcionarios/:id', wrap(async (req, res) => {
  const _id = objectId(req.params.id);
  const funcionario = validate(req.body);
  const result = await collection.updateOne({ _id }, { $set: funcionario });
  if (!result.matchedCount) return res.status(404).json({ erro: 'Funcionário não encontrado.' });
  res.json({ ...funcionario, id: _id.toString() });
}));
app.delete('/api/funcionarios/:id', wrap(async (req, res) => {
  const result = await collection.deleteOne({ _id: objectId(req.params.id) });
  if (!result.deletedCount) return res.status(404).json({ erro: 'Funcionário não encontrado.' });
  res.status(204).end();
}));
app.use((err, req, res, next) => {
  if (err.code === 11000) return res.status(409).json({ erro: 'Esta matrícula já está cadastrada.' });
  const status = err.status || (err.type === 'entity.parse.failed' ? 400 : 500);
  if (status >= 500) console.error(err);
  res.status(status).json({ erro: status >= 500 ? 'Erro interno. Verifique o servidor e o MongoDB.' : err.message });
});

async function start() {
  await client.connect();
  collection = client.db(dbName).collection(collectionName);
  await collection.createIndex({ matricula: 1 }, { unique: true });
  app.listen(port, () => console.log(`Acesse http://localhost:${port}`));
}
start().catch(err => { console.error('Falha ao conectar ao MongoDB:', err.message); process.exit(1); });
process.on('SIGINT', async () => { await client.close(); process.exit(0); });
