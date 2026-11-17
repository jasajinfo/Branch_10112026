import Icon from './Icon';

export default function Footer() {
  return (
    <footer className="site-footer" id="rodape">
      <div className="container footer-main">
        <div className="footer-brand-area">
          <a href="#inicio" className="brand footer-brand"><span className="brand-mark"><Icon name="play" size={17} fill="currentColor"/></span><span>dev<span className="brand-highlight">flix</span><span className="brand-dot">.</span></span></a>
          <p>Conhecimento para o próximo capítulo da sua jornada. Aprenda, pratique e continue evoluindo.</p>
        </div>
        <div className="footer-col"><strong>EXPLORAR</strong><a href="#cursos">Todos os cursos</a><a href="#como-funciona">Como funciona</a></div>
        <div className="footer-col"><strong>TECNOLOGIA</strong><span>React + Vite</span><span>NestJS + Prisma</span><span>PostgreSQL</span></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 DevFlix · Projeto acadêmico demonstrativo.</span><span>Desenvolvido para aprender na prática.</span><a href="#inicio">Voltar ao início ↑</a></div>
    </footer>
  );
}
