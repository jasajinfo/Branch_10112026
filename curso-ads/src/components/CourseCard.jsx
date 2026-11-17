import Icon from './Icon';

const visualMap = {
  'react-iniciantes': { className: 'react', initials: 'React', symbol: '⚛' },
  'nodejs-iniciantes': { className: 'node', initials: 'Node.js', symbol: '{ }' },
  'sql-fundamentos': { className: 'sql', initials: 'SQL', symbol: '▤' },
  'git-github-versionamento': { className: 'git', initials: 'Git & GitHub', symbol: '⑂' },
  'html-css-projeto-completo': { className: 'html', initials: 'HTML & CSS', symbol: '</>' },
};

export default function CourseCard({ course, onOpen, saved, onToggleSave, completedCount = 0 }) {
  const artwork = visualMap[course.slug] ?? { className: 'default', initials: 'DEV', symbol: '</>' };
  const lessons = Array.isArray(course.lessons) ? course.lessons : [];
  const progress = lessons.length ? Math.round((completedCount / lessons.length) * 100) : 0;
  return (
    <article className="course-card">
      <div className={`course-art course-art-${artwork.className}`}>
        <div className="course-art-rings" />
        {course.thumbnail ? <img className="course-thumb" src={course.thumbnail} alt="" loading="lazy" /> : (
          <><span className="course-art-symbol">{artwork.symbol}</span><span className="course-art-title">{artwork.initials}</span></>
        )}
        <span className="course-art-tag">{course.category?.name || 'Tecnologia'}</span>
        <button type="button" className={`save-course ${saved ? 'is-saved' : ''}`} onClick={() => onToggleSave(course.id)}
          aria-label={saved ? `Remover ${course.title} da minha lista` : `Salvar ${course.title} na minha lista`}
          title={saved ? 'Remover da lista' : 'Salvar na lista'}>
          <Icon name="bookmark" size={18} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="course-info">
        <span className="card-overline">TRILHA DE APRENDIZAGEM</span>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <div className="course-meta"><span><Icon name="video" size={16}/>{lessons.length} {lessons.length === 1 ? 'aula' : 'aulas'}</span><span><Icon name="book" size={16}/> Curso em vídeo</span></div>
        {completedCount > 0 && (
          <div className="card-progress" aria-label={`${progress}% das aulas concluídas`}>
            <div className="card-progress-track"><span style={{ width: `${progress}%` }} /></div>
            <small>{progress}% concluído</small>
          </div>
        )}
        <button type="button" className="course-open" onClick={() => onOpen(course.id)}>
          {completedCount > 0 ? 'Continuar aprendendo' : 'Explorar curso'} <Icon name="arrow-up-right" size={18}/>
        </button>
      </div>
    </article>
  );
}
