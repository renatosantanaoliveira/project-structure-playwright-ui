# Playwright E2E Template

Este projeto é um template institucional para testes E2E com Playwright e TypeScript.
Ele serve como referência de arquitetura, nomenclatura e boas práticas para criação de novos scaffolds de automação.

## 📋 Sumário

- [Pré-requisitos](#pré-requisitos)
- [Quick Start](#quick-start)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Padrões de Design](#padrões-de-design)
- [Como Usar](#como-usar)
- [Multi-ambiente & Relatórios](#multi-ambiente--relatórios)
- [Como Estender](#como-estender-este-template)
- [Troubleshooting](#troubleshooting)
- [Referências](#referências)

## Pré-requisitos

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **Git** (para controle de versão)

Verifique as versões instaladas:

```bash
node --version
npm --version
```

## Quick Start

Siga estes passos para começar a usar o template:

```bash
# 1. Clone ou crie o projeto
git clone <repo-url> discovery-playwrright
cd discovery-playwrright

# 2. Instale as dependências
npm install

# 3. Execute os testes (padrão: ambiente QA)
npm test

# 4. Abra o relatório HTML
npm run show-report
```

## Estrutura do Projeto

```
discovery-playwrright/
├── config/                    # Configuração por ambiente
│   ├── qa.config.ts          # Config QA (https://www.saucedemo.com)
│   ├── dev.config.ts         # Config DEV (https://dev.saucedemo.com)
│   └── index.ts              # Centralizador de configs
│
├── pages/                     # Page Objects (padrão POM)
│   ├── BasePage.ts           # Classe base com utilitários comuns
│   ├── LoginPage.ts          # Mapeamento da página de login
│   ├── InventoryPage.ts      # Mapeamento da página de inventário
│   ├── ProductPage.ts        # Mapeamento da página de produto
│   └── index.ts              # Barrel: reexporta todos os POs
│
├── fixtures/                  # Injeção de dependência (Playwright)
│   └── page-fixtures.ts      # Define fixtures (pages, data, allure)
│
├── data/                      # Massa de testes centralizada
│   └── login-massa.json      # Dados de teste (usuários, mensagens)
│
├── tests/                     # Testes E2E
│   ├── Login.spec.ts         # Testes de login (happy path + edge cases)
│   └── cart.spec.ts          # Testes de carrinho (3 cenários)
│
├── .github/
│   └── workflows/
│       └── ci.yml            # Pipeline CI/CD (GitHub Actions)
│
├── global-setup.ts           # Setup global (gera environment.properties)
├── playwright.config.ts      # Configuração principal do Playwright
├── tsconfig.json             # Config TypeScript
├── .env                      # Variáveis de ambiente locais (ignorado no Git)
├── .gitignore                # Ignora node_modules, .env, relatórios
└── package.json              # Scripts npm e dependências
```

## Estrutura obrigatória do template

> **ℹ️ Nota**: Esta é uma lista detalhada dos componentes-chave. Para visão geral rápida, veja o [diagrama acima](#estrutura-do-projeto).

- `data/login-massa.json`
  - Contém apenas dados puros no formato JSON.
  - Inclui usuários, senhas, mensagens de erro e qualquer massa de validação.
- `pages/BasePage.ts`
  - Classe genérica mãe para compartilhar o objeto `page` e utilitários comuns.
  - Método `goto` e helpers de espera são implementados aqui.
- `pages/LoginPage.ts`
  - Page Object específico do login.
  - Estende `BasePage`.
  - Seletores são `private readonly`.
  - Expõe métodos de ação públicos como `login`, `fillUsername`, `fillPassword` e `clickLogin`.
- `pages/InventoryPage.ts`
  - Page Object específico da página de inventário.
  - Estende `BasePage`.
  - Seletores são `private readonly`.
  - Expõe métodos de ação/consulta públicos como `isVisible`.
- `pages/index.ts`
  - Reexporta os Page Objects para importações mais limpas.
- `fixtures/page-fixtures.ts`
  - Extende `base.extend` do Playwright.
  - Importa `data/login-massa.json`.
  - Injeta `loginPage`, `inventoryPage`, `productPage`, `data` e `allure` automaticamente nos testes.
- `tests/Login.spec.ts`
  - Teste E2E limpo.
  - Consome somente as fixtures injetadas (`loginPage`, `inventoryPage`, `data`).
  - Mantém asserções no arquivo `.spec.ts`.

## Padrões de design aplicados

**Arquitetura de Teste E2E com Playwright**

- **DRY/DAMP**: massa de dados isolada em JSON e fixtures reutilizáveis.
- **Encapsulamento**: seletores privados no Page Object.
- **Separação de responsabilidades**:
  - `pages/*` para mapeamento e ações.
  - `fixtures/*` para injeção e massa de dados.
  - `tests/*` para fluxos e validações.
  - `config/*` para ambiente e parametrização.
- **Segurança e manutenção**:
  - Sem hardcode de dados nos testes.
  - Sem asserções em classes de página.
  - Uso estrito de tipagens do `@playwright/test`.
- **Multi-ambiente**: baseURL dinâmico via `process.env.NODE_ENV` (padrão: `qa`).
- **Relatórios**: multi-reporter (HTML nativo + Allure + saída em terminal).
- **Evidências**: screenshots, vídeos e traces gerados **apenas em falhas** (economia de disco).

## Como usar

### Instalação de dependências

```bash
npm install
```

Isto instala:
- `@playwright/test`: framework de testes
- `@types/node`: tipos TypeScript para Node.js
- `cross-env`: para definir `NODE_ENV` em qualquer SO
- `allure-playwright`: adapter para geração de relatórios Allure
- `allure-commandline`: CLI para gerar relatório Allure HTML

### Lista e execute testes

1. Liste todos os testes sem executar:

```bash
npm test -- --list
```

2. Execute a suíte completa (ambiente QA, padrão):

```bash
npm test

# ou equivalente:
npm run test:qa
```

### Executar por ambiente

O template suporta múltiplos ambientes com URLs base diferentes. A seleção de ambiente é feita via `NODE_ENV`.

**Ambientes disponíveis:**
- `qa` (padrão): `https://www.saucedemo.com`
- `dev`: `https://dev.saucedemo.com`

#### Opção 1: via scripts npm (recomendado)

```bash
# Executar em QA
npm run test:qa

# Executar em DEV
npm run test:dev

# Executar apenas um navegador (Chromium)
npm run test:chromium
```

#### Opção 2: via variável de ambiente

**macOS / Linux:**

```bash
NODE_ENV=dev npx playwright test
```

**Windows PowerShell:**

```powershell
$env:NODE_ENV='dev'; npx playwright test
```

#### Configuração de ambiente (`.env`)

Criar um arquivo `.env` na raiz do projeto para variáveis sensíveis (será ignorado no Git):

```bash
# .env
TEST_PASSWORD="sua_senha_aqui"
API_TOKEN="seu_token_aqui"
```

Essas variáveis ficarão disponíveis em `process.env` dentro do código.

## Multi-ambiente & Relatórios

### Relatórios Playwright HTML (padrão)

Após qualquer execução de testes, um relatório HTML é gerado automaticamente:

```bash
# Abrir o último relatório HTML gerado
npm run show-report
```

O relatório inclui:
- Resumo de passes/falhas por browser
- Screenshots de falhas
- Vídeos (apenas falhas)
- Traces completos para análise detalhada

### Relatórios Allure (opcional)

O Allure fornece visualização mais rica com etapas de teste, metadados e histórico de execução.

**Executar testes e gerar Allure Report:**

```bash
npm run test:allure
```

Isto vai:
1. Executar todos os testes (ambiente QA)
2. Gerar resultados em `allure-results/`
3. Gerar relatório HTML em `allure-report/`

**Operações avançadas:**

```bash
# Gerar Allure Report a partir de resultados já existentes
npm run allure:generate

# Abrir Allure Report no navegador
npm run allure:open

# Ver todos os scripts disponíveis
npm run
```

### Environment Properties no Allure

O projeto cria `allure-results/environment.properties` automaticamente via `globalSetup.ts`, contendo:

```properties
Environment=QA
BaseURL=https://www.saucedemo.com
Node.js=vX.Y.Z
```

Isso aparece no Allure UI para rastreabilidade de qual ambiente foi testado.

### CI/CD — GitHub Actions

Um exemplo de workflow está em `.github/workflows/ci.yml`. Ele:
1. Roda em `push` para branches `main` e `master`
2. Executa testes no ambiente `qa`
3. Gera relatórios Allure e HTML
4. Faz upload de artefatos (`allure-report` e `allure-results`)

Os artefatos ficam disponíveis para download na aba de "Artifacts" do GitHub Actions por 90 dias.



## Como estender este template

### Visão geral: adicionar um novo cenário de teste

O workflow recomendado é:
1. **Criar** um novo Page Object em `pages/` (se necessário)
2. **Registrar** o novo PO em `pages/index.ts`
3. **Adicionar** a fixture em `fixtures/page-fixtures.ts` (se necessário)
4. **Escrever** o teste em `tests/` consumindo fixtures
5. **Executar**: `npm test`

### Adicionar um novo Page Object

1. Crie `pages/NovaPagina.ts`.
2. Estenda `BasePage` com a propriedade `page: Page` herdada.
3. Declare todos os seletores como `private readonly` (encapsulamento).
4. Exponha apenas métodos públicos (ações e consultas — sem asserções!).
5. Adicione o novo PO a `pages/index.ts` como `export { NovaPagina }`.
6. Registre a fixture em `fixtures/page-fixtures.ts`:

```typescript
novaPagina: async ({ page }, use) => {
  const np = new NovaPagina(page);
  await use(np);
},
```

**Exemplo: novo Page Object**

```typescript
// pages/CartPage.ts
import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = this.page.locator('[data-test="cart-item"]');
    this.checkoutButton = this.page.locator('button.checkout');
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
```

### Adicionar nova massa de dados

1. Atualize `data/login-massa.json`.
2. Ajuste o tipo `TestData` em `fixtures/page-fixtures.ts`.
3. Use `data` nos specs com autocompletar TypeScript.

**Exemplo: adicionar produto**

```json
{
  "products": {
    "firstProduct": { "id": "sauce-labs-backpack", "name": "Sauce Labs Backpack" },
    "newProduct": { "id": "new-item", "name": "New Item" }
  }
}
```

### Adicionar novo fluxo de teste

1. Crie um novo arquivo `tests/novo-fluxo.spec.ts`.
2. Importe fixtures de `../fixtures/page-fixtures`:
   ```typescript
   import { test, expect } from '../fixtures/page-fixtures';
   ```
3. Consuma fixtures via injeção:
   ```typescript
   test('meu teste', async ({ loginPage, inventoryPage, data, allure }) => {
     // seu código aqui
   });
   ```
4. Use apenas `expect(...)` assertions dentro do spec (nunca dentro de Page Objects).

## Exemplos de uso

### Exemplo básico: teste de login

```typescript
// tests/Login.spec.ts
import { test, expect } from '../fixtures/page-fixtures';

test('fazer login com usuário válido', async ({ page, loginPage, inventoryPage, data }) => {
  // Arrange: fixture já navegou para login page automaticamente
  
  // Act: execute a ação
  await loginPage.login(data.standardUser.username, data.standardUser.password);
  
  // Assert: valide os resultados
  await expect(page).toHaveURL(/\/inventory\.html$/);
  await expect(await inventoryPage.isVisible()).toBe(true);
});
```

**Estrutura esperada (AAA Pattern):**
- **Arrange** (opcional): fixture já configura o estado inicial
- **Act**: chame métodos dos Page Objects
- **Assert**: use `expect(...)` para validações

**⚠️ Padrão antigo (não fazer):**

```typescript
// ❌ Hardcode de dados
const username = 'standard_user';

// ❌ Assertions dentro do Page Object (LoginPage não deve ter expect!)
```

### Exemplo: usar os helpers `allure`

O template expõe uma fixture leve `allure` com helpers para anotações (severity, issue link, etc.). Útil para rastreabilidade em Allure Reports.

```typescript
import { test, expect } from '../fixtures/page-fixtures';

test('fazer login - caso crítico', async ({ loginPage, data, allure }) => {
  // Metadados para o relatório Allure
  allure.label('severity', 'critical');
  allure.issue('PROJECT-123');
  allure.link('https://tickets.example/PROJECT-123', 'Ticket');

  // Fluxo normal do teste
  await loginPage.login(data.standardUser.username, data.standardUser.password);
  await expect(page).toHaveURL(/\/inventory\.html$/);
});
```

**Helpers disponíveis:**
- `allure.label(name, value)`: adiciona label (ex.: severity, priority)
- `allure.link(url, title?)`: adiciona link para ticket/doc
- `allure.issue(id)`: associa com ID de issue
- `allure.attachment(name, data, contentType?)`: anexa artefato (screenshot, log, etc.)

### Exemplo: anexar artefatos com `allure.attachment`

Além das anotações, o helper `attachment` permite anexar arquivos ou buffers ao `testInfo`, útil para logs, capturas manuais ou dumps em falhas.

```typescript
import { test, expect } from '../fixtures/page-fixtures';

test('exemplo de attachment', async ({ page, allure }) => {
  // screenshot como buffer
  const png = await page.screenshot();
  await allure.attachment('screenshot', png, 'image/png');

  // anexar arquivo existente (passa path)
  await allure.attachment('server-logs', './build/logs/test.log', 'text/plain');

  // anexo de texto simples
  await allure.attachment('notes', 'debug info: value=42', 'text/plain');
});
```

**Tipos suportados:**

| Tipo | Content-Type | Exemplo |
|------|--------------|---------|
| Buffer (PNG/JPG) | `image/png` | screenshot |
| Arquivo | `text/plain` | logs, HTML |
| String | `application/json` | dados estruturados |

## Troubleshooting

### ❌ Erro: "Cannot find module 'allure-playwright'"

**Solução:**
```bash
npm install allure-playwright allure-commandline --save-dev
```

### ❌ Testes passam localmente mas falham em CI

**Verificação:**
1. Confirme que CI usa `npm install` (não `npm ci --legacy-peer-deps`)
2. Verifique se a versão de Node.js é ≥ 18.x
3. Check `NODE_ENV` está configurado corretamente no workflow

Exemplo GitHub Actions:
```yaml
- run: npm ci
- run: cross-env NODE_ENV=qa npm run test:qa
```

### ❌ Relatório HTML vazio ou não aparece

**Solução:**
```bash
# Listar e abrir manualmente o último relatório
npx playwright show-report
```

### ❌ Allure Report não abre

**Verificação:**
```bash
# Confirmar que os resultados foram gerados
ls -la allure-results/

# Regenerar manualmente
npm run allure:generate

# Tentar abrir
npm run allure:open
```

## Referências

- 📚 [Playwright Documentation](https://playwright.dev)
- 📚 [Playwright Test Framework](https://playwright.dev/docs/test-intro)
- 📊 [Allure Report](https://docs.qameta.io/allure/)
- 📖 [Page Object Model Pattern](https://playwright.dev/docs/pom)
- 🧪 [Best Practices for E2E Testing](https://playwright.dev/docs/best-practices)

## Observações finais

Este template foi pensado para ser um ponto de partida institucional e didático.
Use-o como referência para garantir **consistência**, **legibilidade** e **escalabilidade** nos seus projetos de automação.

---

**Última atualização:** 2026-06-07  
**Versão do template:** 1.0.0  
**Status:** ✅ Pronto para produção
