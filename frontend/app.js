const { useMemo, useState } = React;

const examples = ["깨진 유리컵", "기름 묻은 배달 용기", "보조배터리", "낡은 운동화", "젖은 택배 상자", "스프레이 캔"];

const impactItems = [
  {
    title: "토양 오염",
    text: "무단투기된 플라스틱, 배터리, 화학물질은 비와 함께 땅속으로 스며들어 식물과 생물에게 영향을 줍니다.",
  },
  {
    title: "하천 오염",
    text: "길가 쓰레기는 빗물받이를 통해 하천으로 이동하고, 결국 바다 생태계까지 오염시킬 수 있습니다.",
  },
  {
    title: "야생 생물 피해",
    text: "비닐, 낚싯줄, 캔 조각은 동물이 먹이로 착각하거나 몸에 걸려 다치는 원인이 됩니다.",
  },
  {
    title: "도시 비용 증가",
    text: "무단투기 단속, 수거, 선별, 소각 비용은 결국 지역 사회가 함께 부담합니다.",
  },
];

const checklistItems = [
  "내용물을 완전히 비웠나요?",
  "물로 헹구고 말렸나요?",
  "라벨, 뚜껑, 다른 재질을 분리했나요?",
  "재사용하거나 나눌 수 있는지 확인했나요?",
];

function App() {
  const [item, setItem] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checked, setChecked] = useState([]);

  const progress = useMemo(() => Math.round((checked.length / checklistItems.length) * 100), [checked]);

  async function handleSubmit(event) {
    event.preventDefault();
    const keyword = item.trim();

    if (!keyword) {
      setError("어떤 쓰레기를 버릴지 먼저 입력해 주세요.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/recycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item: keyword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI 분석에 실패했습니다.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "API 서버와 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }

  function toggleCheck(label) {
    setChecked((current) =>
      current.includes(label) ? current.filter((value) => value !== label) : [...current, label]
    );
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Recycle AI 홈">
          <span className="brand-mark">R</span>
          <span>Recycle AI</span>
        </a>
        <nav aria-label="주요 메뉴">
          <a href="#impact">환경 영향</a>
          <a href="#guide">AI 배출 가이드</a>
          <a href="#checklist">체크리스트</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <p className="eyebrow">Nature First Recycling Guide</p>
          <h1>쓰레기 하나가 숲과 강의 내일을 바꿉니다.</h1>
          <p>
            무단투기는 단순히 지저분한 문제가 아니라 토양, 하천, 생태계에 오래 남는 문제입니다.
            버릴 물건을 입력하면 AI가 한국 생활 기준에 맞춰 배출 방법을 정리해 줍니다.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#guide">AI에게 물어보기</a>
            <a className="button secondary" href="#impact">심각성 보기</a>
          </div>
        </div>
        <aside className="forest-card" aria-label="환경 보호 메시지">
          <span className="leaf-icon">잎</span>
          <strong>버리기 전 30초</strong>
          <p>비우기, 헹구기, 분리하기만 지켜도 재활용 품질과 자연 회복력이 달라집니다.</p>
        </aside>
      </section>

      <section className="section impact-section" id="impact">
        <div className="section-title">
          <p className="eyebrow">무단투기의 심각성</p>
          <h2>잘못 버린 쓰레기는 자연으로 돌아가지 않고 오래 남습니다.</h2>
        </div>
        <div className="impact-grid">
          {impactItems.map((item, index) => (
            <article className="impact-card" key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="guide-section" id="guide">
        <div className="guide-intro">
          <p className="eyebrow">AI 분리배출 도우미</p>
          <h2>버릴 물건을 입력하면 AI가 배출 방법을 알려줍니다.</h2>
          <p>
            물건의 재질, 오염 여부, 위험성, 재사용 가능성을 함께 고려해 실천하기 쉬운 안내로 정리합니다.
            지역별 기준은 다를 수 있으므로 최종 배출 전 지자체 안내도 함께 확인해 주세요.
          </p>
          <div className="chips" aria-label="예시 검색어">
            {examples.map((example) => (
              <button key={example} type="button" onClick={() => setItem(example)}>
                {example}
              </button>
            ))}
          </div>
        </div>

        <div className="ai-panel">
          <form className="search-box" onSubmit={handleSubmit}>
            <label htmlFor="waste-input">어떤 쓰레기를 버리나요?</label>
            <div className="input-row">
              <input
                id="waste-input"
                value={item}
                onChange={(event) => setItem(event.target.value)}
                placeholder="예: 양념 묻은 치킨 박스, 깨진 거울, 스티로폼"
                maxLength="60"
              />
              <button type="submit" disabled={loading}>
                {loading ? "분석 중" : "AI 분석"}
              </button>
            </div>
          </form>

          <div className="result" aria-live="polite">
            {!loading && !error && !result && (
              <div className="empty-state">
                <strong>AI 분석 결과가 여기에 표시됩니다.</strong>
                <p>쓰레기 이름을 구체적으로 입력할수록 더 정확한 배출 방법을 받을 수 있습니다.</p>
              </div>
            )}
            {loading && (
              <div className="loading-state">
                <span></span>
                <strong>AI가 배출 방법을 확인하고 있습니다.</strong>
              </div>
            )}
            {error && <p className="error">{error}</p>}
            {result && !error && (
              <article className="answer-card">
                <div className="answer-head">
                  <span>{result.item}</span>
                  <h3>{result.category}</h3>
                </div>
                <div className="answer-grid">
                  <section>
                    <strong>배출 방법</strong>
                    <ol>
                      {result.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </section>
                  <section>
                    <strong>주의사항</strong>
                    <p>{result.caution}</p>
                  </section>
                  <section>
                    <strong>재사용 아이디어</strong>
                    <p>{result.reuse}</p>
                  </section>
                  <section>
                    <strong>환경 포인트</strong>
                    <p>{result.environment}</p>
                  </section>
                </div>
              </article>
            )}
          </div>
        </div>
      </section>

      <section className="section checklist-section" id="checklist">
        <div className="section-title">
          <p className="eyebrow">배출 전 마지막 확인</p>
          <h2>자연으로 새지 않게, 수거함에 넣기 전 확인하세요.</h2>
        </div>
        <div className="checklist">
          {checklistItems.map((label) => (
            <label key={label}>
              <input
                type="checkbox"
                checked={checked.includes(label)}
                onChange={() => toggleCheck(label)}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <div className="progress" aria-label={`체크리스트 완료율 ${progress}%`}>
          <div style={{ width: `${progress}%` }}></div>
        </div>
      </section>

      <footer>
        <strong>Recycle AI</strong>
        <span>올바른 배출은 가장 가까운 자연 보호입니다.</span>
      </footer>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
