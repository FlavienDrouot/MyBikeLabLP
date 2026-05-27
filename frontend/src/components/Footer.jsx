import logoMark from '../assets/logo-mark.svg';

const Footer = () => {
  return (
    <footer className="bg-ink-12">
      <hr className="rule rule-strong" />
      <div className="container-page py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <img src={logoMark} alt="MyBikeLab" className="h-7 w-auto brightness-0 invert" />
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
