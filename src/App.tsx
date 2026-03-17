import { useState, useEffect, useRef } from 'react';

type Message = {
  id: string;
  type: 'user' | 'ai';
  content?: string;
  imageUrl?: string;
  timestamp: Date;
  isLoading?: boolean;
};

type ImageHistory = {
  id: string;
  prompt: string;
  url: string;
  created_at: string;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<ImageHistory[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      const items = Array.isArray(data) ? data : [];
      setHistory(items);
      
      // If we have history, show the last few as messages if the user hasn't started a fresh chat
      if (items.length > 0 && !hasStarted) {
        const initialMessages: Message[] = [];
        // Just show the last one to keep it clean
        const last = items[0];
        initialMessages.push({
          id: `u-${last.id}`,
          type: 'user',
          content: last.prompt,
          timestamp: new Date(last.created_at)
        });
        initialMessages.push({
          id: `a-${last.id}`,
          type: 'ai',
          imageUrl: last.url,
          timestamp: new Date(last.created_at)
        });
        setMessages(initialMessages);
        setHasStarted(true);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const handleGenerate = async () => {
    if (isGenerating || !prompt.trim()) return;
    
    const currentPrompt = prompt;
    const userMsgId = Date.now().toString();
    const aiMsgId = (Date.now() + 1).toString();
    
    // 1. Add user message immediately
    const newUserMsg: Message = {
      id: userMsgId,
      type: 'user',
      content: currentPrompt,
      timestamp: new Date()
    };
    
    // 2. Add loading AI message
    const newAiLoadingMsg: Message = {
      id: aiMsgId,
      type: 'ai',
      isLoading: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMsg, newAiLoadingMsg]);
    setPrompt('');
    setIsGenerating(true);
    setHasStarted(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: currentPrompt }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // 3. Update the loading message with actual content
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, isLoading: false, imageUrl: data.url, id: data.id } 
            : msg
        ));
        // Update history sidebar
        setHistory(prev => [data, ...prev]);
      } else {
        setMessages(prev => prev.filter(msg => msg.id !== aiMsgId));
        console.error('Generation failed');
      }
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== aiMsgId));
      console.error('Failed to generate image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <p className="eyebrow" style={{ marginBottom: '1rem', paddingLeft: '0.5rem' }}>Recent History</p>
          {history.map(item => (
            <button 
              key={item.id} 
              className="history-item-btn"
              onClick={() => {
                setPrompt(item.prompt);
              }}
            >
              {item.prompt}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--line)' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>C4 AI Image Lab v0.1</p>
        </div>
      </aside>

      <main className="workspace">
        <div className="ambient ambient-left" />
        <div className="ambient ambient-right" />

        {!hasStarted ? (
          <section className="landing-hero" style={{ z-index: 5 }}>
            <div style={{ marginBottom: '2rem' }}>
              <p className="eyebrow">C4 / AI IMAGE LAB</p>
              <h1 style={{ fontFamily: 'Syne', fontWeight: 800 }}>Imagination to Visuals</h1>
              <p className="sidebar-copy" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '1rem auto' }}>
                설명만으로 놀라운 이미지를 만들어보세요. 
                왼쪽 히스토리에서 이전 작업을 확인하거나, 바로 채팅을 시작할 수 있습니다.
              </p>
            </div>
          </section>
        ) : (
          <div className="chat-messages" style={{ zIndex: 5 }}>
            {messages.map((msg) => (
              <div key={msg.id} className={msg.type === 'user' ? 'bubble-user' : 'bubble-ai'}>
                {msg.type === 'user' ? (
                  <p>{msg.content}</p>
                ) : (
                  <div className="ai-image-wrapper">
                    {msg.isLoading ? (
                      <div className="ai-image-skeleton" />
                    ) : (
                      <img src={msg.imageUrl} alt="AI Generated" onLoad={scrollToBottom} />
                    )}
                    {!msg.isLoading && (
                      <div className="ai-meta">
                        <span>{msg.timestamp.toLocaleTimeString()}</span>
                        <button 
                          className="ghost-button" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} 
                          onClick={() => setPrompt(messages.find(m => m.id === `u-${msg.id}`)?.content || "")}
                        >
                          Remix
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
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
