import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './Pages.css'

const welcomeMessage = {
  type: 'assistant',
  text: 'Hello! I\'m Petly\'s care guide. I can help with nutrition, vaccinations, grooming, exercise, behavior, and general pet wellness for dogs and cats. For health concerns, I provide general guidance and I can help you decide when a veterinary check is recommended.'
}

const starterPrompts = [
  'How much exercise does my dog need?',
  'Suggest 5 food ideas for my dog',
  'Suggest 5 food ideas for my cat',
  'How can I help my puppy settle in?',
  'My dog is scratching a lot — what should I do?',
  'My cat has diarrhea — what should I watch for?',
  'How long should grooming take for my pet?'
]

function AIAssistant() {
  const [messages, setMessages] = useState(() => {
    try {
      const savedMessages = JSON.parse(localStorage.getItem('petly-ai-messages'))
      return Array.isArray(savedMessages) && savedMessages.length ? savedMessages : [welcomeMessage]
    } catch {
      return [welcomeMessage]
    }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    try { localStorage.setItem('petly-ai-messages', JSON.stringify(messages.slice(-30))) } catch { /* Chat remains usable when storage is unavailable. */ }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (message) => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || loading) return

    const userMessage = { type: 'user', text: trimmedMessage }
    const historyContext = messages
      .slice(-8)
      .filter((msg) => msg.text && ['user', 'assistant'].includes(msg.type))
      .map((msg) => ({ role: msg.type, content: msg.text }))

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post('/api/assistant', {
        message: trimmedMessage,
        history: historyContext
      })
      const assistantReply = response?.data?.reply || 'I didn’t get a response that time. Please try asking again.'
      setMessages(prev => [...prev, { type: 'assistant', text: assistantReply }])
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'I couldn’t reach the care service. Please check your connection and try again.'
      setMessages(prev => [...prev, { type: 'assistant', text: errorMessage, isError: true }])
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = (event) => {
    event.preventDefault()
    sendMessage(input)
  }

  const clearConversation = () => {
    setMessages([welcomeMessage])
    try { localStorage.removeItem('petly-ai-messages') } catch { /* Clearing the visible chat still works without storage access. */ }
  }

  return (
    <div>
      <div className="page-header">
        <h1>🤖 Pet Care Assistant</h1>
        <p>Professional guidance for nutrition, wellness, grooming, behavior, and everyday pet care</p>
      </div>

      <div className="container">
        <div className="card ai-chat-card">
          <div className="ai-chat-toolbar">
            <div className="ai-chat-status">
              <span className="ai-status-dot" aria-hidden="true" />
              <span>Petly care guide</span>
            </div>
            <button type="button" className="text-button" onClick={clearConversation} disabled={loading}>Clear chat</button>
          </div>

          <div className="ai-messages" aria-live="polite">
            {messages.map((msg, idx) => (
              <div key={`${msg.type}-${idx}`} className={`ai-message-row ${msg.type}`}>
                <div className={`ai-message ${msg.isError ? 'ai-message-error' : ''}`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-thinking" aria-live="polite">
                <span className="ai-spinner" aria-hidden="true" />
                <span>Reviewing trusted pet-care guidance...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="ai-input-form">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your dog or cat’s care, symptoms, or routine..."
              aria-label="Ask the Petly care assistant"
              disabled={loading}
            />
            <button type="submit" className="btn-primary" disabled={loading || !input.trim()}>Ask</button>
          </form>
        </div>

        <div className="card ai-prompts-card">
          <h3>Popular care questions</h3>
          <div className="ai-prompt-grid">
            {starterPrompts.map((question) => (
              <button key={question} type="button" className="btn-secondary" onClick={() => sendMessage(question)} disabled={loading}>
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant
