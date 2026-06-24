/* global React */

function Roadmap() {
  return (
    <section id="roadmap" className="section">
      <div className="page">
        <div className="section-head">
          <div>
            <div className="idx t-eyebrow">Roadmap</div>
            <h2>From comparison to configurator.</h2>
          </div>
          <div className="sub">
            Three phases. The first is live. The second adds quantified impact.
            The third lets you assemble an entire bike from data, then buy it.
          </div>
        </div>

        <div className="roadmap-grid">
          <div className="phase live">
            <div className="stamp">
              <span>2025</span>
              <span className="status">Live</span>
            </div>
            <h3 className="title">Components comparison</h3>
            <p className="desc">
              Structured spec sheets and side-by-side comparison, starting with
              road wheels. Drivetrains, brakes and tires extend the dataset.
            </p>
            <ul className="points">
              <li>Wheels, 15 indexed</li>
              <li>Drivetrains, next</li>
              <li>Brakes and tires, queued</li>
            </ul>
          </div>

          <div className="phase next">
            <div className="stamp">
              <span>2026</span>
              <span className="status">Next</span>
            </div>
            <h3 className="title">Impact simulator</h3>
            <p className="desc">
              Quantify a component change before you buy: weight delta,
              aerodynamic gain, cost-per-watt. Stop guessing what an upgrade
              actually buys you.
            </p>
            <ul className="points">
              <li>Weight delta, grams and %</li>
              <li>Aero gain, predicted watts</li>
              <li>Cost-per-watt, value lens</li>
            </ul>
          </div>

          <div className="phase">
            <div className="stamp">
              <span>2027 onward</span>
              <span className="status">Vision</span>
            </div>
            <h3 className="title">Full bike configurator</h3>
            <p className="desc">
              Build a complete bike component by component, simulate the
              setup, compare total weight, price and performance, then
              buy through affiliate-tracked retailers.
            </p>
            <ul className="points">
              <li>Frame to finish</li>
              <li>Full-stack performance preview</li>
              <li>Affiliate-ready checkout flow</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Roadmap = Roadmap;
