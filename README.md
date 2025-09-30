# Sistema de Gerenciamento de Dependentes

Um sistema completo para gerenciamento de titulares e seus dependentes, desenvolvido com Next.js 15, TypeScript 5 e React 19. O sistema oferece funcionalidades de cadastro, upload de documentos, validação automatizada e acompanhamento de status.

## 🚀 Funcionalidades Principais

- **Pesquisa e Listagem de Titulares**: Interface intuitiva com barra de pesquisa e visualização de funcionários
- **Cadastro de Dependentes**: Fluxo step-by-step para registro completo de dependentes
- **Upload de Documentos**: Sistema seguro para envio de documentos obrigatórios
- **Validação Automatizada**: Análise especializada dos dados e documentos enviados
- **Acompanhamento de Status**: Comunicação clara sobre aprovações e pendências

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React com SSR, SSG, CSR e ISR
- **TypeScript 5** - Tipagem estática para maior robustez
- **React 19** - Biblioteca para interfaces de usuário
- **Tailwind CSS 4** - Framework CSS utilitário
- **Jest** - Framework de testes
- **PostgreSQL** - Banco de dados relacional
- **Docker** - Containerização do banco de dados

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Docker e Docker Compose
- Git

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd sistema-gerenciamento-dependentes
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure o banco de dados

Execute o Docker Compose para criar o banco PostgreSQL:

```bash
docker-compose up -d
```

### 4. Configure as variáveis de ambiente

Copie o arquivo de exemplo e configure suas variáveis:

```bash
cp .env.local-example .env.local
```

Edite o arquivo `.env.local` e preencha todas as informações necessárias conforme as instruções no arquivo.

### 5. Execute as migrações (se aplicável)

```bash
npm run db:migrate
# ou
yarn db:migrate
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) para ver a aplicação.

## 🐳 Docker Compose - PostgreSQL

O projeto inclui um arquivo `docker-compose.yml` para facilitar a configuração do banco de dados:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: dependentes_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: dependentes_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres123
      POSTGRES_HOST_AUTH_METHOD: trust
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    networks:
      - dependentes_network

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: dependentes_pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin123
      PGADMIN_CONFIG_SERVER_MODE: 'False'
    ports:
      - "8080:80"
    depends_on:
      - postgres
    networks:
      - dependentes_network

volumes:
  postgres_data:

networks:
  dependentes_network:
    driver: bridge
```

### Comandos úteis do Docker:

```bash
# Iniciar os serviços
docker-compose up -d

# Parar os serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Reiniciar apenas o PostgreSQL
docker-compose restart postgres
```

## ⚙️ Configuração de Ambiente

O arquivo `.env.local-example` contém todas as variáveis necessárias. **Copie para `.env.local` e configure:**

```bash
# Configuração do Banco de Dados
DATABASE_URL=
STACKSPOT_REALM=
STACKSPOT_CLIENT_ID=
STACKSPOT_CLIENT_SECRET=
STACKSPOT_GRANT_TYPE=
STACKSPOT_AGENT_ID=

# Ambiente
NODE_ENV="development"
```

## 🧪 Testes

Execute os testes com Jest:

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage
```

## 📁 Estrutura do Projeto

```
├── app/
│   ├── api/              # Endpoints da API
│   ├── components/       # Componentes reutilizáveis
│   ├── contexts/         # Contextos React (AppContext)
│   ├── types/           # Definições de tipos TypeScript
│   └── pages/           # Páginas da aplicação
├── public/              # Arquivos estáticos
├── tests/               # Testes Jest
├── docker-compose.yml   # Configuração do banco
├── .env.local-example   # Exemplo de variáveis de ambiente
└── README.md
```

## 🎯 Uso da Aplicação

### 1. Pesquisa de Titulares
- Acesse a página principal
- Use a barra de pesquisa para encontrar funcionários
- Clique no card do titular para acessar o cadastro de dependentes

### 2. Cadastro de Dependentes
- **Passo 1**: Preencha os dados pessoais do dependente
- **Passo 2**: Faça upload dos documentos obrigatórios
- **Passo 3**: Confirme as informações e envie para análise

### 3. Acompanhamento
- Visualize o status da validação
- Receba feedback sobre aprovações ou pendências
- Corrija dados quando necessário

## 🔄 Padrões de Renderização

O projeto utiliza diferentes estratégias de renderização do Next.js:

- **SSR**: Para páginas com dados dinâmicos
- **SSG**: Para conteúdo estático
- **CSR**: Para interações do usuário
- **ISR**: Para atualizações incrementais

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verifique a [documentação](docs/)
2. Entre em contato com a equipe de desenvolvimento abrindo uma issue.