import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/catalog/client';

const connectionString = process.env.CATALOG_DATABASE_URL;
if (!connectionString) {
  throw new Error('CATALOG_DATABASE_URL não configurada no arquivo .env');
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main(): Promise<void> {
  console.log('Iniciando seed do catálogo DevFlix...');

  // Categorias: use upsert para poder repetir o seed sem criar duplicatas.
  const frontend = await prisma.category.upsert({
    where: { slug: 'frontend' },
    update: { name: 'Desenvolvimento Frontend' },
    create: { slug: 'frontend', name: 'Desenvolvimento Frontend' },
  });
  const backend = await prisma.category.upsert({
    where: { slug: 'backend' },
    update: { name: 'Desenvolvimento Backend' },
    create: { slug: 'backend', name: 'Desenvolvimento Backend' },
  });
  const database = await prisma.category.upsert({
    where: { slug: 'banco-de-dados' },
    update: { name: 'Banco de Dados' },
    create: { slug: 'banco-de-dados', name: 'Banco de Dados' },
  });
  const tools = await prisma.category.upsert({
    where: { slug: 'ferramentas-de-desenvolvimento' },
    update: { name: 'Ferramentas de Desenvolvimento' },
    create: { slug: 'ferramentas-de-desenvolvimento', name: 'Ferramentas de Desenvolvimento' },
  });

  // Cursos existentes (Tutorial 4).
  const react = await prisma.course.upsert({
    where: { slug: 'react-iniciantes' },
    update: {
      title: 'React para Iniciantes',
      description: 'Fundamentos do React, componentes, JSX e projeto prático.',
      thumbnail: 'https://i.ytimg.com/vi/ERflhpiMc1o/hqdefault.jpg',
      categoryId: frontend.id,
      published: true,
    },
    create: {
      slug: 'react-iniciantes',
      title: 'React para Iniciantes',
      description: 'Fundamentos do React, componentes, JSX e projeto prático.',
      thumbnail: 'https://i.ytimg.com/vi/ERflhpiMc1o/hqdefault.jpg',
      categoryId: frontend.id,
      published: true,
    },
  });
  const node = await prisma.course.upsert({
    where: { slug: 'nodejs-iniciantes' },
    update: {
      title: 'Node.js para Iniciantes',
      description: 'Introdução ao ambiente Node.js.',
      categoryId: backend.id,
      published: true,
    },
    create: {
      slug: 'nodejs-iniciantes',
      title: 'Node.js para Iniciantes',
      description: 'Introdução ao ambiente Node.js.',
      categoryId: backend.id,
      published: true,
    },
  });
  const sql = await prisma.course.upsert({
    where: { slug: 'sql-fundamentos' },
    update: {
      title: 'Fundamentos de SQL',
      description: 'Introdução aos bancos de dados relacionais.',
      categoryId: database.id,
      published: true,
    },
    create: {
      slug: 'sql-fundamentos',
      title: 'Fundamentos de SQL',
      description: 'Introdução aos bancos de dados relacionais.',
      categoryId: database.id,
      published: true,
    },
  });

  // Dois novos cursos organizados por assunto, com vídeos informados pelo usuário.
  const git = await prisma.course.upsert({
    where: { slug: 'git-github-versionamento' },
    update: {
      title: 'Git e GitHub — Controle de Versões',
      description: 'Gustavo Guanabara (Curso em Vídeo): repositórios, GitHub e versionamento de projetos.',
      thumbnail: 'https://i.ytimg.com/vi/xEKo29OWILE/hqdefault.jpg',
      categoryId: tools.id,
      published: true,
    },
    create: {
      slug: 'git-github-versionamento',
      title: 'Git e GitHub — Controle de Versões',
      description: 'Gustavo Guanabara (Curso em Vídeo): repositórios, GitHub e versionamento de projetos.',
      thumbnail: 'https://i.ytimg.com/vi/xEKo29OWILE/hqdefault.jpg',
      categoryId: tools.id,
      published: true,
    },
  });
  const htmlCss = await prisma.course.upsert({
    where: { slug: 'html-css-projeto-completo' },
    update: {
      title: 'HTML5 e CSS3 — Projeto Completo',
      description: 'Gustavo Guanabara (Curso em Vídeo): criação de páginas e responsividade.',
      thumbnail: 'https://i.ytimg.com/vi/cz7AoKGcwlY/hqdefault.jpg',
      categoryId: frontend.id,
      published: true,
    },
    create: {
      slug: 'html-css-projeto-completo',
      title: 'HTML5 e CSS3 — Projeto Completo',
      description: 'Gustavo Guanabara (Curso em Vídeo): criação de páginas e responsividade.',
      thumbnail: 'https://i.ytimg.com/vi/cz7AoKGcwlY/hqdefault.jpg',
      categoryId: frontend.id,
      published: true,
    },
  });

  const lessons = [
    // Aulas originais do Tutorial 4: preservadas.
    {
      courseId: react.id,
      title: 'Introdução ao React',
      description: 'Primeiros conceitos de React.',
      videoId: 'Tn6-PIqc4UM',
      position: 1,
    },
    {
      courseId: react.id,
      title: 'Componentes e JSX',
      description: 'Organizando interfaces em componentes.',
      videoId: 'w7ejDZ8SWv8',
      position: 2,
    },
    {
      courseId: node.id,
      title: 'Introdução ao Node.js',
      description: 'Conhecendo o ambiente Node.js.',
      videoId: 'TlB_eWDSMt4',
      position: 1,
    },
    {
      courseId: sql.id,
      title: 'Introdução aos Bancos de Dados',
      description: 'Conceitos básicos de SQL.',
      videoId: 'HXV3zeQKqGY',
      position: 1,
    },
    // Vídeo 1: Hora de Codar — Matheus Battisti.
    {
      courseId: react.id,
      title: 'Curso de React JS para Iniciantes com Projeto',
      description: 'Hora de Codar — Matheus Battisti. Fundamentos do React e criação de aplicações web.',
      videoId: 'ERflhpiMc1o',
      position: 3,
    },
    // Vídeo 2: Curso em Vídeo — Gustavo Guanabara.
    {
      courseId: git.id,
      title: 'Curso de Git e GitHub — O que é versionamento?',
      description: 'Curso em Vídeo — Gustavo Guanabara. Git, repositórios, GitHub e controle de versões.',
      videoId: 'xEKo29OWILE',
      position: 1,
    },
    // Vídeo 3: Curso em Vídeo — Gustavo Guanabara.
    {
      courseId: htmlCss.id,
      title: 'Um projeto completo usando HTML e CSS',
      description: 'Curso em Vídeo — Gustavo Guanabara. Site com HTML5, CSS3 e responsividade.',
      videoId: 'cz7AoKGcwlY',
      position: 1,
    },
  ];

  // Chave composta (courseId, position): reexecutar não duplica aulas.
  for (const lesson of lessons) {
    const { courseId, position, ...data } = lesson;
    await prisma.lesson.upsert({
      where: { courseId_position: { courseId, position } },
      update: data,
      create: { ...data, courseId, position },
    });
  }

  // Se o seed intermediário criou a Videoteca com três aulas genéricas,
  // removemos SOMENTE esse conjunto exato para evitar duplicar o catálogo.
  // Qualquer dado personalizado no curso legado é preservado.
  const legacy = await prisma.course.findUnique({
    where: { slug: 'videoteca-youtube' },
    include: { lessons: true },
  });
  const legacyLessons = [
    ['ERflhpiMc1o', 'Vídeo do YouTube 01', 1],
    ['xEKo29OWILE', 'Vídeo do YouTube 02', 2],
    ['cz7AoKGcwlY', 'Vídeo do YouTube 03', 3],
  ] as const;
  if (legacy?.title === 'Videoteca do YouTube' && legacy.lessons.length === 3 &&
      legacyLessons.every(([videoId, title, position]) => legacy.lessons.some(
        (item) => item.videoId === videoId && item.title === title && item.position === position,
      ))) {
    await prisma.course.delete({ where: { id: legacy.id } }); // Aulas genéricas apagadas por Cascade.
    const oldCategory = await prisma.category.findUnique({ where: { slug: 'videos-youtube' } });
    if (oldCategory && await prisma.course.count({ where: { categoryId: oldCategory.id } }) === 0) {
      await prisma.category.delete({ where: { id: oldCategory.id } });
    }
    console.log('Videoteca genérica anterior removida; vídeos organizados por assunto.');
  }

  console.log('Seed concluído: 5 cursos previstos e 7 aulas de exemplo (3 novos vídeos).');
}

main()
  .catch((error: unknown) => {
    console.error('Erro ao executar o seed do catálogo:', error);
    process.exitCode = 1;
  })
  .finally(async () => { await prisma.$disconnect(); });
