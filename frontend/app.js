const { useState } = React;

function App() {
  const [item, setItem] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const examples = ["페트병", "종이컵", "배달 용기", "유리병", "헌 옷"];
  const menuItems = [
    { label: "무단투기 문제", href: "#impact" },
    { label: "AI 분리배출", href: "#checker" },
    { label: "재사용 아이디어", href: "#tips" },
    { label: "실천 체크리스트", href: "#action" },
  ];
  const isLoading = status === "분석 중";
  const maxItemLength = 60;

  async function handleSubmit(event) {
    event.preventDefault();

    const keyword = item.trim();
    if (!keyword) {
      setError("분석할 쓰레기 이름을 입력해 주세요.");
      setResult("");
      return;
    }

    if (keyword.length > maxItemLength) {
      setError(`쓰레기 이름은 ${maxItemLength}자 이하로 입력해 주세요.`);
      setResult("");
      return;
    }

    setStatus("분석 중");
    setError("");
    setResult("");

    try {
      const response = await fetch(
  "https://recycle-ai-vb35.onrender.com/api/recycle",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ item: keyword }),
  }
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "분석에 실패했습니다.");
      }

      setResult(data.result);
    } catch (err) {
      setError(err.message || "서버와 연결할 수 없습니다.");
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
            <span>생활 속 자원순환 정보 서비스</span>
            <div className="utility-links">
              <a href="#checker">빠른 분석</a>
              <a href="#tips">분리배출 팁</a>
              <a href="#action">오늘의 실천</a>
            </div>
          </div>
        </div>

        <div className="main-nav">
          <div className="header-shell main-nav-inner">
            <a className="logo" href="#" aria-label="Recycle AI 홈">
              <span className="logo-mark">R</span>
              <span>
                <strong>Recycle AI</strong>
                <small>Waste Guide Platform</small>
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
                aria-label="전체 메뉴"
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
            <p className="eyebrow">무단투기 예방 · 재활용 · 재사용</p>
            <h1>버리기 전에 확인하는 자원순환 가이드</h1>
            <p className="hero-copy">
              쓰레기를 아무 곳에 버리면 악취, 해충, 미세플라스틱, 환경 오염,
              처리 비용 증가로 이어집니다. Recycle AI는 물건 이름만 입력해도
              올바른 분리배출과 다시 쓰는 방법을 알려줍니다.
            </p>
            <div className="hero-actions">
              <a className="button" href="#checker">AI로 분리배출 확인</a>
              <a className="button secondary" href="#impact">무단투기 피해 보기</a>
            </div>
          </div>

          <aside className="hero-board" aria-label="주요 안내">
            <strong>오늘 확인할 것</strong>
            <ul>
              <li>분리배출 전 내용물 비우기</li>
              <li>라벨과 뚜껑처럼 다른 재질 분리</li>
              <li>재사용 가능한 물건은 나눔 먼저 검토</li>
            </ul>
          </aside>
        </div>

        <div className="hero-strip">
          <div>
            <strong>환경</strong>
            <span>토양과 하천 오염 예방</span>
          </div>
          <div>
            <strong>생활</strong>
            <span>악취와 해충 발생 감소</span>
          </div>
          <div>
            <strong>비용</strong>
            <span>청소·소각·매립 비용 절감</span>
          </div>
        </div>
      </section>

      <section className="section" id="impact">
        <div className="section-inner">
          <div className="section-heading">
            <h2>무단투기는 눈앞의 쓰레기보다 더 큰 문제를 남깁니다</h2>
            <p>
              길가, 하천, 공터에 버린 쓰레기는 자연스럽게 사라지지 않습니다.
              도시 환경과 생태계, 생활비에 직접적인 피해를 만듭니다.
            </p>
          </div>

          <div className="impact-grid">
            <article className="impact-card">
              <strong>01</strong>
              <h3>환경 오염</h3>
              <p>
                비닐과 플라스틱은 작게 부서져 토양과 물로 퍼지고, 동물이 먹이로
                착각해 생태계 피해가 커질 수 있습니다.
              </p>
            </article>
            <article className="impact-card">
              <strong>02</strong>
              <h3>생활 피해</h3>
              <p>
                음식물과 혼합 쓰레기는 악취와 해충을 만들고 주민 거리의 안전과
                위생 수준을 빠르게 떨어뜨립니다.
              </p>
            </article>
            <article className="impact-card">
              <strong>03</strong>
              <h3>사회적 비용</h3>
              <p>
                무단투기 단속, 청소, 소각, 매립에는 세금이 쓰입니다. 잘 버리는
                습관은 모두의 비용을 줄입니다.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section checker" id="checker">
        <div className="section-inner checker-layout">
          <div className="guide-panel">
            <div className="section-heading">
              <h2>AI 재활용 도우미</h2>
              <p>
                궁금한 쓰레기 이름을 입력하면 분해 시간, 무단투기 문제,
                분리배출, 재활용, 재사용 방법을 정리해 줍니다.
              </p>
            </div>

            <form className="search-form" onSubmit={handleSubmit}>
              <input
                type="text"
                value={item}
                onChange={(event) => setItem(event.target.value)}
                placeholder="예: 페트병, 종이컵, 배달 용기"
                aria-label="쓰레기 이름"
                maxLength={maxItemLength}
              />
              <button className="button" type="submit" disabled={isLoading}>
                {isLoading ? "분석 중" : "분석"}
              </button>
            </form>

            <div className="example-list" aria-label="예시 쓰레기">
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
              지역별 분리배출 기준은 다를 수 있으므로 최종 배출 전 거주지
              지자체 안내를 함께 확인해 주세요.
            </p>
            {error && <p className="error">{error}</p>}
            {!error && result && <p>{result}</p>}
            {!error && !result && !status && (
              <p className="empty">
                결과가 여기에 표시됩니다. 예시 버튼을 누르거나 직접 입력해
                확인해 보세요.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="section" id="tips">
        <div className="section-inner">
          <div className="section-heading">
            <h2>오늘 바로 할 수 있는 재사용 습관</h2>
            <p>
              올바르게 버리는 것보다 먼저 덜 버리는 생활이 중요합니다. 작은
              선택이 쓰레기 양을 줄입니다.
            </p>
          </div>

          <div className="tips-grid">
            <article className="tip-card">
              <div className="tip-icon">1</div>
              <h3>헹구고 말리기</h3>
              <p>내용물이 남은 용기는 재활용 품질을 떨어뜨리므로 가볍게 씻어 배출합니다.</p>
            </article>
            <article className="tip-card">
              <div className="tip-icon">2</div>
              <h3>라벨 분리</h3>
              <p>페트병 라벨과 뚜껑처럼 재질이 다른 부분은 가능한 한 분리합니다.</p>
            </article>
            <article className="tip-card">
              <div className="tip-icon">3</div>
              <h3>다시 쓰기</h3>
              <p>유리병과 튼튼한 플라스틱 용기는 보관함이나 화분으로 다시 사용할 수 있습니다.</p>
            </article>
            <article className="tip-card">
              <div className="tip-icon">4</div>
              <h3>나눔 활용</h3>
              <p>멀쩡한 책, 생활용품은 중고 거래나 기부로 매립을 줄입니다.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="section action" id="action">
        <div className="section-inner action-layout">
          <div>
            <div className="section-heading">
              <h2>버리기 전 30초 체크리스트</h2>
              <p>
                아래 네 가지만 확인해도 무단투기와 잘못된 분리배출을 쉽게 줄일
                수 있습니다.
              </p>
            </div>
          </div>

          <div className="checklist">
            <label>
              <input type="checkbox" />
              <span>내용물을 비우고 헹궜나요?</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>종이, 플라스틱, 유리, 금속을 섞지 않았나요?</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>테이프, 라벨, 음식물 오염을 제거했나요?</span>
            </label>
            <label>
              <input type="checkbox" />
              <span>재사용하거나 나눔할 수 있는 물건인가요?</span>
            </label>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <strong>Recycle AI</strong>
          <p>올바르게 버리고, 가능한 것은 다시 씁니다.</p>
        </div>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
