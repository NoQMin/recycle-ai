const { useState } = React;

function App() {
  const [item, setItem] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const examples = ["PET bottle", "paper cup", "delivery container", "glass bottle", "battery"];
  const menuItems = [
    { label: "Impact", href: "#impact" },
    { label: "AI Guide", href: "#checker" },
    { label: "Reuse Tips", href: "#tips" },
    { label: "Checklist", href: "#action" },
  ];
  const isLoading = status === "Analyzing";
  const maxItemLength = 60;

  async function handleSubmit(event) {
    event.preventDefault();

    const keyword = item.trim();
    if (!keyword) {
      setError("Enter an item name to analyze.");
      setResult("");
      return;
    }

    if (keyword.length > maxItemLength) {
      setError(`Enter ${maxItemLength} characters or fewer.`);
      setResult("");
      return;
    }

    setStatus("Analyzing");
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/recycle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: keyword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setResult(data.result);
    } catch (err) {
      setError(err.message || "Could not connect to the server.");
    } finally {
      setStatus("");
    }
  }

  function useExample(example) {
    setItem(example);
    setError("");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <main className="app">
      <header className="site-header">
        <div className="utility-bar">
          <div className="header-shell utility-inner">
            <span>Smart waste sorting and reuse guide</span>
            <div className="utility-links">
              <a href="#checker">Quick analysis</a>
              <a href="#tips">Sorting tips</a>
              <a href="#action">Daily checklist</a>
            </div>
          </div>
        </div>

        <div className="main-nav">
          <div className="header-shell main-nav-inner">
            <a className="logo" href="#" aria-label="Recycle AI home">
              <span className="logo-mark">R</span>
              <span>
                <strong>Recycle AI</strong>
                <small>Waste Guide Platform</small>
              </span>
            </a>

            <nav className="desktop-menu" aria-label="Main menu">
              {menuItems.map((menu) => (
                <a key={menu.href} href={menu.href}>
                  {menu.label}
                </a>
              ))}
            </nav>

            <div className="nav-actions">
              <a className="nav-cta" href="#checker">
                Analyze
              </a>
              <button
                className="menu-button"
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-panel">
            {menuItems.map((menu) => (
              <a key={menu.href} href={menu.href} onClick={closeMenu}>
                {menu.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <p className="eyebrow">Illegal dumping prevention, recycling, reuse</p>
            <h1>Check how to sort waste before throwing it away</h1>
            <p className="hero-copy">
              Enter an item name and Recycle AI will explain decomposition time, sorting,
              recycling, reuse ideas, and important cautions.
            </p>
            <div className="hero-actions">
              <a className="button" href="#checker">Use AI guide</a>
              <a className="button secondary" href="#impact">Why it matters</a>
            </div>
          </div>

          <aside className="hero-board" aria-label="Quick guide">
            <strong>Before disposal</strong>
            <ul>
              <li>Empty and rinse containers when possible.</li>
              <li>Separate caps, labels, and mixed materials.</li>
              <li>Check whether the item can be reused first.</li>
            </ul>
          </aside>
        </div>

        <div className="hero-strip">
          <div>
            <strong>Environment</strong>
            <span>Reduce soil and water pollution.</span>
          </div>
          <div>
            <strong>Home</strong>
            <span>Reduce odor and contamination.</span>
          </div>
          <div>
            <strong>Cost</strong>
            <span>Lower cleanup and processing waste.</span>
          </div>
        </div>
      </section>

      <section className="section" id="impact">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Incorrect disposal creates bigger problems</h2>
            <p>
              Waste left in streets, parks, and waterways can pollute the environment,
              increase cleanup cost, and make recycling harder.
            </p>
          </div>

          <div className="impact-grid">
            <article className="impact-card">
              <strong>01</strong>
              <h3>Pollution</h3>
              <p>Plastic and mixed waste can break into smaller pieces and spread through soil and water.</p>
            </article>
            <article className="impact-card">
              <strong>02</strong>
              <h3>Daily life</h3>
              <p>Food residue and unsorted trash cause odor, pests, and sanitation problems.</p>
            </article>
            <article className="impact-card">
              <strong>03</strong>
              <h3>Public cost</h3>
              <p>Cleanup, sorting, incineration, and landfill management all add extra cost.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section checker" id="checker">
        <div className="section-inner checker-layout">
          <div className="guide-panel">
            <div className="section-heading">
              <h2>AI recycling guide</h2>
              <p>Type an item name to get practical sorting, recycling, and reuse guidance.</p>
            </div>

            <form className="search-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={item}
                onChange={(event) => setItem(event.target.value)}
                placeholder="e.g. PET bottle, paper cup, delivery container"
                aria-label="Waste item name"
                maxLength={maxItemLength}
              />
              <button className="button" type="submit" disabled={isLoading}>
                {isLoading ? "Analyzing" : "Analyze"}
              </button>
            </form>

            <div className="example-list" aria-label="Example waste items">
              {examples.map((example) => (
                <button
                  className="chip"
                  type="button"
                  key={example}
                  onClick={() => useExample(example)}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <div className="result-panel" aria-live="polite">
            <div className="result-title">
              <h3>Analysis result</h3>
              {status && <span className="status">{status}</span>}
            </div>
            <p className="notice">
              Local recycling rules can differ. Check your city or district instructions for final disposal.
            </p>
            {error && <p className="error">{error}</p>}
            {!error && result && <p>{result}</p>}
            {!error && !result && !status && (
              <p className="empty">Results will appear here after you submit an item.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section" id="tips">
        <div className="section-inner">
          <div className="section-heading">
            <h2>Reuse before disposal</h2>
            <p>Small choices can reduce waste before recycling starts.</p>
          </div>

          <div className="tips-grid">
            <article className="tip-card">
              <div className="tip-icon">1</div>
              <h3>Empty and dry</h3>
              <p>Remove residue so recyclable materials do not contaminate other items.</p>
            </article>
            <article className="tip-card">
              <div className="tip-icon">2</div>
              <h3>Separate parts</h3>
              <p>Detach labels, caps, and mixed materials where possible.</p>
            </article>
            <article className="tip-card">
              <div className="tip-icon">3</div>
              <h3>Reuse containers</h3>
              <p>Clean glass jars and sturdy plastic containers can often be reused.</p>
            </article>
            <article className="tip-card">
              <div className="tip-icon">4</div>
              <h3>Share usable items</h3>
              <p>Donate or resell items that are still in good condition.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section action" id="action">
        <div className="section-inner action-layout">
          <div>
            <div className="section-heading">
              <h2>30 second checklist</h2>
              <p>Run through these checks before throwing items away.</p>
            </div>
          </div>

          <div className="checklist">
            <label>
              <input type="checkbox" />
              <span>Did I empty and rinse the item?</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>Did I separate paper, plastic, glass, and metal?</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>Did I remove tape, labels, or food residue?</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>Can this be reused, donated, or repaired?</span>
            </label>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <strong>Recycle AI</strong>
          <p>Sort better. Reuse more. Waste less.</p>
        </div>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
