import { useState } from 'react'
import './AIPanel.css'

function AIPanel() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI architecture assistant. I can help you design better cloud systems, optimize costs, and follow best practices. What would you like to know?",
      sender: 'ai'
    }
  ])

  const handleSend = (e) => {
    e.preventDefault()
    if (!message.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user'
    }

    setMessages([...messages, userMessage])
    setMessage('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "I can help you optimize your architecture. Based on your current setup, I recommend reviewing the cost breakdown and considering serverless options for better scalability.",
        sender: 'ai'
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <div className="ai-header-content">
          <div className="ai-icon">🤖</div>
          <span>AI Assistant</span>
        </div>
      </div>
      
      <div className="ai-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`ai-message ${msg.sender}`}>
            {msg.sender === 'ai' && <div className="ai-avatar">AI</div>}
            <div className="ai-message-content">{msg.text}</div>
          </div>
        ))}
      </div>

      <form className="ai-input-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Ask about architecture, costs, best practices..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="ai-input"
        />
        <button type="submit" className="ai-send-btn" disabled={!message.trim()}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </form>
    </div>
  )
}

export default AIPanel
