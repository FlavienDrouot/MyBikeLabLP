/* global React */

function Partnership() {
  return (
    <section id="partnerships" className="partnership">
      <div className="page partnership-inner">
        <div className="partnership-grid">
          <div>
            <div className="eyebrow t-eyebrow">Partnerships</div>
            <h2>Join the platform.</h2>
            <p className="lead">
              We're building the trusted layer between cyclists and the
              components they buy. Help shape the dataset, the structure, and
              the tools the next generation of road riders will use to decide.
            </p>
            <div className="audience-list">
              <div className="audience">
                <div className="title">Manufacturers</div>
                <div className="desc">
                  Supply structured product data. Get qualified traffic and
                  precise comparison placement in front of buyers who already
                  speak the language of grams and rim depth.
                </div>
              </div>
              <div className="audience">
                <div className="title">Resellers</div>
                <div className="desc">
                  Plug into a high-intent comparison funnel. Affiliate-tracked
                  links from every wheel detail, no media-buying overhead.
                </div>
              </div>
            </div>
          </div>

          <div id="contact" className="contact-card">
            <div className="eyebrow" style={{ color: 'var(--ink-7)' }}>CONTACT</div>
            <h3 style={{ fontFamily: 'inherit', fontWeight: 700, fontSize: 24, letterSpacing: '-0.025em', margin: '8px 0 32px' }}>
              Get in touch
            </h3>
            <div className="field">
              <label className="label" htmlFor="cf-name">Name</label>
              <input id="cf-name" type="text" placeholder="Your name" />
            </div>
            <div className="field">
              <label className="label" htmlFor="cf-org">Company</label>
              <input id="cf-org" type="text" placeholder="Brand or retailer" />
            </div>
            <div className="field">
              <label className="label" htmlFor="cf-email">Email</label>
              <input id="cf-email" type="email" placeholder="you@example.com" />
            </div>
            <div className="field">
              <label className="label" htmlFor="cf-msg">Message</label>
              <textarea id="cf-msg" placeholder="What would you like to talk about?" />
            </div>
            <button className="btn btn-primary" type="button">Send message <span className="arr">→</span></button>
          </div>
        </div>
      </div>
    </section>
  );
}

window.Partnership = Partnership;
