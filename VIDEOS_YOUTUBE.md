# DevFlix — três vídeos incorporados ao catálogo (Branch_10112026)

A inclusão utiliza os títulos e canais informados pelo usuário e **não substitui as quatro aulas originais** do Tutorial 4. A aplicação usa `Category`, `Course` e `Lesson` do Prisma e o player React já existente.

| Vídeo | Identificador | Curso DevFlix | Posição | Canal informado |
|---|---|---|---|---|
| Curso de React JS para Iniciantes com Projeto | `ERflhpiMc1o` | React para Iniciantes | 3 | Hora de Codar — Matheus Battisti |
| Curso de Git e GitHub — O que é versionamento? | `xEKo29OWILE` | Git e GitHub — Controle de Versões (novo) | 1 | Curso em Vídeo — Gustavo Guanabara |
| Um projeto completo usando HTML e CSS | `cz7AoKGcwlY` | HTML5 e CSS3 — Projeto Completo (novo) | 1 | Curso em Vídeo — Gustavo Guanabara |

A estrutura esperada em um catálogo sem outros dados é **4 categorias, 5 cursos e 7 aulas**. O seed usa `upsert` e pode ser repetido sem duplicar registros. Também remove de forma condicional a *Videoteca do YouTube* genérica de uma atualização intermediária, **somente** quando esse curso ainda contém exatamente os três registros genéricos. Cursos e aulas personalizados são preservados.

## Arquivos modificados

- `prisma/catalog/seed.ts`: cadastro das categorias, dois novos cursos e três videoaulas; miniaturas do YouTube e tratamento de dados legados.
- `curso-ads/src/components/CourseCard.jsx`: cartões de Git/GitHub e HTML/CSS.
- `curso-ads/src/App.css`: cores de fallback dos novos cartões.
- `curso-ads/tests/catalog.test.js`: teste da associação correta entre ID, aula e curso.
- `README.md`: documentação da inclusão.

## Instalar (PowerShell, na pasta Branch_10112026_Git)

1. Baixe `DevFlix_3_Videos_Organizados_Atualizacao.zip` e extraia o conteúdo **na raiz do repositório**, onde estão `.git` e `package.json`. Não extraia em `curso-ads`.
2. Mantenha o PostgreSQL configurado e rodando, com `CATALOG_DATABASE_URL` definido em `.env`.
3. Rode:

```powershell
npm run db:seed:catalog
npm run test --workspace curso-ads
npm run build:web
```

4. Em um terminal, inicie o Gateway: `npm run start:dev:gateway`. Em outro terminal, na mesma raiz, inicie o React: `npm run start:dev:web`.
5. API: `http://localhost:3000/courses`. Interface: `http://localhost:5173` (ou a porta que o Vite informar).

## Conferência no navegador

No catálogo DevFlix, abra **React para Iniciantes** e selecione a aula **Curso de React JS para Iniciantes com Projeto**. Os cursos **Git e GitHub — Controle de Versões** e **HTML5 e CSS3 — Projeto Completo** aparecem como novos cartões. O player usa `https://www.youtube-nocookie.com/embed/<videoId>`.

Se algum vídeo impedir a incorporação no site, use o link **Abrir vídeo diretamente no YouTube** dentro do player. Isso depende das permissões do proprietário no YouTube, não do banco de dados.

## Enviar à branch

```powershell
git switch Branch_10112026
git status
git add prisma/catalog/seed.ts curso-ads/src/components/CourseCard.jsx curso-ads/src/App.css curso-ads/tests/catalog.test.js VIDEOS_YOUTUBE.md README.md
git commit -m "Inclui videos de React, Git GitHub e HTML CSS no DevFlix"
git push origin Branch_10112026
```
