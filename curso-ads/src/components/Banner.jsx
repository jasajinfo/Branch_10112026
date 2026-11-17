import Icon from './Icon';

export default function Banner({ courseCount, lessonCount, categoryCount, onBrowse, onStart, featuredCourse }) {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="container hero-layout">
        <div className="hero-copy">
          <span className="hero-eyebrow"><Icon name="sparkle" size={16}/> CONHECIMENTO QUE TRANSFORMA</span>
          <h1 id="hero-title">O próximo capítulo<br/>da sua carreira<br/><em>começa aqui.</em></h1>
          <p>Descubra novas habilidades com cursos de tecnologia organizados por categoria. Assista às aulas e avance no seu ritmo.</p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={onBrowse}>
              Explorar cursos <Icon name="arrow" size={19}/>
            </button>
            <button type="button" className="btn btn-ghost" onClick={onStart} disabled={!featuredCourse}>
              <Icon name="play-circle" size={20}/> Ver primeira aula
            </button>
          </div>
          <div className="hero-footnote"><span className="tiny-avatars"><i>R</i><i>N</i><i>S</i></span> <span>React, Node.js, SQL e muito mais para descobrir.</span></div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="orb orb-one"/><span className="orb orb-two"/>
          <div className="hero-photo-wrap">
            <img src="/imagens/banner.png" alt="" className="hero-photo" />
          </div>
          <div className="float-card float-card-top">
            <span className="float-icon"><Icon name="sparkle" size={18}/></span>
            <span><small>SEU PRÓXIMO PASSO</small><strong>Aprender fazendo</strong></span>
          </div>
          <div className="float-card float-card-bottom">
            <span className="float-play"><Icon name="play" size={17} fill="currentColor"/></span>
            <span><small>EM DESTAQUE</small><strong>{featuredCourse?.title || 'Descubra novos cursos'}</strong></span>
          </div>
        </div>
      </div>
      <div className="container hero-stat-container">
        <div className="hero-stats" aria-label="Resumo do catálogo">
          <div><Icon name="book" size={22}/><strong>{courseCount}</strong><span>Cursos disponíveis</span></div>
          <div><Icon name="video" size={22}/><strong>{lessonCount}</strong><span>Aulas organizadas</span></div>
          <div><Icon name="layers" size={22}/><strong>{categoryCount}</strong><span>Áreas de conhecimento</span></div>
        </div>
      </div>
    </section>
  );
}
