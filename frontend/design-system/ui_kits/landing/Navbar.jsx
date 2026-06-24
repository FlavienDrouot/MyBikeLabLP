/* global React */
const { useState, useEffect } = React;

function LogoMark({ size = 28 }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="31" height="31" stroke="currentColor" strokeWidth="1" />
      <line x1="16" y1="0" x2="16" y2="3" stroke="currentColor" strokeWidth="1" />
      <line x1="16" y1="29" x2="16" y2="32" stroke="currentColor" strokeWidth="1" />
      <line x1="0" y1="16" x2="3" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="29" y1="16" x2="32" y2="16" stroke="currentColor" strokeWidth="1" />
      <path d="M 7 23 L 7 9 L 16 17.5 L 25 9 L 25 23" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" fill="none" />
    </svg>
  );
}

function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <a href="#top" className="nav-brand">
          <LogoMark size={26} />
          <span className="name">MyBikeLab</span>
        </a>
        <nav className="nav-links">
          <a href="#tool" className="nav-link">Comparator</a>
          <a href="#roadmap" className="nav-link">Roadmap</a>
          <a href="#partnerships" className="nav-link">Partnerships</a>
        </nav>
        <div className="nav-cta-wrap">
          <a href="#contact" className="btn btn-secondary" style={{ padding: '8px 14px' }}>Contact</a>
        </div>
      </div>
    </header>
  );
}

window.LogoMark = LogoMark;
window.Navbar = Navbar;
