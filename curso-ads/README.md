# DevFlix — Frontend React do Tutorial 4

Frontend responsivo que consulta os cursos e aulas cadastrados no PostgreSQL por meio do Gateway NestJS.

## Rodar no VS Code

Na raiz do repositório (que contém `package.json`):

```powershell
npm install
npm run start:dev:gateway  # terminal 1: API HTTP na porta 3000
npm run start:dev:web      # terminal 2: React/Vite na porta 5173
```

Abra <http://localhost:5173>.

O Gateway e o PostgreSQL devem ter sido configurados conforme o Tutorial 4. A rota `GET /courses` deve retornar cursos antes de abrir o frontend. O React consulta `/api/courses` e o Vite redireciona para a porta 3000 (veja `vite.config.js`).

Recursos: catálogo real, busca, categorias, favoritos, player YouTube, lista de aulas e progresso local. Favoritos e progresso são armazenados somente neste navegador, usando `localStorage`.

Para instruções completas, veja `../FRONTEND_TUTORIAL04.md`.

## Correção do frontend — novembro/2026

A correção da consulta à API, da navegação do player e dos estados de erro está documentada em [`../CORRECAO_FRONTEND.md`](../CORRECAO_FRONTEND.md).
Para validar sem acesso ao banco, execute `npm run test` nesta pasta (7 testes). Para compilar: `npm run build`.
