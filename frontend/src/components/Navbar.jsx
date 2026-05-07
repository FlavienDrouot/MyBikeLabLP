import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-100 bg-white/80 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white font-bold">
            M
          </div>
          <span className="text-lg font-semibold tracking-tight">
            My<span className="text-brand-600">Bike</span>Lab
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-1">
          <a href="#tool" className="btn-ghost">Tool</a>
          <a href="#roadmap" className="btn-ghost">Roadmap</a>
          <a href="#partnerships" className="btn-ghost">Partnerships</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#contact" className="btn-primary">Contact</a>
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-ink-700 hover:text-brand-600 transition-colors"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-ink-100 bg-white">
          <nav className="container-page flex flex-col py-2">
            <a href="#tool" onClick={close} className="btn-ghost justify-start">Tool</a>
            <a href="#roadmap" onClick={close} className="btn-ghost justify-start">Roadmap</a>
            <a href="#partnerships" onClick={close} className="btn-ghost justify-start">Partnerships</a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
