const Footer = () => {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="container-page py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-brand-600 text-white text-xs font-bold">
            M
          </div>
          <span className="text-sm text-ink-500">
            © {new Date().getFullYear()} MyBikeLab. All rights reserved.
          </span>
        </div>
        <nav className="flex items-center gap-5 text-sm text-ink-500">
          <a href="#tool" className="hover:text-brand-600">Tool</a>
          <a href="#roadmap" className="hover:text-brand-600">Roadmap</a>
          <a href="#partnerships" className="hover:text-brand-600">Partnerships</a>
          <a href="#contact" className="hover:text-brand-600">Contact</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
