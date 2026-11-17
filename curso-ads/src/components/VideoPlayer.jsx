import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

const safeVideoId = (id) => typeof id === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(id);

export default function VideoPlayer({ course, onClose, completed = [], onToggleCompleted }) {
  const [lessonIndex, setLessonIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const lessons = Array.isArray(course?.lessons) ? course.lessons : [];
  const selectedLesson = lessons[lessonIndex] ?? lessons[0];
  const completedCount = lessons.filter((lesson) => completed.includes(`${course?.id}:${lesson.id}`)).length;

  useEffect(() => {
    if (!course) return undefined;
    const focusBefore = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key !== 'Tab') return;
      const focusables = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      if (focusBefore?.isConnected) focusBefore.focus?.();
    };
  }, [course, onClose]);

  if (!course) return null;

  const selectLesson = (index) => {
    setLessonIndex(index);
    setPlaying(false);
  };
  const watched = selectedLesson && completed.includes(`${course.id}:${selectedLesson.id}`);
  const videoValid = selectedLesson && safeVideoId(selectedLesson.videoId);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className="course-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="dialog-description">
        <div className="dialog-topbar">
          <div className="dialog-breadcrumb">CATÁLOGO <Icon name="chevron-right" size={14}/> {course.category?.name ?? 'Curso'}</div>
          <button ref={closeRef} type="button" className="dialog-close" onClick={onClose} aria-label="Fechar curso"><Icon name="close" size={22}/></button>
        </div>
        <div className="dialog-heading">
          <div><span className="dialog-kicker">SUA SALA DE AULA</span><h2 id="dialog-title">{course.title}</h2><p id="dialog-description">{course.description}</p></div>
          <div className="dialog-progress"><strong>{completedCount}/{lessons.length}</strong><span>Aulas concluídas</span></div>
        </div>
        <div className="dialog-body">
          <div className="player-column">
            <div className="player-window">
              {playing && videoValid ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedLesson.videoId}?autoplay=1&rel=0`}
                  title={selectedLesson.title} allow="accelerometer; autoplay; encrypted-media; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
                />
              ) : (
                <div className="player-placeholder">
                  <span className="player-back-text">DEVFLIX</span>
                  <button type="button" className="large-play" onClick={() => setPlaying(true)} disabled={!videoValid}
                    aria-label={videoValid ? `Reproduzir ${selectedLesson?.title}` : 'Vídeo indisponível'}>
                    <Icon name="play" size={28} fill="currentColor" />
                  </button>
                  <span>{videoValid ? 'Clique para assistir à aula' : 'Este vídeo não está disponível'}</span>
                </div>
              )}
            </div>
            <div className="lesson-details">
              <span className="lesson-index">AULA {String(lessonIndex + 1).padStart(2, '0')}</span>
              <h3>{selectedLesson?.title ?? 'Nenhuma aula cadastrada'}</h3>
              <p>{selectedLesson?.description ?? 'Aprenda os conceitos desta aula e coloque seu conhecimento em prática.'}</p>
              {videoValid && <a className="video-external-link" href={`https://www.youtube.com/watch?v=${selectedLesson.videoId}`} target="_blank" rel="noopener noreferrer">
                Abrir vídeo diretamente no YouTube <Icon name="external-link" size={15}/>
              </a>}
              <div className="lesson-actions">
                {selectedLesson && <button type="button" className={`btn btn-small ${watched ? 'btn-completed' : 'btn-primary'}`}
                  onClick={() => onToggleCompleted(course.id, selectedLesson.id)}>
                  <Icon name="check" size={17}/>{watched ? 'Concluída · desfazer' : 'Marcar como concluída'}
                </button>}
                {lessonIndex < lessons.length - 1 && <button type="button" className="btn btn-small btn-next" onClick={() => selectLesson(lessonIndex + 1)}>
                  Próxima aula <Icon name="arrow" size={17}/>
                </button>}
              </div>
            </div>
          </div>
          <aside className="lesson-sidebar" aria-label="Aulas do curso">
            <div className="sidebar-title"><h3>Conteúdo do curso</h3><span>{lessons.length} aulas</span></div>
            <div className="sidebar-progress-track"><span style={{ width: `${lessons.length ? (completedCount / lessons.length) * 100 : 0}%` }}/></div>
            <div className="sidebar-list">
              {lessons.length === 0 && <p>As aulas deste curso ainda não foram cadastradas.</p>}
              {lessons.map((lesson, index) => {
                const done = completed.includes(`${course.id}:${lesson.id}`);
                return (
                  <button type="button" key={lesson.id} className={`sidebar-lesson ${index === lessonIndex ? 'is-selected' : ''}`} onClick={() => selectLesson(index)}>
                    <span className={`sidebar-lesson-icon ${done ? 'done' : ''}`}><Icon name={done ? 'check' : 'play'} size={15} fill={done ? 'none' : 'currentColor'}/></span>
                    <span><small>Aula {String(lesson.position).padStart(2, '0')}</small><strong>{lesson.title}</strong></span>
                    {index === lessonIndex && <span className="sidebar-now">ATUAL</span>}
                  </button>
                );
              })}
            </div>
            <div className="sidebar-note"><Icon name="sparkle" size={18}/><span>Seu progresso fica salvo neste navegador, neste dispositivo.</span></div>
          </aside>
        </div>
      </section>
    </div>
  );
}
