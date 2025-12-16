# AuthFlow - Sistema de Autenticação Completo

Sistema de autenticação serverless com Vue 3 e AWS Lambda.

## 🚀 Stack Tecnológica

### Frontend
- Vue 3 (Options API)
- Quasar Framework
- TypeScript (strict mode)
- Vite

### Backend
- AWS Lambda
- API Gateway
- DynamoDB (single table design)
- TypeScript

### Infraestrutura
- Serverless Framework 4
- LocalStack (desenvolvimento local)
- Docker & DevContainer
- GitHub Actions (CI/CD)

## 📋 Features

- ✅ Register com verificação de email
- ✅ Login com JWT + Refresh Token
- ✅ Reset de senha
- ✅ MFA/2FA
- ✅ OAuth (Google, GitHub)
- ✅ Health check endpoint
- ✅ Logout

## 🛠️ Setup do Projeto

### Pré-requisitos
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose
- AWS CLI (para deploy em staging/prod)

### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd authflow

# Instalar dependências (todos os workspaces)
npm install

# Copiar exemplo de variáveis de ambiente
cp .env.example .env
```

### Desenvolvimento Local

```bash
# Iniciar LocalStack (AWS local)
docker-compose up -d

# Rodar backend (serverless offline)
npm run dev:backend

# Rodar frontend (em outro terminal)
npm run dev:frontend
```

## 📁 Estrutura do Projeto

```
authflow/
├── frontend/          # Aplicação Vue 3
├── backend/           # Lambda functions
├── infra/             # Serverless Framework configs
├── .devcontainer/     # Ambiente Docker padronizado
└── .github/workflows/ # CI/CD pipelines
```

## 🌍 Ambientes

- **dev**: Local com LocalStack
- **staging**: AWS sa-east-1 (ambiente de testes)
- **prod**: AWS sa-east-1 (produção)

## 🧪 Testes

```bash
# Rodar todos os testes
npm test

# Testes por workspace
npm run test --workspace=frontend
npm run test --workspace=backend
```

## 🚀 Deploy

```bash
# Deploy dev (automático no push para main)
npm run deploy:dev

# Deploy staging (via tag)
git tag staging-v1.0.0
git push origin staging-v1.0.0

# Deploy prod (via tag)
git tag prod-v1.0.0
git push origin prod-v1.0.0
```

## 📝 Conventional Commits

Este projeto usa conventional commits:

- `feat:` nova funcionalidade
- `fix:` correção de bug
- `docs:` documentação
- `chore:` tarefas de manutenção
- `test:` testes
- `refactor:` refatoração

## 📄 Licença

MIT

## 👤 Autor

Anderson - Desenvolvedor Full-Stack