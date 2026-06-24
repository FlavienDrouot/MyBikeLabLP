/* global React, LogoMark */

function Footer() {
  return (
    <footer className="footer">
      <div className="page footer-inner">
        <div>
          <div className="footer-brand">
            <LogoMark size={28} />
            <span className="name">MyBikeLab</span>
          </div>
          <div className="footer-meta">
            &copy; {new Date().getFullYear()} MYBIKELAB &middot; BUILT FOR ROAD CYCLISTS
          </div>
        </div>
        <nav className="footer-nav">
          <a href="#tool">Comparator</a>
          <a href="#roadmap">Roadmap</a>
          <a href="#partnerships">Partnerships</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </footer>
  );
}

window.Footer = Footer;
