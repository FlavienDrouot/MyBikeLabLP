/* global React, ReactDOM, useTweaks, TweaksPanel, TweakSection,
          Navbar, Hero, ComparatorPreview, Roadmap, Partnership, Footer */

const { useEffect } = React;

const PALETTES = [
  { id: 'paper',     label: 'Paper',     bg: '#f6f4ef', ink: '#1a1a17', note: 'Warm identity. The original.' },
  { id: 'mist',      label: 'Mist',      bg: '#eef1f4', ink: '#16181a', note: 'Cool neutral grey. Instrument-clean.' },
  { id: 'porcelain', label: 'Porcelain', bg: '#f3f4f6', ink: '#16181a', note: 'Crisp cool near-white. Maximum air.' },
];

const ACCENTS = [
  { id: 'brass',   label: 'Brass',   swatch: '#c9a86a', note: 'Warm gold. Default.' },
  { id: 'cobalt',  label: 'Cobalt',  swatch: '#7aa6cf', note: 'Cool technical blue.' },
  { id: 'oxblood', label: 'Oxblood', swatch: '#cc9077', note: 'Muted clay-red.' },
  { id: 'forest',  label: 'Forest',  swatch: '#7aa37b', note: 'Desaturated racing green.' },
];

// Canonical default: Paper + Brass. Documented alternate pairings worth
// revisiting (both verified legible): Mist + Cobalt (cool, technical) and
// Porcelain + Forest (crisp, heritage green).
const LANDING_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "paper",
  "accent": "brass"
}/*EDITMODE-END*/;

function PaletteSwatch({ p, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', textAlign: 'left',
        padding: '8px 10px', cursor: 'pointer',
        background: active ? 'var(--paper-2)' : 'transparent',
        border: active ? '1px solid var(--ink-10)' : '1px solid var(--ink-3)',
        borderRadius: 2,
        transition: 'border-color 140ms, background 140ms',
      }}
    >
      <span style={{ display: 'flex', flexShrink: 0, border: '1px solid rgba(0,0,0,0.12)' }}>
        <span style={{ width: 22, height: 22, background: p.bg }} />
        <span style={{ width: 14, height: 22, background: p.ink }} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 600, color: 'var(--ink-12)', display: 'block' }}>{p.label}</span>
        <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--ink-7)', display: 'block', lineHeight: 1.3 }}>{p.note}</span>
      </span>
      {active && (
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="var(--ink-11)" strokeWidth="1.8" style={{ flexShrink: 0 }}>
          <polyline points="3 8 7 12 13 4" />
        </svg>
      )}
    </button>
  );
}

function AccentSwatch({ a, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={a.label}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        flex: 1, cursor: 'pointer',
        padding: '8px 4px',
        background: active ? 'var(--paper-2)' : 'transparent',
        border: active ? '1px solid var(--ink-10)' : '1px solid var(--ink-3)',
        borderRadius: 2,
        transition: 'border-color 140ms, background 140ms',
      }}
    >
      <span style={{ width: 24, height: 24, background: a.swatch, borderRadius: '50%', border: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {active && (
          <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" strokeWidth="2.2">
            <polyline points="3 8 7 12 13 4" />
          </svg>
        )}
      </span>
      <span style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 600, color: 'var(--ink-11)' }}>{a.label}</span>
    </button>
  );
}

function App() {
  const [t, setTweak] = useTweaks(LANDING_TWEAK_DEFAULTS);

  useEffect(() => {
    document.body.classList.add('dir-notebook');
    PALETTES.forEach((p) => document.body.classList.remove(`pal-${p.id}`));
    document.body.classList.add(`pal-${t.palette}`);
    try { localStorage.setItem('mbl-palette', t.palette); } catch (e) { /* no-op */ }
  }, [t.palette]);

  useEffect(() => {
    ACCENTS.forEach((a) => document.body.classList.remove(`acc-${a.id}`));
    document.body.classList.add(`acc-${t.accent}`);
    try { localStorage.setItem('mbl-accent', t.accent); } catch (e) { /* no-op */ }
  }, [t.accent]);

  const activeAccent = ACCENTS.find((a) => a.id === t.accent) || ACCENTS[0];

  return (
    <React.Fragment>
      <Navbar />
      <Hero />
      <ComparatorPreview />
      <Roadmap />
      <Partnership />
      <Footer />

      <TweaksPanel title="Tweaks" initialPos={{ right: 16, bottom: 16 }}>
        <TweakSection title="Base palette">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {PALETTES.map((p) => (
              <PaletteSwatch key={p.id} p={p} active={t.palette === p.id} onClick={() => setTweak('palette', p.id)} />
            ))}
          </div>
        </TweakSection>

        <TweakSection title="Accent">
          <div style={{ display: 'flex', gap: 6 }}>
            {ACCENTS.map((a) => (
              <AccentSwatch key={a.id} a={a} active={t.accent === a.id} onClick={() => setTweak('accent', a.id)} />
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--ink-7)', lineHeight: 1.5, marginTop: 8 }}>
            {activeAccent.note} Drives the CTA, hero italic, focus ring, badges and row hover. Palette and accent both carry into the comparator and detail pages.
          </div>
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
