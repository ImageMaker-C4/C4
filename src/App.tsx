type ReferenceCard = {
  title: string;
  subtitle: string;
  tone: string;
};

type HistoryItem = {
  name: string;
  status: string;
  accent: string;
};

const references: ReferenceCard[] = [
  {
    title: '피사체',
    subtitle: '도시 감성의 핸드드립 바를 위한 메인 컷',
    tone: 'amber',
  },
  {
    title: '장면',
    subtitle: '새벽빛, 곡선 유리, 따뜻한 안개가 흐르는 스튜디오',
    tone: 'mint',
  },
  {
    title: '스타일',
    subtitle: '광택 금속, 소프트 필름 노이즈, 광고 스틸 라이팅',
    tone: 'violet',
  },
];

const history: HistoryItem[] = [
  { name: 'Hero frame A', status: '방금 생성됨', accent: 'amber' },
  { name: 'Story variation', status: '리믹스 준비', accent: 'mint' },
  { name: 'Mobile crop', status: '다운로드 가능', accent: 'violet' },
];

const gallery = [
  '라운지 톤의 제품 히어로',
  '밝은 포스터형 탐색안',
  'SNS 스토리용 타이트 컷',
  '제품 소개 섹션용 배너',
];

function App() {
  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />

      <aside className="sidebar">
        <div>
          <p className="eyebrow">C4 / image lab</p>
          <h1>Whisk-inspired client workspace</h1>
          <p className="sidebar-copy">
            참고 이미지와 프롬프트를 한 화면에서 조합해 빠르게 생성 흐름을 확인할 수
            있게 구성했어.
          </p>
        </div>

        <section className="sidebar-panel upload-panel">
          <div>
            <p className="panel-label">애셋</p>
            <h2>이미지를 드래그해 보세요</h2>
          </div>
          <p className="panel-copy">
            피사체, 장면, 스타일 이미지를 올리고 프롬프트에서 바로 참조하는 흐름을
            강조했어.
          </p>
          <button className="ghost-button">이미지 업로드</button>
        </section>

        <section className="sidebar-panel history-panel">
          <div className="panel-heading-row">
            <p className="panel-label">기록</p>
            <span className="pill">최근 3개</span>
          </div>
          <div className="history-list">
            {history.map((item) => (
              <article className={`history-card ${item.accent}`} key={item.name}>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.status}</p>
                </div>
                <button>열기</button>
              </article>
            ))}
          </div>
        </section>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">프로젝트 화면</p>
            <h2>참고 이미지 + 프롬프트 + 결과 갤러리</h2>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button">프로젝트 다운로드</button>
            <button className="primary-button">공유 링크 생성</button>
          </div>
        </header>

        <section className="reference-strip">
          {references.map((card) => (
            <article className={`reference-card ${card.tone}`} key={card.title}>
              <div className="reference-art" />
              <div>
                <p className="panel-label">{card.title}</p>
                <h3>{card.subtitle}</h3>
              </div>
            </article>
          ))}
        </section>

        <section className="prompt-dock">
          <div className="prompt-heading">
            <div>
              <p className="panel-label">프롬프트</p>
              <h3>describe an idea or start with subject, scene, style</h3>
            </div>
            <div className="dock-controls">
              <span>가로세로 비율 16:9</span>
              <span>시드 2048</span>
              <span>설정 high fidelity</span>
            </div>
          </div>

          <div className="prompt-box">
            <p>
              새벽 안개가 남아 있는 유리 바에서 브러시드 스틸 커피 메이커가 은은하게
              빛나고, 따뜻한 호박색 하이라이트와 광고 사진 같은 깊은 콘트라스트를 만든다.
            </p>
          </div>

          <div className="prompt-actions">
            <button className="ghost-button">이미지 추가</button>
            <button className="ghost-button">애니메이션 적용</button>
            <button className="primary-button">생성</button>
          </div>
        </section>

        <section className="gallery-section">
          <div className="panel-heading-row">
            <div>
              <p className="panel-label">결과</p>
              <h3>리믹스 가능한 생성 결과</h3>
            </div>
            <button className="ghost-button">모든 이미지 다운로드</button>
          </div>

          <div className="gallery-grid">
            {gallery.map((item, index) => (
              <article className="gallery-card" key={item}>
                <div className={`gallery-visual gradient-${index + 1}`}>
                  <span>{index + 1}</span>
                </div>
                <div className="gallery-meta">
                  <div>
                    <h4>{item}</h4>
                    <p>세부정보 추가 또는 수정하기</p>
                  </div>
                  <button>리믹스</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
