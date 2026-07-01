import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'

function App() {
  const [code, setCode] = useState('')
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [serverStatus, setServerStatus] = useState('checking')

  // Check backend connectivity on component mount
  useEffect(() => {
    checkServerStatus()
    const interval = setInterval(checkServerStatus, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/ai/get-response?prompt=test', {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
      
      if (response.ok || response.status === 400) {
        setServerStatus('online')
        setError('')
      } else {
        setServerStatus('offline')
        setError('Backend server is offline')
      }
    } catch (err) {
      setServerStatus('offline')
      setError('Cannot connect to backend server on http://localhost:3000')
      console.warn('Backend offline:', err.message)
    }
  }

  const handleReviewCode = async () => {
    if (!code.trim()) {
      setError('Please enter some code to review')
      return
    }

    if (serverStatus === 'offline') {
      setError('Backend server is offline. Please start the backend server first.')
      return
    }

    setLoading(true)
    setError('')
    setReview('')

    try {
      console.log('Sending request to backend...')
      
      const response = await fetch('http://localhost:3000/ai/review-code', {
        method: 'POST',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        body: JSON.stringify({ code }),
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Received review from backend')
      
      if (!data.review) {
        throw new Error('No review data received from backend')
      }
      
      setReview(data.review)
    } catch (err) {
      console.error('Error details:', err)
      setError(`Error: ${err.message}. Make sure backend is running on http://localhost:3000`)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setCode('')
    setReview('')
    setError('')
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-top">
          <div>
            <h1>OptiCode AI</h1>
            <p>Get AI-powered code reviews and optimization suggestions</p>
          </div>
          <div className={`server-status ${serverStatus}`}>
            <span className={`status-dot ${serverStatus}`}></span>
            <span className="status-text">{serverStatus === 'online' ? 'Server Online' : 'Server Offline'}</span>
          </div>
        </div>
      </header>

      <div className="content">
        <div className="input-section">
          <div className="section-header">
            <h2>Paste Your Code</h2>
            <span className="hint">Any programming language</span>
          </div>
          <textarea
            className="code-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            disabled={serverStatus === 'offline'}
          />
          <div className="button-group">
            <button 
              className="submit-btn" 
              onClick={handleReviewCode}
              disabled={loading || serverStatus === 'offline'}
              title={serverStatus === 'offline' ? 'Backend server is offline' : 'Review your code'}
            >
              {loading ? 'Analyzing...' : 'Review Code'}
            </button>
            <button 
              className="clear-btn" 
              onClick={handleClear}
              disabled={loading}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="output-section">
          <div className="section-header">
            <h2>AI Review</h2>
            {review && <span className="hint">✓ Review ready</span>}
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Analyzing your code...</p>
            </div>
          )}
          
          {review && !loading && (
            <div className="review-output">
              <div className="review-content">
                <ReactMarkdown>{review}</ReactMarkdown>
              </div>
            </div>
          )}
          
          {!review && !loading && !error && (
            <div className="empty-state">
              <p>Your code review will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
