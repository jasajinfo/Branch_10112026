/** Utilitários puros do catálogo: também são testados sem iniciar a API. */
export function normalizeText(value) {
  return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

export function normalizeCourses(payload) {
  if (!Array.isArray(payload)) {
    throw new Error('Formato inválido: a API /courses não retornou uma lista JSON.');
  }

  return payload
    .filter((course) => course && Number.isInteger(course.id) && typeof course.title === 'string')
    .map((course) => ({
      ...course,
      title: course.title.trim(),
      description: typeof course.description === 'string' ? course.description : '',
      category: course.category && typeof course.category === 'object' ? course.category : null,
      lessons: (Array.isArray(course.lessons) ? [...course.lessons] : [])
        .filter((lesson) => lesson && Number.isInteger(lesson.id))
        .sort((a, b) => (Number(a.position) || 0) - (Number(b.position) || 0)),
    }));
}

export function filterCourses(courses, { query = '', category = 'all', savedOnly = false, saved = [] } = {}) {
  const needle = normalizeText(query.trim());
  return courses.filter((course) => {
    if (course.published !== true) return false;
    if (category !== 'all' && String(course.categoryId) !== category) return false;
    if (savedOnly && !saved.includes(course.id)) return false;
    return normalizeText(`${course.title} ${course.description} ${course.category?.name ?? ''}`).includes(needle);
  });
}

/** Números de curso para favoritos; chaves "curso:aula" para progresso. */
export function readSavedList(key, mode = 'number') {
  try {
    const data = JSON.parse(window.localStorage.getItem(key) ?? '[]');
    if (!Array.isArray(data)) return [];
    return [...new Set(data.filter((item) => mode === 'number'
      ? Number.isInteger(item) && item > 0
      : typeof item === 'string' && /^\d+:\d+$/.test(item)))];
  } catch {
    return [];
  }
}

/** Requisição da API NestJS, isolada para poder ser testada sem React. */
export async function loadCatalog({ apiBase = '/api', signal, fetcher = fetch } = {}) {
  const base = apiBase.replace(/\/$/, '');
  const response = await fetcher(`${base}/courses`, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`A API respondeu com HTTP ${response.status}.`);
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error('O servidor não retornou JSON. Confira o proxy /api do Vite.');
  }
  return normalizeCourses(await response.json());
}
