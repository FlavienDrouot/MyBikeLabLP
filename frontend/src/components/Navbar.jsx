import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Icon from './ui/Icon';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-ink-3 bg-paper-1/88 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xs bg-brass-7 text-ink-12 font-bold">
            M
          </div>
          <span className="text-lg font-semibold tracking-tight">
            My<span className="text-brass-8">Bike</span>Lab
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
            className="md:hidden inline-flex items-center justify-center rounded-xs p-2 text-ink-11 hover:text-brass-8 transition-colors focus-visible:ring-2 focus-visible:ring-brass-8"
          >
            {isOpen ? (
              <Icon as={X} size={24} aria-hidden="true" />
            ) : (
              <Icon as={Menu} size={24} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      {isOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-ink-3 bg-paper-1">
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
