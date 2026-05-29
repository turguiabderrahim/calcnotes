import { useState, useEffect } from 'react'
// Define the core parameters for the global style sheets
const THEMES = {
  hacker: {
    name: 'root@terminal:~#',
    bg: '#0a0f0d', text: '#00ff66', headerBg: '#0d1611', border: '#004411',
    btnBg: '#0f1a14', btnText: '#00ff66', btnBorder: '#004411',
    opBg: '#16331c', opText: '#00ff66', opBorder: '#008822',
    eqBg: '#005511', eqText: '#00ff66', eqBorder: '#00ff66',
    clBg: '#2a1111', clText: '#ff3333', clBorder: '#661111',
    font: '"Courier New", Courier, monospace'
  },
  cyberpunk: {
    name: 'CYBER_CORE //',
    bg: '#12041a', text: '#00ffff', headerBg: '#250633', border: '#ff007f',
    btnBg: '#1a002c', btnText: '#ff007f', btnBorder: '#ff007f',
    opBg: '#ffe600', opText: '#12041a', opBorder: '#ffe600',
    eqBg: '#ff007f', eqText: '#ffffff', eqBorder: '#ff007f',
    clBg: '#00ffff', clText: '#12041a', clBorder: '#00ffff',
    font: 'system-ui, sans-serif'
  },
  dracula: {
    name: 'dracula_env $',
    bg: '#282a36', text: '#f8f8f2', headerBg: '#1e1f29', border: '#44475a',
    btnBg: '#44475a', btnText: '#f8f8f2', btnBorder: '#6272a4',
    opBg: '#ff79c6', opText: '#282a36', opBorder: '#ff79c6',
    eqBg: '#50fa7b', eqText: '#282a36', eqBorder: '#50fa7b',
    clBg: '#ff5555', clText: '#ffffff', clBorder: '#ff5555',
    font: 'sans-serif'
  },
  light: {
    name: 'SYS_STANDARD //',
    bg: '#f4f4f9', text: '#1e1e24', headerBg: '#ffffff', border: '#d1d1d6',
    btnBg: '#e5e5ea', btnText: '#1e1e24', btnBorder: '#d1d1d6',
    opBg: '#007aff', opText: '#ffffff', opBorder: '#007aff',
    eqBg: '#34c759', eqText: '#ffffff', eqBorder: '#34c759',
    clBg: '#ff3b30', clText: '#ffffff', clBorder: '#ff3b30',
    font: 'system-ui, sans-serif'
  }
}

function App() {
  const [activeTab, setActiveTab] = useState('calc')
  const [isBooting, setIsBooting] = useState(true)
  const [bootText, setBootText] = useState('')
  const [showExtraFeatures, setShowExtraFeatures] = useState(false)

  // PWA Installation states
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallBanner, setShowInstallBanner] = useState(false)
  const [deviceOS, setDeviceOS] = useState('')

  // Theme State Configuration
  const [currentThemeKey, setCurrentThemeKey] = useState(() => {
    return localStorage.getItem('app_theme_key') || 'hacker'
  })
  const currentTheme = THEMES[currentThemeKey] || THEMES.hacker

  // Calculator States
  const [display, setDisplay] = useState('')
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('calc_history')
    return savedHistory ? JSON.parse(savedHistory) : []
  })

  // Unlimited Multi-Notes Setup
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('user_notes_array')
    return savedNotes ? JSON.parse(savedNotes) : [
      { id: '1', title: 'Default Note', content: '// Scratchpad initiated.\n' }
    ]
  })
  const [activeNoteId, setActiveNoteId] = useState(() => {
    return localStorage.getItem('active_note_id') || '1'
  })

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0]

  // Global Page Setup and Smart Mobile OS Detection
  useEffect(() => {
    document.body.style.backgroundColor = '#000000'
    document.body.style.margin = '0'
    document.body.style.padding = '0'

    // Detect OS environment
    const ua = navigator.userAgent || navigator.vendor || window.opera
    if (/android/i.test(ua)) {
      setDeviceOS('Android')
    } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      setDeviceOS('iOS')
      // iOS doesn't support the automatic standard banner, so we show manual instructions
      setShowInstallBanner(true)
    }

    // Android/Chrome event listener for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallBanner(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  // Boot animation routine
  useEffect(() => {
    const lines = [
      'LOAD_MODULE: CORRELATION_MATRIX_ENGINES...',
      'PARSING THEME INTERFACES [OK]...',
      'ALLOCATING UNLIMITED MULTI-NOTE STORAGE BUFFER...',
      'OPTIMIZING RESPONSIVE SCREEN MAPPINGS...',
      'INJECTING PWA AUTO-DETECTION BANNER...',
      'SYSTEM SECURITY VERIFIED.'
    ]
    let currentLineIndex = 0
    let currentText = ''
    const interval = setInterval(() => {
      if (currentLineIndex < lines.length) {
        currentText += lines[currentLineIndex] + '\n'
        setBootText(currentText)
        currentLineIndex++
      } else {
        clearInterval(interval)
        setTimeout(() => setIsBooting(false), 600)
      }
    }, 250)
    return () => clearInterval(interval)
  }, [])

  // Synchronization Watchers
  useEffect(() => { localStorage.setItem('app_theme_key', currentThemeKey) }, [currentThemeKey])
  useEffect(() => { localStorage.setItem('calc_history', JSON.stringify(history)) }, [history])
  useEffect(() => { localStorage.setItem('user_notes_array', JSON.stringify(notes)) }, [notes])
  useEffect(() => { localStorage.setItem('active_note_id', activeNoteId) }, [activeNoteId])

  // Trigger PWA Installation flow
  const executeAppInstallation = async () => {
    if (deviceOS === 'iOS') {
      alert('To install on iOS: Tap the "Share" button at the bottom of Safari, scroll down, and select "Add to Home Screen".')
      setShowInstallBanner(false)
      return
    }

    if (!deferredPrompt) {
      alert('Installation is already complete or your browser does not support web deployments.')
      return
    }
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      console.log('User installed the web application workspace.')
    }
    setDeferredPrompt(null)
    setShowInstallBanner(false)
  }

  // Calculator Logic
  const handleButtonClick = (value) => {
    if (value === 'C') {
      setDisplay('')
    } else if (value === '⌫') {
      setDisplay(prev => prev.slice(0, -1))
    } else if (value === 'x²') {
      if (!display) return
      setDisplay(prev => `(${prev})*(${prev})`)
    } else if (value === '√') {
      setDisplay(prev => prev + 'Math.sqrt(')
    } else if (value === '=') {
      try {
        if (!display) return
        let cleanExpression = display.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '*0.01')
        const evaluation = new Function(`return (${cleanExpression})`)()
        const result = String(evaluation)

        setHistory([{ id: Date.now(), expression: display, result }, ...history])
        setDisplay(result)
      } catch (error) {
        setDisplay('ERR_COMPUTATION_FAIL')
      }
    } else {
      setDisplay(display === 'ERR_COMPUTATION_FAIL' ? value : display + value)
    }
  }

  const sendToNote = (calcItem) => {
    const dataString = `\n// DATA_INJECTION: ${calcItem.expression} = ${calcItem.result}\n`
    setNotes(prevNotes => prevNotes.map(n => 
      n.id === activeNoteId ? { ...n, content: n.content + dataString } : n
    ))
    alert(`Injected into note: "${activeNote?.title}"`)
  }

  const createNewNote = () => {
    const title = prompt('Enter text file title:') || `Note_${Date.now().toString().slice(-4)}`
    const newNote = { id: Date.now().toString(), title, content: `// Document: ${title}\n` }
    setNotes([...notes, newNote])
    setActiveNoteId(newNote.id)
  }

  const deleteNote = (id, event) => {
    event.stopPropagation()
    if (notes.length === 1) return alert('Cannot clear remaining manifest storage anchor.')
    if (window.confirm('WIPE_SELECTED_DOCUMENT_RECORD?')) {
      const filtered = notes.filter(n => n.id !== id)
      setNotes(filtered)
      if (activeNoteId === id) setActiveNoteId(filtered[0].id)
    }
  }

  const updateNoteContent = (text) => {
    setNotes(prevNotes => prevNotes.map(n => 
      n.id === activeNoteId ? { ...n, content: text } : n
    ))
  }

  const cycleThemes = () => {
    const keys = Object.keys(THEMES)
    const nextIndex = (keys.indexOf(currentThemeKey) + 1) % keys.length
    setCurrentThemeKey(keys[nextIndex])
  }

  if (isBooting) {
    return (
      <div style={{...styles.bootScreen, backgroundColor: THEMES.hacker.bg, color: THEMES.hacker.text}}>
        <pre style={styles.bootText}>{bootText}</pre>
        <div>_</div>
      </div>
    )
  }

  return (
    <div style={{ ...styles.appContainer, backgroundColor: currentTheme.bg, color: currentTheme.text, fontFamily: currentTheme.font, border: `1px solid ${currentTheme.border}` }}>
      
      {/* PWA Auto Detection Prompt Banner */}
      {showInstallBanner && (
        <div style={{ ...styles.installBanner, backgroundColor: currentTheme.headerBg, borderBottom: `2px solid ${currentTheme.border}` }}>
          <span style={{ fontSize: '0.8rem' }}>⚙️ Setup System App icon on your {deviceOS || 'Device'}?</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={executeAppInstallation} style={{ ...styles.bannerBtn, backgroundColor: currentTheme.eqBg, color: currentTheme.eqText }}>[ INSTALL ]</button>
            <button onClick={() => setShowInstallBanner(false)} style={{ ...styles.bannerBtn, backgroundColor: currentTheme.clBg, color: currentTheme.clText }}>[ X ]</button>
          </div>
        </div>
      )}

      {/* Header Viewport */}
      <header style={{ ...styles.header, backgroundColor: currentTheme.headerBg, borderBottom: `2px solid ${currentTheme.border}` }}>
        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
          {currentTheme.name}
          {activeTab === 'calc' && 'calc_core'}
          {activeTab === 'history' && 'data_logs'}
          {activeTab === 'notes' && `notes/${activeNote?.title || 'manifest'}`}
        </span>
        <button onClick={cycleThemes} style={{ ...styles.themeBtn, border: `1px solid ${currentTheme.border}`, color: currentTheme.text }}>
          [ STYLE ]
        </button>
      </header>

      {/* Main Core Layout System */}
      <main style={styles.mainContent}>
        {activeTab === 'calc' && (
          <div style={styles.calcWrapper}>
            <div style={{ ...styles.screen, backgroundColor: currentTheme.headerBg, border: `1px solid ${currentTheme.border}` }}>
              <span>&gt;_</span> {display || '0'}
            </div>

            <button 
              onClick={() => setShowExtraFeatures(!showExtraFeatures)} 
              style={{ ...styles.extraToggleBtn, backgroundColor: currentTheme.btnBg, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}
            >
              {showExtraFeatures ? '[ HIDE EXTRA FEATURES ▲ ]' : '[ SHOW EXTRA FEATURES ▼ ]'}
            </button>

            {showExtraFeatures && (
              <div style={{ ...styles.extraDrawer, border: `1px solid ${currentTheme.border}`, backgroundColor: currentTheme.headerBg }}>
                {['(', ')', 'x²', '√', '%', '⌫'].map((extraBtn) => (
                  <button
                    key={extraBtn}
                    onClick={() => handleButtonClick(extraBtn)}
                    style={{
                      ...styles.btn,
                      fontSize: '1.1rem',
                      padding: '12px 2px',
                      backgroundColor: currentTheme.btnBg, color: currentTheme.text, border: `1px solid ${currentTheme.border}`
                    }}
                  >
                    {extraBtn}
                  </button>
                ))}
              </div>
            )}

            <div style={styles.grid}>
              {['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', 'C', '0', '=', '+'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => handleButtonClick(btn)}
                  style={{
                    ...styles.btn,
                    backgroundColor: currentTheme.btnBg, color: currentTheme.btnText, border: `1px solid ${currentTheme.btnBorder}`,
                    ...(btn === '=' ? { backgroundColor: currentTheme.eqBg, color: currentTheme.eqText, border: `1px solid ${currentTheme.eqBorder}` } : {}),
                    ...(btn === 'C' ? { backgroundColor: currentTheme.clBg, color: currentTheme.clText, border: `1px solid ${currentTheme.clBorder}` } : {}),
                    ...(['+', '-', '×', '÷'].includes(btn) ? { backgroundColor: currentTheme.opBg, color: currentTheme.opText, border: `1px solid ${currentTheme.opBorder}` } : {})
                  }}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div style={styles.scrollContainer}>
            <button onClick={() => setHistory([])} style={{ ...styles.actionBtn, backgroundColor: currentTheme.clBg, color: currentTheme.clText, border: `1px solid ${currentTheme.clBorder}` }}>
              [ PURGE_ALL_LOGS ]
            </button>
            {history.length === 0 ? (
              <p style={{ textAlign: 'center', color: currentTheme.border, fontSize: '0.85rem', marginTop: '20px' }}>// NO RECENT CALC_REGISTRIES DETECTED</p>
            ) : (
              history.map((item) => (
                <div key={item.id} style={{ ...styles.historyCard, backgroundColor: currentTheme.headerBg, border: `1px solid ${currentTheme.border}` }}>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>&gt;&gt; {item.expression}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '4px 0' }}>RETURN: {item.result}</div>
                  <button onClick={() => sendToNote(item)} style={{ ...styles.actionBtn, backgroundColor: currentTheme.btnBg, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}>
                    Inject into "{activeNote?.title}"
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div style={styles.notebookLayout}>
            <div style={{ ...styles.sidebar, borderRight: `1px solid ${currentTheme.border}`, backgroundColor: currentTheme.headerBg }}>
              <button onClick={createNewNote} style={{ ...styles.newNoteBtn, border: `1px solid ${currentTheme.border}`, color: currentTheme.text }}>
                + [NEW]
              </button>
              <div style={styles.sidebarList}>
                {notes.map(n => (
                  <div
                    key={n.id}
                    onClick={() => setActiveNoteId(n.id)}
                    style={{
                      ...styles.sidebarItem,
                      ...(n.id === activeNoteId ? { backgroundColor: currentTheme.bg, fontWeight: 'bold', borderLeft: `3px solid ${currentTheme.text}` } : {})
                    }}
                  >
                    <span style={styles.noteTitleText}>{n.title}</span>
                    <span onClick={(e) => deleteNote(n.id, e)} style={styles.deleteCross}>×</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.noteWrapper}>
              <textarea
                style={{ ...styles.textarea, backgroundColor: currentTheme.bg, color: currentTheme.text, fontFamily: currentTheme.font }}
                value={activeNote?.content || ''}
                onChange={(e) => updateNoteContent(e.target.value)}
                placeholder="// Terminal active. Write unrestricted records here..."
              />
            </div>
          </div>
        )}
      </main>

      {/* Dynamic Main App Tab Bar Layout */}
      <nav style={{ ...styles.tabBar, backgroundColor: currentTheme.headerBg, borderTop: `2px solid ${currentTheme.border}` }}>
        {['calc', 'history', 'notes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tabItem,
              fontFamily: currentTheme.font,
              color: activeTab === tab ? currentTheme.text : currentTheme.border,
              textShadow: activeTab === tab ? `0 0 5px ${currentTheme.text}` : 'none'
            }}
          >
            [{tab.toUpperCase()}]
          </button>
        ))}
      </nav>
    </div>
  )
}

// Fluid High-Responsiveness Flex Styles Layout Configuration
const styles = {
  bootScreen: { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', fontFamily: 'monospace', padding: '30px', boxSizing: 'border-box' },
  bootText: { whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '0.9rem' },
  appContainer: { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', maxWidth: '1200px', margin: '0 auto', overflow: 'hidden', position: 'relative', boxShadow: '0 0 30px rgba(0,0,0,0.8)' },
  installBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 15px', zIndex: 10 },
  bannerBtn: { padding: '4px 10px', fontSize: '0.75rem', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  header: { padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  themeBtn: { padding: '5px 10px', fontSize: '0.75rem', background: 'none', borderRadius: '4px', cursor: 'pointer' },
  mainContent: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column' },
  calcWrapper: { display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'flex-end', maxWidth: '600px', width: '100%', margin: '0 auto' },
  screen: { padding: '24px', fontSize: '2rem', textAlign: 'right', borderRadius: '4px', marginBottom: '15px', wordBreak: 'break-all', display: 'flex', justifyContent: 'space-between' },
  extraToggleBtn: { padding: '12px', fontSize: '0.85rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', marginBottom: '10px', textAlign: 'center', background: 'none' },
  extraDrawer: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', padding: '10px', borderRadius: '4px', marginBottom: '12px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
  btn: { padding: '20px 5px', fontSize: '1.4rem', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer', transition: 'opacity 0.1s ease' },
  scrollContainer: { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '700px', width: '100%', margin: '0 auto' },
  historyCard: { padding: '15px', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '6px' },
  actionBtn: { padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' },
  notebookLayout: { display: 'flex', height: '100%', gap: '15px', overflow: 'hidden', width: '100%' },
  sidebar: { width: '180px', display: 'flex', flexDirection: 'column', borderRadius: '4px', padding: '10px', overflowY: 'auto' },
  newNoteBtn: { padding: '8px', background: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '12px' },
  sidebarList: { display: 'flex', flexDirection: 'column', gap: '6px' },
  sidebarItem: { padding: '10px 6px', fontSize: '0.85rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  noteTitleText: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '130px' },
  deleteCross: { color: '#ff3333', fontWeight: 'bold', padding: '0 6px', fontSize: '1rem' },
  noteWrapper: { flex: 1, display: 'flex' },
  textarea: { flex: 1, border: 'none', padding: '15px', fontSize: '1rem', resize: 'none', outline: 'none', lineHeight: '1.5', borderRadius: '4px' },
  tabBar: { display: 'flex', height: '60px' },
  tabItem: { flex: 1, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold' }
}

export default App