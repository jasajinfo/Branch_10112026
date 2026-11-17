# DevFlix — frontend visual integrado ao Tutorial 4

Este pacote mantém o backend do Tutorial 4 e substitui a interface React estática pela interface DevFlix ligada ao **PostgreSQL via NestJS**.

## O que foi implementado

- Interface responsiva com cabeçalho, hero, catálogo, cards, seção explicativa e rodapé;
- Requisição real a `GET /courses`, sem dados de exemplo fixos no frontend;
- Proxy Vite: `http://localhost:5173/api/courses` encaminha para `http://127.0.0.1:3000/courses`;
- Busca por texto (título, descrição e categoria) e filtro dinâmico de categorias;
- Exibição apenas de cursos publicados (`published: true`);
- Visualização das aulas de cada curso no modal; player YouTube sem cookies com incorporação **apenas após o clique**;
- Lista de favoritos e progresso por aula em `localStorage` (somente no navegador atual, sem login);
- Estados de carregamento, falha de conexão e ausência de resultados;
- Correção do endereço de incorporação de vídeos (agora `youtube-nocookie.com/embed/ID`).

## Como iniciar no Windows / VS Code

Abra **dois terminais** na raiz da pasta do projeto (aquela que contém `package.json`, `apps/`, `prisma/` e `curso-ads/`).

### Terminal 1: API (que já funcionou no Tutorial 4)

```powershell
npm run start:dev:gateway
```

Confira `http://localhost:3000/courses`. A lista de cursos deve aparecer como JSON. Este frontend não precisa de RabbitMQ nem do microserviço Orders para consultar o catálogo; só da API e do PostgreSQL configurados.

### Terminal 2: React

```powershell
npm install
npm run start:dev:web
```

Abra **http://localhost:5173** para ver o site.

Você também pode executar o React diretamente:

```powershell
cd curso-ads
npm install
npm run dev
```

Se a porta 3000 não estiver ativa, o frontend mostra uma mensagem de falha de conexão e um botão **Tentar novamente**. Se outro serviço usa a porta 3000, edite `curso-ads/vite.config.js` e altere o destino do proxy; alternativamente, defina a variável `DEV_API_TARGET` para o endereço do Gateway antes de iniciar o Vite.

## Enviar apenas esta melhoria para a branch que já existe

Entre na pasta **clonada** onde existe a pasta `.git`, na branch `Branch_10112026`. Copie o conteúdo deste pacote para lá (sem copiar `.git`, `node_modules`, `.env` ou `dist`). Depois execute:

```powershell
git status
git add curso-ads FRONTEND_TUTORIAL04.md
git commit -m "Integra frontend React ao catalogo do Tutorial 4"
git push origin Branch_10112026
```

O código que está no GitHub não se atualiza automaticamente ao usar o ZIP. O push é necessário.

## Observações

- As imagens do hero já estavam no frontend anterior e foram mantidas.
- Alguns IDs do YouTube do seed são didáticos e podem estar indisponíveis ou bloquear incorporação. Nesse caso, substitua por IDs de vídeos autorizados.
- O progresso é registrado **somente no localStorage do navegador**, não no banco nem em uma conta de usuário.
- A configuração do proxy Vite é para desenvolvimento local. Em produção, disponibilize a rota `/api/*` por um proxy reverso ou configuração equivalente do servidor web.
- Não exponha senhas de bancos nem arquivos `.env` no GitHub.
