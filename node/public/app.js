'use strict';
const $ = selector => document.querySelector(selector);
const form = $('#form');
const fields = ['matricula', 'nome', 'salario', 'funcao'];
let funcionarios = [];
const money = n => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
function message(text, error = false) { const el = $('#message'); el.hidden = !text; el.textContent = text; el.className = error ? 'message error' : 'message'; }
async function request(url, options) {
  const res = await fetch(url, options);
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.erro || 'Não foi possível realizar a operação.');
  return data;
}
function reset() { form.reset(); $('#id').value = ''; $('#form-title').textContent = 'Novo funcionário'; $('#save').textContent = 'Adicionar funcionário'; $('#cancel').hidden = true; }
function addCell(row, value) { const cell = document.createElement('td'); cell.textContent = value; row.append(cell); return cell; }
function render() {
  const tbody = $('#rows'); tbody.replaceChildren();
  $('#count').textContent = `${funcionarios.length} registro(s) exibido(s)`;
  if (!funcionarios.length) { const tr = document.createElement('tr'); const td = addCell(tr, 'Nenhum funcionário encontrado.'); td.colSpan = 5; td.className = 'empty'; tbody.append(tr); return; }
  for (const item of funcionarios) {
    const tr = document.createElement('tr');
    addCell(tr, item.matricula); addCell(tr, item.nome); addCell(tr, item.funcao); addCell(tr, money(item.salario));
    const td = document.createElement('td'); td.className = 'row-actions';
    const edit = document.createElement('button'); edit.textContent = 'Editar'; edit.className = 'small secondary'; edit.addEventListener('click', () => {
      $('#id').value = item.id; for (const key of fields) $('#' + key).value = item[key];
      $('#form-title').textContent = 'Editar funcionário'; $('#save').textContent = 'Salvar alterações'; $('#cancel').hidden = false; message(''); window.scrollTo({ top: 0, behavior: 'smooth' }); $('#matricula').focus();
    });
    const del = document.createElement('button'); del.textContent = 'Excluir'; del.className = 'small danger'; del.addEventListener('click', async () => {
      if (!confirm(`Excluir o funcionário ${item.nome}?`)) return;
      try { await request(`/api/funcionarios/${item.id}`, { method: 'DELETE' }); if ($('#id').value === item.id) reset(); await load(); message('Funcionário excluído com sucesso.'); }
      catch (e) { message(e.message, true); }
    });
    td.append(edit, document.createTextNode(' '), del); tr.append(td); tbody.append(tr);
  }
}
async function load() { funcionarios = await request('/api/funcionarios?busca=' + encodeURIComponent($('#busca').value)); render(); }
form.addEventListener('submit', async e => {
  e.preventDefault();
  const id = $('#id').value;
  const data = Object.fromEntries(fields.map(key => [key, key === 'salario' ? Number($('#salario').value) : $('#' + key).value.trim()]));
  $('#save').disabled = true;
  try { await request(id ? `/api/funcionarios/${id}` : '/api/funcionarios', { method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); reset(); await load(); message(id ? 'Funcionário atualizado com sucesso.' : 'Funcionário cadastrado com sucesso.'); }
  catch (e) { message(e.message, true); }
  finally { $('#save').disabled = false; }
});
$('#cancel').addEventListener('click', reset);
let searchTimeout; $('#busca').addEventListener('input', () => { clearTimeout(searchTimeout); searchTimeout = setTimeout(() => load().catch(e => message(e.message, true)), 250); });
load().catch(e => { $('#count').textContent = 'Falha ao carregar'; message('Não foi possível carregar funcionários: ' + e.message, true); });
