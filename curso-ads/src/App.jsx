import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import CourseCard from './components/CourseCard';
import VideoPlayer from './components/VideoPlayer';
import Footer from './components/Footer';
import Icon from './components/Icon';
import { filterCourses, loadCatalog, readSavedList } from './lib/catalog';
import './App.css';

const scrollToCourses = () => document.querySelector('#cursos')?.scrollIntoView({ behavior: 'smooth' });

export default function App() {
  const [courses, setCourses] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [loadState, setLoadState] = useState('loading');
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [savedOnly, setSavedOnly] = useState(false);
  const [saved, setSaved] = useState(() => readSavedList('devflix:saved', 'number'));
  const [completed, setCompleted] = useState(() => readSavedList('devflix:completed', 'lesson'));
  const [openedCourseId, setOpenedCourseId] = useState(null);

  // Requisição cancelável: evita respostas antigas sobrescreverem uma atualização nova.
  useEffect(() => {
    const controller = new AbortController();
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');

    async function loadCourses() {
      setLoadState('loading');
      setLoadError('');
      try {
        const normalized = await loadCatalog({ apiBase, signal: controller.signal });
        if (controller.signal.aborted) return;
        setCourses(normalized);
        setLoadState('success');
      } catch (error) {
        if (controller.signal.aborted) return;
        setLoadError(error instanceof Error ? error.message : 'Falha inesperada ao acessar a API.');
        setLoadState('error');
      }
    }

    loadCourses();
    return () => controller.abort();
  }, [reloadKey]);

  const retry = useCallback(() => setReloadKey((key) => key + 1), []);
  useEffect(() => { try { window.localStorage.setItem('devflix:saved', JSON.stringify(saved)); } catch { /* modo privado */ } }, [saved]);
  useEffect(() => { try { window.localStorage.setItem('devflix:completed', JSON.stringify(completed)); } catch { /* modo privado */ } }, [completed]);

  const publicCourses = useMemo(() => courses.filter((course) => course.published === true), [courses]);
  const categories = useMemo(() => {
    const categoryNames = new Map();
    for (const course of publicCourses) if (course.category?.id != null) categoryNames.set(String(course.category.id), course.category.name);
    return [...categoryNames].map(([id, name]) => ({ id, name }));
  }, [publicCourses]);
  const results = useMemo(() => filterCourses(courses, { query, category, savedOnly, saved }),
    [courses, query, category, savedOnly, saved]);
  const lessonsCount = publicCourses.reduce((total, course) => total + (course.lessons?.length ?? 0), 0);
  const featuredCourse = publicCourses[0];
  const openedCourse = publicCourses.find((course) => course.id === openedCourseId) ?? null;
  const openCourse = (id) => setOpenedCourseId(id);
  const closeCourse = useCallback(() => setOpenedCourseId(null), []);
  const toggleSaved = (id) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleCompleted = (courseId, lessonId) => {
    const key = `${courseId}:${lessonId}`;
    setCompleted((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  };
  const resetFilters = () => { setCategory('all'); setQuery(''); setSavedOnly(false); };
  const skeletons = [1, 2, 3];
  const hasPublishedCourses = publicCourses.length > 0;

  return (
    <>
      <Header connection={loadState} savedOnly={savedOnly} savedCount={saved.length}
        onToggleSaved={() => { setSavedOnly((value) => !value); scrollToCourses(); }}/>
      <main>
        <Banner courseCount={publicCourses.length} lessonCount={lessonsCount} categoryCount={categories.length}
          featuredCourse={featuredCourse} onBrowse={scrollToCourses} onStart={() => featuredCourse && openCourse(featuredCourse.id)}/>
        <section className="catalog-section" id="cursos" aria-labelledby="catalog-title">
          <div className="container">
            <div className="catalog-head">
              <div><span className="section-kicker"><span className="kicker-dash"/> ESCOLHA O PRÓXIMO PASSO</span><h2 id="catalog-title">Seu universo de <em>possibilidades.</em></h2>
                <p>Uma coleção de cursos para colocar novas ideias em prática.</p></div>
              <div className="catalog-count"><Icon name="layers" size={19}/><strong>{publicCourses.length}</strong> cursos no catálogo</div>
            </div>
            <div className="catalog-tools">
              <label className="catalog-search"><Icon name="search" size={21}/><span className="sr-only">Buscar cursos</span>
                <input type="search" placeholder="Busque por curso, assunto ou tecnologia..." value={query} onChange={(event) => setQuery(event.target.value)}/>
                {query && <button type="button" onClick={() => setQuery('')} aria-label="Limpar busca"><Icon name="close" size={17}/></button>}
              </label>
              <div className="catalog-helper">{loadState === 'success' ? `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}` : loadState === 'loading' ? 'Carregando catálogo...' : 'API indisponível'}</div>
            </div>
            <div className="filter-row" role="group" aria-label="Filtrar cursos por categoria">
              <button type="button" className={`filter-chip ${category === 'all' ? 'is-active' : ''}`} onClick={() => setCategory('all')} aria-pressed={category === 'all'}>Todos os cursos</button>
              {categories.map((entry) => <button type="button" key={entry.id} className={`filter-chip ${category === entry.id ? 'is-active' : ''}`}
                onClick={() => setCategory(entry.id)} aria-pressed={category === entry.id}>{entry.name}</button>)}
              {savedOnly && <span className="saved-filter"><Icon name="bookmark" size={14}/> Minha lista</span>}
            </div>
            {loadState === 'loading' ? (
              <div className="courses-grid" aria-label="Carregando cursos">
                {skeletons.map((item) => <div className="course-card skeleton-card" key={item}><div className="skeleton-art"/><div className="skeleton-content"><span/><span/><span/><span/></div></div>)}
              </div>
            ) : loadState === 'error' ? (
              <div className="state-message error-state" role="alert"><span className="state-icon"><Icon name="alert-circle" size={30}/></span>
                <h3>Não conseguimos carregar os cursos</h3><p>O frontend abriu corretamente, mas não conseguiu consultar a API. Confira se o Gateway está ativo e se o proxy está configurado.</p>
                <small>{loadError}</small><button type="button" className="btn btn-primary" onClick={retry}><Icon name="refresh" size={18}/> Tentar novamente</button>
                <code>npm run start:dev:gateway</code><small>Teste a API diretamente em http://localhost:3000/courses e o proxy em http://localhost:5173/api/courses.</small>
              </div>
            ) : results.length === 0 ? (
              <div className="state-message"><span className="state-icon"><Icon name="search" size={30}/></span>
                <h3>{hasPublishedCourses ? 'Nenhum curso encontrado' : 'Nenhum curso publicado'}</h3><p>{hasPublishedCourses ? 'Experimente pesquisar outro assunto ou remover os filtros aplicados.' : 'A API está conectada, mas ainda não há cursos publicados. Execute o seed do catálogo no backend.'}</p>
                <button type="button" className="btn btn-primary" onClick={resetFilters}>Ver todos os cursos <Icon name="arrow" size={18}/></button>
              </div>
            ) : (
              <div className="courses-grid">
                {results.map((course) => <CourseCard key={course.id} course={course} onOpen={openCourse}
                  saved={saved.includes(course.id)} onToggleSave={toggleSaved}
                  completedCount={course.lessons?.filter((lesson) => completed.includes(`${course.id}:${lesson.id}`)).length ?? 0}/>) }
              </div>
            )}
            <div className="catalog-bottom-note"><Icon name="sparkle" size={17}/><span>Um passo de cada vez. Todo aprendizado começa com curiosidade.</span></div>
          </div>
        </section>
        <section className="how-section" id="como-funciona" aria-labelledby="how-title">
          <div className="container how-container">
            <div className="how-intro"><span className="section-kicker"><span className="kicker-dash"/> SIMPLES ASSIM</span><h2 id="how-title">Aprender pode ser <em>leve.</em></h2><p>Uma experiência pensada para você focar no que realmente importa: descobrir e praticar.</p></div>
            <div className="how-grid">
              <div className="how-step"><span className="how-step-num">01</span><span className="how-step-icon"><Icon name="search" size={23}/></span><h3>Encontre seu curso</h3><p>Explore o catálogo e filtre por área de interesse.</p></div>
              <div className="how-step"><span className="how-step-num">02</span><span className="how-step-icon"><Icon name="play-circle" size={23}/></span><h3>Assista às aulas</h3><p>Abra o curso e escolha a aula que deseja assistir.</p></div>
              <div className="how-step"><span className="how-step-num">03</span><span className="how-step-icon"><Icon name="check" size={23}/></span><h3>Acompanhe seu avanço</h3><p>Marque aulas concluídas e continue de onde parou neste navegador.</p></div>
            </div>
          </div>
        </section>
        <section className="closing-section"><div className="container closing-card"><div><span className="closing-kicker">O SEU PRÓXIMO CAPÍTULO COMEÇA AGORA</span><h2>Grandes jornadas começam<br/>com um primeiro <em>play.</em></h2></div><button type="button" className="btn btn-white" onClick={scrollToCourses}>Escolher um curso <Icon name="arrow-up-right" size={19}/></button></div></section>
      </main>
      <Footer/>
      <VideoPlayer key={openedCourse?.id ?? 'closed'} course={openedCourse} onClose={closeCourse} completed={completed} onToggleCompleted={toggleCompleted}/>
    </>
  );
}
