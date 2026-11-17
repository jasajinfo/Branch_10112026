import { useState } from 'react';
import Icon from './Icon';

export default function Header({ connection, savedCount, savedOnly, onToggleSaved }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const online = connection === 'success';
  const loading = connection === 'loading';
  return (
    <header className="site-header" id="inicio">
      <div className="container navbar">
        <a href="#inicio" className="brand" aria-label="DevFlix, início" onClick={closeMenu}>
          <span className="brand-mark"><Icon name="play" size={17} fill="currentColor" /></span>
          <span>dev<span className="brand-highlight">flix</span><span className="brand-dot">.</span></span>
        </a>
        <nav className={`nav-links ${menuOpen ? 'is-open' : ''}`} aria-label="Menu principal">
          <a href="#cursos" onClick={closeMenu}>Explorar cursos</a>
          <a href="#como-funciona" onClick={closeMenu}>Como funciona</a>
          <a href="#rodape" onClick={closeMenu}>Sobre o projeto</a>
        </nav>
        <div className="nav-actions">
          <span className={`api-indicator ${online ? 'api-online' : loading ? 'api-loading' : 'api-offline'}`} title={online ? 'API conectada' : loading ? 'Conectando à API' : 'API não conectada'}>
            <span className="api-dot" />{online ? 'Catálogo conectado' : loading ? 'Conectando...' : 'API indisponível'}
          </span>
          <button type="button" className={`nav-saved ${savedOnly ? 'is-active' : ''}`} onClick={onToggleSaved}
            aria-pressed={savedOnly} title="Mostrar meus cursos salvos">
            <Icon name="bookmark" size={17} /> <span>Minha lista</span>{savedCount > 0 && <b>{savedCount}</b>}
          </button>
          <button type="button" className="menu-toggle" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
            <Icon name={menuOpen ? 'close' : 'menu'} size={22}/>
          </button>
        </div>
      </div>
    </header>
  );
}
