# ReactSubApp01

Subaplicação React para gestão de leads, projetada para ser hospedada dentro de uma aplicação ASP.NET MVC existente no caminho `/apps/subapp01`.

## Funcionalidades

- Autenticação automática baseada em token JWT armazenado em cookie compartilhado com o aplicativo pai.
- Página inicial com filtros dinâmicos para busca de leads e listagem em tabela responsiva.
- Página de detalhes de lead com edição de status, observações internas e registro de comentários na linha do tempo.
- Integração com APIs REST utilizando Axios e React Query, com anexação automática do token JWT ao cabeçalho Authorization.

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz (opcional) para definir a URL base da API:

   ```bash
   VITE_API_URL=https://nome-do-cliente.dominio.com.br/api
   ```

3. Execute o projeto em modo desenvolvimento:

   ```bash
   npm run dev
   ```

   O servidor iniciará em `http://localhost:5173/apps/subapp01`.

4. Gere o build para produção:

   ```bash
   npm run build
   ```

## Integração com ASP.NET MVC

- Publique o build (`npm run build`) e sirva os arquivos gerados em `dist/` através de sua aplicação ASP.NET MVC no caminho `/apps/subapp01`.
- Garanta que o cookie `app_token` esteja disponível para o subaplicativo, contendo um JWT válido com os campos `sub`, `name` e `email`.
- Configure o roteamento reverso para que todas as requisições iniciadas por `/apps/subapp01` sejam direcionadas para a aplicação React.
