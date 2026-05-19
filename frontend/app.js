const { useState } = React;

function App() {
  const [item, setItem] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const examples = ["페트병", "종이컵", "배달 용기", "유리병", "건전지"];
  const menuItems = [
    { label: "문제점", href: "#impact" },
    { label: "AI 가이드", href: "#checker" },
    { label: "재사용 팁", href: "#tips" },
    { label: "체크리스트", href: "#action" },
  ];
  const isLoading = status === "분석 중";
  const maxItemLength = 60;

  async function handleSubmit(event) {
    event.preventDefault();

    const keyword = item.trim();
    if (!keyword) {
      setError("분석할 물건 이름을 입력해 주세요.");
      setResult("");
      return;
    }

    if (keyword.length > maxItemLength) {
      setError(`${maxItemLength}자 이하로 입력해 주세요.`);
      setResult("");
      return;
    }

    setStatus("분석 중");
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
        throw new Error(data.error || "분석에 실패했습니다.");
      }

      setResult(data.result);
    } catch (err) {
      setError(err.message || "서버에 연결할 수 없습니다.");
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
            <span>스마트 분리배출 및 재사용 가이드</span>
            <div className="utility-links">
              <a href="#checker">빠른 분석</a>
              <a href="#tips">분리배출 팁</a>
              <a href="#action">생활 체크리스트</a>
            </div>
          </div>
        </div>

        <div className="main-nav">
          <div className="header-shell main-nav-inner">
            <a className="logo" href="#" aria-label="Recycle AI 홈">
              <span className="logo-mark">R</span>
              <span>
                <strong>Recycle AI</strong>
                <small>분리배출 가이드 플랫폼</small>
              </span>
            </a>

            <nav className="desktop-menu" aria-label="주요 메뉴">
              {menuItems.map((menu) => (
                <a key={menu.href} href={menu.href}>
                  {menu.label}
                </a>
              ))}
            </nav>

            <div className="nav-actions">
              <a className="nav-cta" href="#checker">
                분석하기
              </a>
              <button
                className="menu-button"
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="메뉴 열기"
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
            <p className="eyebrow">무단투기 예방, 재활용과 재사용</p>
            <h1>버리기 전에 올바른 분리배출 방법을 확인하세요</h1>
            <p className="hero-copy">
              물건 이름을 입력하면 Recycle AI가 분해 시간, 분리배출 방법,
              재활용 가능성, 재사용 아이디어, 주의사항을 알려드립니다.
            </p>
            <div className="hero-actions">
              <a className="button" href="#checker">AI 가이드 사용하기</a>
              <a className="button secondary" href="#impact">왜 중요할까?</a>
            </div>
          </div>

          <aside className="hero-board" aria-label="빠른 가이드">
            <strong>버리기 전 확인</strong>
            <ul>
              <li>가능하면 용기를 비우고 헹궈 주세요.</li>
              <li>라벨, 뚜껑, 다른 재질은 따로 분리해 주세요.</li>
              <li>먼저 재사용할 수 있는지 확인해 주세요.</li>
            </ul>
          </aside>
        </div>

        <div className="hero-strip">
          <div>
            <strong>환경</strong>
            <span>토양과 하천 오염을 줄입니다.</span>
          </div>
          <div>
            <strong>생활</strong>
            <span>악취와 불편을 줄입니다.</span>
          </div>
          <div>
            <strong>비용</strong>
            <span>수거와 처리 비용을 낮춥니다.</span>
          </div>
        </div>
      </section>

      <section className="section" id="impact">
        <div className="section-inner">
          <div className="section-heading">
            <h2>잘못 버린 쓰레기는 여러 문제를 만듭니다</h2>
            <p>
              길거리, 공원, 하천에 버려진 쓰레기는 환경을 오염시키고 수거
              비용을 높이며 재활용률을 떨어뜨립니다.
            </p>
          </div>

          <div className="impact-grid">
            <article className="impact-card">
              <strong>01</strong>
              <h3>환경 오염</h3>
              <p>플라스틱과 금속 조각은 쉽게 분해되지 않아 토양과 물로 퍼질 수 있습니다.</p>
            </article>
            <article className="impact-card">
              <strong>02</strong>
              <h3>생활 불편</h3>
              <p>음식물 찌꺼기가 섞인 쓰레기는 악취, 해충, 위생 문제를 일으킵니다.</p>
            </article>
            <article className="impact-card">
              <strong>03</strong>
              <h3>사회적 비용</h3>
              <p>청소, 선별, 소각, 매립 관리에 추가 비용이 발생합니다.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section checker" id="checker">
        <div className="section-inner checker-layout">
          <div className="guide-panel">
            <div className="section-heading">
              <h2>AI 재활용 가이드</h2>
              <p>물건 이름을 입력하면 실용적인 분리배출, 재활용, 재사용 방법을 확인할 수 있습니다.</p>
            </div>

            <form className="search-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={item}
                onChange={(event) => setItem(event.target.value)}
                placeholder="예: 페트병, 종이컵, 배달 용기"
                aria-label="물건 이름"
                maxLength={maxItemLength}
              />
              <button className="button" type="submit" disabled={isLoading}>
                {isLoading ? "분석 중" : "분석하기"}
              </button>
            </form>

            <div className="example-list" aria-label="물건 예시">
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
              <h3>분석 결과</h3>
              {status && <span className="status">{status}</span>}
            </div>
            <p className="notice">
              지역별 분리배출 기준은 다를 수 있습니다. 최종 배출 전 거주 지역 안내를 확인해 주세요.
            </p>
            {error && <p className="error">{error}</p>}
            {!error && result && <p>{result}</p>}
            {!error && !result && !status && (
              <p className="empty">물건 이름을 입력하면 결과가 여기에 표시됩니다.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section" id="tips">
        <div className="section-inner">
          <div className="section-heading">
            <h2>버리기 전에 재사용을 먼저 생각하세요</h2>
            <p>작은 선택이 재활용 전에 발생하는 쓰레기를 줄일 수 있습니다.</p>
          </div>

          <div className="tips-grid">
            <article className="tip-card">
              <div className="tip-icon">1</div>
              <h3>비우고 말리기</h3>
              <p>재활용품이 다른 물건을 오염시키지 않도록 내용물을 제거해 주세요.</p>
            </article>
            <article className="tip-card">
              <div className="tip-icon">2</div>
              <h3>부분 분리하기</h3>
              <p>가능한 경우 뚜껑, 라벨, 다른 재질을 따로 분리해 주세요.</p>
            </article>
            <article className="tip-card">
              <div className="tip-icon">3</div>
              <h3>용기 재사용하기</h3>
              <p>깨끗한 유리병과 튼튼한 플라스틱 용기는 다시 사용할 수 있습니다.</p>
            </article>
            <article className="tip-card">
              <div className="tip-icon">4</div>
              <h3>쓸 수 있는 물건 나누기</h3>
              <p>상태가 좋은 물건은 기부하거나 중고로 나눌 수 있습니다.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section action" id="action">
        <div className="section-inner action-layout">
          <div>
            <div className="section-heading">
              <h2>30초 체크리스트</h2>
              <p>물건을 버리기 전에 아래 항목을 확인해 주세요.</p>
            </div>
          </div>

          <div className="checklist">
            <label>
              <input type="checkbox" />
              <span>내용물을 비우고 헹궜나요?</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>종이, 플라스틱, 유리, 금속을 분리했나요?</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>라벨, 뚜껑, 음식물 찌꺼기를 제거했나요?</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>재사용, 기부, 수리가 가능한가요?</span>
            </label>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <strong>Recycle AI</strong>
          <p>바르게 분리하고, 더 많이 재사용하고, 쓰레기를 줄여요.</p>
        </div>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
