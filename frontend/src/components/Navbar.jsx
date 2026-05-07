const Navbar = () => {
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
        <a href="#contact" className="btn-primary">Contact</a>
      </div>
    </header>
  );
};

export default Navbar;
