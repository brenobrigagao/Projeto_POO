## Documentação da API FFCE
OBS: Os endpoints são case-sensitive. 
### RODANDO O PROJETO
`dotnet build`

`dotnet run`
### Fazendo Migrations
`dotnet ef migrations add NOMEDAMIGRATION`

`dotnet ef database update`

`dotnet build`

`dotnet run`
### Removendo Migrations
`dotnet ef migrations remove`

---

**Base URL:** `{{baseUrl}}/api`

---

### 1. Autenticação

Todos os endpoints protegidos exigem um cabeçalho `Authorization` com um token JWT:

```
Authorization: Bearer {token}
```

---

## 2. AuthController

### 2.1 Registrar Usuário

> **POST** `/api/Auth/registrar`

**Body (JSON):**

```json
{
  "email": "usuario@exemplo.com",
  "senha": "SenhaForte!",
  "role": "Cliente" // ou "Produtor"
}
```

**Resposta 200 OK:**

```json
{ "message": "O usuário foi registrado com sucesso!" }
```

---

### 2.2 Login

> **POST** `/api/Auth/login`

**Body (JSON):**

```json
{
  "email": "usuario@exemplo.com",
  "senha": "SenhaForte!"
}
```

**Resposta 200 OK:**

```json
{
  "token": "<jwt_token>",
  "role": "Cliente",
  "id": 1
}
```

---

### 2.3 Cadastro Complementar

> **POST** `/api/Auth/cadastro`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON) para Produtor:**

```json
{
  "nome": "João Produtor",
  "telefone": "11999999999",
  "endereco": "Rua X, 123",
  "nomeLoja": "Loja do João",
  "descricao": "Descrição da loja"
}
```

**Body (JSON) para Cliente:**

```json
{
  "nome": "Maria Cliente",
  "telefone": "21988888888",
  "endereco": "Av. Y, 456",
  "gostos": "Orquídeas, Rosas"
}
```

**Resposta 200 OK:**

```
"Cadastro completo com sucesso!"
```

---

### 2.4 Verificar Cadastro

> **GET** `/api/Auth/verificar`

**Headers:**

```
Authorization: Bearer {token}
```

**Resposta 200 OK:**

```json
{ "cadastroCompleto": true }
```

---

## 3. ClienteController

> \*Requer Role \**`Cliente`*

### 3.1 Listar Produtos Disponíveis

> **GET** `/api/Cliente/produtos-disponiveis`

**Headers:**

```
Authorization: Bearer {token}
```

**Resposta 200 OK:**

```json
[
  {
    "produtoId": 1,
    "flor": "Rosa",
    "preco": 15.0,
    "estoque": 50,
    "nomeLoja": "Flores da Serra",
    "produtorTelefone": "11987654321"
  },
  ...
]
```

---

### 3.2 Adicionar ao Carrinho

> **POST** `/api/Cliente/adicionar-carrinho`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "produtoId": 1,
  "quantidade": 3
}
```

**Resposta 200 OK:**

```
"Produto adicionado ao carrinho"
```

---

## 4. ProdutorController

> \*Requer Role \**`Produtor`*

### 4.1 Listar Flores

> **GET** `/api/Produtor/listar-flores`

**Headers:**

```
Authorization: Bearer {token}
```

**Resposta 200 OK:**

```json
[
  { "id": 1, "nome": "Rosa", "descricao": "...", "imageUrl": "..." },
  ...
]
```

---

### 4.2 Cadastrar Produto

> **POST** `/api/Produtor/cadastrar-produto`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "florId": 2,
  "preco": 25.50,
  "estoque": 100
}
```

**Resposta 200 OK:**

```
"Produto cadastrado com sucesso."
```

---

### 4.3 Meus Produtos

> **GET** `/api/Produtor/meus-produtos`

**Headers:**

```
Authorization: Bearer {token}
```

**Resposta 200 OK:**

```json
[
  {
    "id": 1,
    "flor": "Rosa",
    "preco": 15.0,
    "estoque": 50,
    "imageUrl": "..."
  },
  ...
]
```

---

### 4.4 Editar Produto

> **PUT** `/api/Produtor/editar-produto/{id}`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (JSON) opcional:**

```json
{
  "preco": 30.0,
  "estoque": 80,
  "florId": 3
}
```

**Resposta 200 OK:**

```
"Produto atualizado com sucesso."
```

---

### 4.5 Excluir Produto

> **DELETE** `/api/Produtor/excluir-produto/{id}`

**Headers:**

```
Authorization: Bearer {token}
```

**Resposta 200 OK:**

```
"Produto excluído com sucesso."
```

---

## 5. ImagesController

### 5.1 Listar Imagens

> **GET** `/api/Images`

**Resposta 200 OK:**

```json
[
  "cacto.jpg",
  "rosa-vermelha.jpg",
  ...
]
```

---

### 5.2 Upload de Imagem

> **POST** `/api/Images/upload`

**Form Data:**

* `file`: arquivo de imagem (`.jpg`, `.png`, `.gif`)

**Resposta 200 OK:**

```
"Upload realizado com sucesso."
```

---

### 5.3 Renomear Imagem

> **PUT** `/api/Images/rename/{oldName}`

**Body (JSON):**

```json
{ "newName": "novo-nome.jpg" }
```

**Resposta 200 OK:**

```
"Arquivo renomeado com sucesso."
```

---

### 5.4 Deletar Imagem

> **DELETE** `/api/Images/{name}`

**Resposta 200 OK:**

```
"Arquivo deletado com sucesso."
```

---

## 6. DTOs Principais

| DTO                | Propriedades                                                      |
| ------------------ | ----------------------------------------------------------------- |
| RegistroDTO        | `string Email`, `string Senha`, `string Role`                     |
| LoginDTO           | `string Email`, `string Senha`                                    |
| CadastroDTO        | Produtor: `Nome`, `Telefone`, `Endereco`, `NomeLoja`, `Descricao` |
|                    | Cliente: `Nome`, `Telefone`, `Endereco`, `Gostos`                 |
| ProdutoCadastroDTO | `int FlorId`, `decimal Preco`, `int Estoque`                      |
| ProdutoAtualizaDTO | `decimal? Preco`, `int? Estoque`, `int? FlorId`                   |
| AddCarrinhoDTO     | `int ProdutoId`, `int Quantidade`                                 |
| RenameDTO          | `string NewName`                                                  |

---
OBS: É preciso adicionar uns GET para o Cliente ver o carrinho e o Produtor ver os seus produtos cadastrados. É 
preciso testar alguns métodos não essenciais, como renomeação de imagens, etc, mas o projeto já está o suficiente
para ser feito a integração com o Front-End.