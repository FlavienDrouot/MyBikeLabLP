/* global React, LogoMark */

function StatsTrio() {
  return (
    <div className="hero-stats">
      <div className="hero-stat">
        <div className="num">15<span className="unit"> wheels</span></div>
        <div className="label">Indexed</div>
      </div>
      <div className="hero-stat">
        <div className="num">13<span className="unit"> axes</span></div>
        <div className="label">Filterable</div>
      </div>
      <div className="hero-stat">
        <div className="num">7<span className="unit"> brands</span></div>
        <div className="label">Premium</div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="page hero-inner">
        <div className="hero-default">
          <div className="hero-tag t-eyebrow">Compare road wheels</div>
          <h1 className="hero-title">
            Wheels, <em>measured.</em><br/>
            Not marketed.
          </h1>
          <p className="hero-lead">
            Filter 15 road wheels across 13 specification axes. Sort by weight,
            price, or rim depth. See the cheapest known retailer for each model,
            without sifting through PDFs and forum threads.
          </p>
          <div className="hero-cta">
            <a href="#tool" className="btn btn-primary">
              Open comparator <span className="arr">&rarr;</span>
            </a>
            <a href="#roadmap" className="btn btn-secondary">See the roadmap</a>
          </div>
          <StatsTrio />
        </div>
      </div>
    </section>
  );
}

window.Hero = Hero;
