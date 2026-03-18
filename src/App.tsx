import { useState, useRef } from 'react';

type Message = {
  id: string;
  type: 'user' | 'ai';
  content?: string;
  imageUrl?: string;
  isLoading?: boolean;
};

async function generateImage(prompt: string): Promise<string> {
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('output_format', 'jpeg');

  const res = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_STABILITY_KEY}`,
      'Accept': 'image/*',
    },
    body: formData,
  });
  if (!res.ok) throw new Error(`Stability AI error: ${res.status}`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const el = chatContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  const handleGenerate = async () => {
    if (isGenerating || !prompt.trim()) return;

    const currentPrompt = prompt;
    const userMsgId = Date.now().toString();
    const aiMsgId = (Date.now() + 1).toString();

    setMessages(prev => [
      ...prev,
      { id: userMsgId, type: 'user', content: currentPrompt },
      { id: aiMsgId, type: 'ai', isLoading: true },
    ]);
    setPrompt('');
    setIsGenerating(true);
    setHasStarted(true);
    setTimeout(scrollToBottom, 50);

    try {
      const finalPrompt = style.trim() ? `${currentPrompt}, ${style.trim()}` : currentPrompt;
      const imageUrl = await generateImage(finalPrompt);
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, isLoading: false, imageUrl } : m));
    } catch (e) {
      console.error('[C4] Generation failed:', e);
      setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, isLoading: false } : m));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setHasStarted(false);
    setPrompt('');
  };

  return (
    <div className="app-shell">
      <aside className="chat-sidebar">
        <button className="new-chat-btn" onClick={startNewChat}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Chat
        </button>

        <div style={{ marginTop: '1.5rem' }}>
          <p className="eyebrow" style={{ marginBottom: '0.6rem', paddingLeft: '0.25rem' }}>Style</p>
          <input
            type="text"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="e.g. Disney, Cyberpunk, Watercolor"
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--line)',
              borderRadius: '0.75rem',
              padding: '0.6rem 0.8rem',
              color: 'var(--text)',
              fontSize: '0.85rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {style.trim() && (
            <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.4rem', paddingLeft: '0.25rem' }}>
              매 요청에 적용 중
            </p>
          )}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>C4 AI Image Lab v0.1</p>
        </div>
      </aside>

      <main className="workspace">
        <div className="ambient ambient-left" />
        <div className="ambient ambient-right" />

        {!hasStarted ? (
          <section className="landing-hero" style={{ zIndex: 5 }}>
            <div style={{ marginBottom: '2rem' }}>
              <p className="eyebrow">C4 / AI IMAGE LAB</p>
              <h1 style={{ fontFamily: 'Syne', fontWeight: 800 }}>Imagination to Visuals</h1>
              <p className="sidebar-copy" style={{ fontSize: '1.1rem', maxWidth: '560px', margin: '1.2rem auto 0', lineHeight: 1.8, opacity: 0.7 }}>
                머릿속에 있는 장면을 텍스트로 풀어보세요.<br />
                어떤 스타일이든, 어떤 분위기든 이미지로 만들어드립니다.
              </p>
            </div>
          </section>
        ) : (
          <div className="chat-messages" ref={chatContainerRef} style={{ zIndex: 5 }}>
            {messages.map((msg) => (
              <div key={msg.id} className={msg.type === 'user' ? 'bubble-user' : 'bubble-ai'}>
                {msg.type === 'user' ? (
                  <p>{msg.content}</p>
                ) : (
                  <div className="ai-image-wrapper">
                    {msg.isLoading
                      ? <div className="ai-image-skeleton" />
                      : msg.imageUrl
                        ? <img src={msg.imageUrl} alt="AI Generated" onLoad={scrollToBottom} />
                        : <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>이미지 생성에 실패했습니다. 다시 시도해보세요.</p>
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="prompt-dock-fixed">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="prompt-textarea-chat"
            placeholder="어떤 이미지를 만들어드릴까요?"
            rows={1}
          />
          <button
            className="send-button"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <div className="loading-dots" style={{ padding: 0 }}>
                <div className="dot" style={{ background: '#10131f' }} />
                <div className="dot" style={{ background: '#10131f' }} />
                <div className="dot" style={{ background: '#10131f' }} />
              </div>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
