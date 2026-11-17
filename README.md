# CRUD de Funcionários — MongoDB, Node.js e PHP

Sistema de gerenciamento de funcionários desenvolvido como projeto acadêmico para a disciplina de **Banco de Dados**.

O projeto implementa as quatro operações fundamentais de persistência de dados (**CRUD — Create, Read, Update e Delete**) utilizando **MongoDB**, por meio de duas aplicações independentes:

- **Node.js + Express:** aplicação web com API REST.
- **PHP + HTML:** aplicação web com formulários e processamento no servidor.

Ambas as aplicações utilizam, por padrão, o mesmo banco de dados e a mesma coleção do MongoDB, permitindo consultar e modificar os mesmos registros por interfaces diferentes.

## 1. Objetivo do projeto

Evoluir os exemplos fornecidos em aula, implementando um sistema completo de gerenciamento de funcionários com as operações:

| Operação | Descrição |
|---|---|
| **Insert (Create)** | Cadastrar novos funcionários |
| **Find (Read)** | Consultar e pesquisar funcionários |
| **Update** | Atualizar informações de funcionários existentes |
| **Delete** | Excluir funcionários cadastrados |

Além das operações CRUD, o projeto apresenta melhorias de interface, validações, organização de código e tratamento de erros.

## 2. Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| Node.js | Ambiente de execução JavaScript no servidor |
| Express.js | Framework para criação da API REST |
| PHP | Processamento da aplicação web no servidor |
| HTML5 | Estrutura das interfaces |
| CSS3 | Estilização e responsividade |
| JavaScript | Interatividade e comunicação com a API |
| MongoDB | Banco de dados NoSQL orientado a documentos |
| MongoDB Node.js Driver | Comunicação entre Node.js e MongoDB |
| MongoDB PHP Library | Comunicação entre PHP e MongoDB |
| Composer | Gerenciamento de dependências PHP |
| npm | Gerenciamento de dependências Node.js |

## 3. Estrutura do projeto

```text
crud-mongodb/
│
├── node/
│   ├── public/
│   │   ├── index.html
│   │   ├── app.js
│   │   └── ...
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── ...
│
├── php/
│   ├── index.php
│   ├── view.php
│   ├── config.php
│   ├── composer.json
│   └── ...
│
└── README.md
```

**Observação:** pastas como `node_modules/` e `vendor/` são geradas durante a instalação das dependências e não precisam ser incluídas no repositório.

## 4. Estrutura do banco de dados

O sistema utiliza as seguintes configurações padrão:

| Configuração | Valor |
|---|---|
| Banco de dados | `venda` |
| Coleção | `funcionario` |
| Endereço MongoDB | `mongodb://localhost:27017` |

### Campos dos documentos

| Campo | Tipo | Descrição |
|---|---|---|
| `_id` | ObjectId | Identificador gerado pelo MongoDB |
| `matricula` | String | Matrícula obrigatória e única |
| `nome` | String | Nome obrigatório do funcionário |
| `salario` | Number | Salário não negativo |
| `funcao` | String | Função obrigatória do funcionário |

### Exemplo de documento MongoDB

```json
{
  "_id": "ObjectId gerado automaticamente",
  "matricula": "1001",
  "nome": "Ana Souza",
  "salario": 2500,
  "funcao": "Desenvolvedora"
}
```

O campo `_id` é gerado automaticamente pelo MongoDB e utilizado para identificar os documentos durante as operações de atualização e exclusão.

A aplicação Node.js também cria automaticamente um índice único para o campo `matricula`, impedindo matrículas duplicadas.

## 5. Pré-requisitos

Para executar o projeto localmente, é necessário ter:

- MongoDB Server instalado e em execução.
- Node.js compatível com as dependências do projeto e npm.
- PHP 8.1 ou superior, observando a compatibilidade das bibliotecas instaladas.
- Extensão `mongodb` habilitada no PHP.
- Composer instalado.
- Navegador atualizado.
- Visual Studio Code ou outro editor de código.

O MongoDB Compass é opcional, mas recomendado para visualizar os documentos cadastrados.

### Verificar as instalações

Abra o terminal e execute:

```bash
node -v
npm -v
php -v
composer --version
```

Para verificar a extensão MongoDB no PHP:

```bash
php -m
```

A lista de extensões deve conter `mongodb`.

## 6. Executando o MongoDB

Antes de iniciar as aplicações, certifique-se de que o serviço MongoDB esteja funcionando.

No Windows:

1. Pressione `Win + R`.
2. Execute `services.msc`.
3. Localize o serviço MongoDB Server.
4. Inicie o serviço, caso esteja parado.

Para verificar a conexão, abra o MongoDB Compass e utilize:

```text
mongodb://localhost:27017
```

O banco `venda` e a coleção `funcionario` serão utilizados pelas aplicações. Caso ainda não existam, poderão ser criados pelo MongoDB quando os primeiros documentos forem inseridos.

## 7. Executando a aplicação Node.js

Abra o projeto no Visual Studio Code.

No terminal, acesse a pasta `node`:

```bash
cd node
```

### Instalar as dependências

```bash
npm install
```

### Iniciar o servidor

```bash
npm start
```

A aplicação estará disponível, na configuração padrão, em:

**http://localhost:3000**

Também é possível utilizar:

```bash
npm run dev
```

Esse comando executa o projeto em modo de desenvolvimento, com reinicialização automática do servidor quando configurada.

### Configurações opcionais

A versão Node.js permite configurar:

| Variável | Descrição |
|---|---|
| `MONGODB_URI` | URI de conexão com MongoDB |
| `DB_NAME` | Nome do banco de dados |
| `COLLECTION_NAME` | Nome da coleção |
| `PORT` | Porta do servidor HTTP |

O arquivo `.env.example` apresenta exemplos das configurações.

O projeto não carrega automaticamente arquivos `.env`. Para utilizá-los com uma versão compatível do Node.js, execute:

```bash
node --env-file=.env server.js
```

Também é possível utilizar variáveis de ambiente configuradas no sistema operacional.

## 8. Executando a aplicação PHP + HTML

A versão PHP utiliza a biblioteca MongoDB instalada pelo Composer.

### Passo 1 — Verificar o PHP

No terminal, execute:

```bash
php -v
```

Depois, confira a extensão MongoDB:

```bash
php -m
```

Caso a extensão não apareça, verifique o arquivo `php.ini`:

```bash
php --ini
```

A configuração da extensão deve incluir:

```ini
extension=mongodb
```

A DLL correspondente deve estar instalada e ser compatível com a versão e a arquitetura do PHP.

### Passo 2 — Instalar dependências

No terminal, entre na pasta `php`:

```bash
cd php
```

Execute:

```bash
composer install
```

Esse comando instala as dependências necessárias e gera a pasta `vendor`, incluindo o arquivo:

```text
vendor/autoload.php
```

**Importante:** a aplicação PHP depende desse arquivo para carregar as bibliotecas do MongoDB.

### Passo 3 — Iniciar o servidor

```bash
php -S localhost:8000
```

Acesse:

**http://localhost:8000/index.php**

### Execução alternativa com Apache

A aplicação também pode ser executada por meio do Apache, conforme o ambiente apresentado em aula.

Nesse caso:

1. Configure o Apache para reconhecer arquivos PHP.
2. Certifique-se de que a extensão MongoDB esteja habilitada.
3. Disponibilize a aplicação PHP dentro do diretório servido pelo Apache ou configure um VirtualHost.
4. Inicie o Apache.
5. Acesse o endereço correspondente à aplicação pelo navegador.

Não abra o arquivo `index.php` diretamente pelo Explorador de Arquivos. Ele precisa ser processado por um servidor PHP.

### Organização da versão PHP

- `config.php`: configuração da conexão e carregamento das dependências.
- `index.php`: processamento das requisições e operações CRUD.
- `view.php`: apresentação da interface HTML.
- `composer.json`: definição das dependências PHP.

O conteúdo HTML dinâmico é renderizado pelo PHP, permitindo a integração entre a interface e o banco de dados.

## 9. Operações CRUD implementadas

### Node.js — API REST

| Método HTTP | Endpoint | Operação |
|---|---|---|
| POST | `/api/funcionarios` | Insert |
| GET | `/api/funcionarios` | Find |
| PUT | `/api/funcionarios/:id` | Update |
| DELETE | `/api/funcionarios/:id` | Delete |

A consulta também permite realizar pesquisas:

```http
GET /api/funcionarios?busca=Ana
```

### PHP + HTML

| Operação | Implementação |
|---|---|
| Insert | Formulário com `acao=criar` |
| Find | Listagem e pesquisa em `index.php` |
| Update | Formulário com `acao=editar` |
| Delete | Formulário com `acao=excluir` |

### Métodos MongoDB utilizados

```javascript
insertOne()
find()
findOne()
updateOne()
deleteOne()
```

A exclusão é física, conforme permitido pelo enunciado do projeto.

## 10. Integração entre as aplicações

Embora sejam aplicações independentes, as duas versões acessam o mesmo banco de dados e a mesma coleção.

```text
       Aplicação Node.js
              |
              v
       API REST / Express
              |
              v
       MongoDB (venda)
       Coleção funcionario
              ^
              |
       Biblioteca MongoDB
              ^
              |
       Aplicação PHP + HTML
```

Dessa forma:

- Funcionários cadastrados no Node.js podem ser consultados pelo PHP.
- Alterações realizadas pelo PHP podem ser visualizadas no Node.js.
- Exclusões realizadas por qualquer aplicação são refletidas no banco compartilhado.

A listagem deve ser atualizada após operações feitas pela outra aplicação para apresentar os dados mais recentes.

Caso seja necessário utilizar bancos ou coleções independentes, é possível alterar `DB_NAME` e `COLLECTION_NAME` em cada aplicação.

## 11. Testando o sistema

Utilize o seguinte funcionário para realizar os testes:

| Campo | Valor |
|---|---|
| Matrícula | 1001 |
| Nome | Ana Souza |
| Salário | 2500 |
| Função | Desenvolvedora |

### Teste 1 — Insert

Cadastre o funcionário pelo formulário e confirme se ele aparece na listagem.

### Teste 2 — Find

Pesquise o funcionário utilizando nome, matrícula ou função e confirme se o registro correto aparece.

### Teste 3 — Update

Selecione **Editar**, altere o salário de `2500` para `3000` e salve. Confirme se a alteração foi persistida.

### Teste 4 — Delete

Selecione **Excluir**, confirme a operação e verifique se o funcionário deixou de aparecer na listagem.

### Teste 5 — Integração Node.js e PHP

1. Inicie as duas aplicações.
2. Cadastre um funcionário pelo Node.js.
3. Consulte esse funcionário pela interface PHP.
4. Atualize seus dados pelo PHP.
5. Atualize a listagem do Node.js e confirme a alteração.
6. Exclua o funcionário por uma das interfaces.
7. Verifique se a exclusão aparece na outra aplicação.

**Resultado esperado:** as duas aplicações executam as quatro operações CRUD e compartilham corretamente os documentos armazenados no MongoDB.

## 12. Melhorias implementadas

Em comparação com os exemplos iniciais apresentados em aula, o projeto incorpora:

- Interfaces responsivas e organizadas.
- Cadastro e listagem de funcionários.
- Pesquisa por nome, matrícula ou função.
- Formulários para edição de registros existentes.
- Confirmação antes da exclusão.
- Validação de dados no servidor.
- Tratamento de erros.
- Mensagens de feedback para as operações.
- Prevenção de matrículas duplicadas.
- Proteção contra injeção de HTML por meio de `textContent` e `htmlspecialchars`.
- Proteção CSRF nos formulários PHP.
- Separação das responsabilidades entre interface e processamento.
- Integração entre duas tecnologias utilizando o mesmo banco MongoDB.

## 13. Solução de problemas

### Erro: `Cannot find module`

As dependências Node.js podem não estar instaladas.

Dentro da pasta `node`, execute:

```bash
npm install
```

### Erro: `vendor/autoload.php` não encontrado

As dependências PHP ainda não foram instaladas.

Dentro da pasta `php`, execute:

```bash
composer install
```

### Erro: `Class MongoDB\Client not found`

Verifique se o Composer instalou corretamente as dependências e se o autoload está sendo carregado pelo PHP.

### Erro: extensão `mongodb` não habilitada

Verifique:

```bash
php -m
php --ini
```

Se necessário, habilite a extensão no arquivo `php.ini` utilizado pelo servidor e reinicie o PHP ou Apache.

### Erro de conexão com MongoDB

Verifique:

- Se o MongoDB Server está em execução.
- Se a porta `27017` está disponível.
- Se a URI de conexão está correta.
- Se as credenciais foram configuradas, quando necessárias.

### Erro: porta já está em uso

Caso as portas `3000` ou `8000` estejam ocupadas, encerre o processo que as utiliza ou configure outra porta disponível.

### Erro: comando `php` ou `composer` não reconhecido

Verifique se o programa correspondente está instalado e disponível na variável de ambiente `PATH` do Windows.

## 14. Limitações

O projeto possui finalidade acadêmica e não foi desenvolvido para utilização pública em ambiente de produção.

Limitações conhecidas:

- Não possui autenticação de usuários.
- Não possui controle de permissões.
- A exclusão remove fisicamente os registros.
- A listagem é limitada a 500 registros.
- Não implementa paginação completa.

Para utilização em produção, seriam necessárias melhorias adicionais de segurança, autenticação, autorização, HTTPS, monitoramento e configuração do ambiente.

## 15. Atendimento aos requisitos acadêmicos

| Requisito solicitado | Implementação |
|---|---|
| Node.js | Aplicação Node.js com Express |
| PHP + HTML | Aplicação PHP com formulários HTML |
| MongoDB | Banco NoSQL compartilhado |
| Insert | Cadastro de funcionários |
| Find | Consulta e pesquisa |
| Update | Edição de funcionários |
| Delete | Exclusão física |
| Interface gráfica | Disponível nas duas aplicações |
| Melhorias arquiteturais | Organização do código e validações |
| Framework | Express utilizado na versão Node.js |

O projeto contempla as duas abordagens tecnológicas solicitadas, implementando o ciclo completo CRUD em MongoDB.

---

**Projeto acadêmico — Disciplina de Banco de Dados**

Desenvolvido para demonstrar o funcionamento das operações de persistência em MongoDB utilizando Node.js e PHP com HTML.