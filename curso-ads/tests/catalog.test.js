import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { filterCourses, loadCatalog, normalizeCourses, normalizeText } from '../src/lib/catalog.js';

const fixture = [
  { id: 2, title: 'Node.js', description: 'Backend', slug: 'nodejs', published: true, categoryId: 2, category: { id: 2, name: 'Desenvolvimento Backend' }, lessons: [ { id: 20, position: 2 }, { id: 10, position: 1 } ] },
  { id: 1, title: 'React', description: 'Introdução', published: true, categoryId: 1, category: { id: 1, name: 'Desenvolvimento Frontend' }, lessons: [] },
  { id: 3, title: 'Rascunho', description: '', published: false, categoryId: 1, lessons: [] },
];

test('rejeita JSON da API em formato incorreto', () => {
  assert.throws(() => normalizeCourses({ courses: fixture }), /lista JSON/);
});

test('organiza as aulas pela posição e preserva relações', () => {
  const catalog = normalizeCourses(fixture);
  assert.deepEqual(catalog[0].lessons.map((lesson) => lesson.id), [10, 20]);
  assert.equal(catalog[0].category.name, 'Desenvolvimento Backend');
});

test('procura sem distinção entre acentos e maiúsculas', () => {
  assert.equal(normalizeText('IntroduÇÃO'), 'introducao');
  assert.deepEqual(filterCourses(normalizeCourses(fixture), { query: 'introducao' }).map((c) => c.id), [1]);
});

test('filtros de categoria, favoritos e publicação funcionam juntos', () => {
  const catalog = normalizeCourses(fixture);
  assert.deepEqual(filterCourses(catalog, { category: '1', savedOnly: true, saved: [1, 3] }).map((c) => c.id), [1]);
  assert.equal(filterCourses(catalog).length, 2);
});

test('consulta GET /api/courses e interpreta o JSON da API', async () => {
  const requested = [];
  const catalog = await loadCatalog({ fetcher: async (url, options) => {
    requested.push([url, options.headers.Accept]);
    return new Response(JSON.stringify(fixture), { headers: { 'content-type': 'application/json; charset=utf-8' } });
  } });
  assert.deepEqual(requested, [['/api/courses', 'application/json']]);
  assert.equal(catalog.length, 3);
});

test('informa erro útil quando o Gateway está indisponível', async () => {
  await assert.rejects(loadCatalog({ fetcher: async () => new Response('Not Found', { status: 502 }) }), /HTTP 502/);
});

test('informa erro quando o proxy retorna HTML no lugar de JSON', async () => {
  await assert.rejects(loadCatalog({ fetcher: async () => new Response('<html/>', { headers: { 'content-type': 'text/html' } }) }), /não retornou JSON/);
});

// Não exige PostgreSQL: confere associação entre vídeo, curso e posição no seed.
test('três vídeos estão cadastrados, cada qual no curso correspondente', () => {
  const seed = readFileSync(new URL('../../prisma/catalog/seed.ts', import.meta.url), 'utf8');
  const expected = [
    { id: 'ERflhpiMc1o', course: 'react', position: 3, title: 'Curso de React JS para Iniciantes com Projeto' },
    { id: 'xEKo29OWILE', course: 'git', position: 1, title: 'Curso de Git e GitHub — O que é versionamento?' },
    { id: 'cz7AoKGcwlY', course: 'htmlCss', position: 1, title: 'Um projeto completo usando HTML e CSS' },
  ];
  for (const { id, course, position, title } of expected) {
    const matches = [...seed.matchAll(new RegExp(`videoId: '${id}'`, 'g'))];
    assert.equal(matches.length, 1, `ID ausente ou duplicado: ${id}`);
    const context = seed.slice(Math.max(0, matches[0].index - 350), matches[0].index + 80);
    assert.ok(context.includes(`courseId: ${course}.id`), `${id}: curso incorreto`);
    assert.ok(context.includes(`title: '${title}'`), `${id}: título incorreto`);
    assert.ok(context.includes(`position: ${position}`), `${id}: posição incorreta`);
  }
  assert.match(seed, /where: \{ slug: 'git-github-versionamento' \}/);
  assert.match(seed, /where: \{ slug: 'html-css-projeto-completo' \}/);
});
