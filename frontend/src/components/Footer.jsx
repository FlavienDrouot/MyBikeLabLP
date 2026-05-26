const Footer = () => {
  return (
    <footer className="border-t border-ink-10 bg-ink-12">
      <div className="container-page py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-xs bg-brass-7 text-ink-12 text-xs font-bold">
            M
          </div>
          <span className="text-sm text-paper-2">
            © {new Date().getFullYear()} MyBikeLab. All rights reserved.
          </span>
        </div>
        <nav className="flex items-center gap-5 text-sm text-paper-2">
          <a href="#tool" className="hover:text-brass-7">Tool</a>
          <a href="#roadmap" className="hover:text-brass-7">Roadmap</a>
          <a href="#partnerships" className="hover:text-brass-7">Partnerships</a>
          <a href="#contact" className="hover:text-brass-7">Contact</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
