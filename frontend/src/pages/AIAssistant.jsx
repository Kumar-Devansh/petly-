import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import './Pages.css'

const welcomeMessage = {
  type: 'assistant',
  text: 'Hello! I\'m Petly\'s care guide. I can help with nutrition, vaccinations, grooming, exercise, behavior, and general pet wellness for dogs and cats. For health concerns, I provide general guidance and I can help you decide when a veterinary check is recommended.'
}

const starterPrompts = [
  'How much exercise does my dog need?',
  'Suggest 5 foods for a dog or cat',
  'Suggest 5 food ideas for my dog',
  'Suggest 5 food ideas for my cat',
  'How can I help my puppy settle in?',
  'My dog is scratching a lot — what should I do?',
  'My cat has diarrhea — what should I watch for?',
  'How long should grooming take for my pet?'
]

function renderAssistantMessage(text) {
  const lines = text.split(/\r?\n/)
  const blocks = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index].trim()
    if (!line) { index += 1; continue }

    const heading = line.match(/^(?:#{1,3}\s+(.+)|\*\*(.+)\*\*)$/)
    if (heading) {
      blocks.push({ type: 'heading', text: heading[1] || heading[2] })
      index += 1
      continue
    }

    const orderedItem = line.match(/^\d+[.)]\s+(.+)/)
    const unorderedItem = line.match(/^[-*•]\s+(.+)/)
    if (orderedItem || unorderedItem) {
      const type = orderedItem ? 'ordered-list' : 'unordered-list'
      const items = []
      while (index < lines.length) {
        const item = lines[index].trim().match(type === 'ordered-list' ? /^\d+[.)]\s+(.+)/ : /^[-*•]\s+(.+)/)
        if (!item) break
        items.push(item[1])
        index += 1
      }
      blocks.push({ type, items })
      continue
    }

    const paragraph = [line]
    index += 1
    while (index < lines.length && lines[index].trim() && !/^(?:#{1,3}\s+|\*\*.+\*\*\s*$|\d+[.)]\s+|[-*•]\s+)/.test(lines[index].trim())) {
      paragraph.push(lines[index].trim())
      index += 1
    }
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') })
  }

  return <div className="ai-response-content">{blocks.map((block, blockIndex) => {
    if (block.type === 'heading') return <h4 key={blockIndex}>{block.text}</h4>
    if (block.type === 'ordered-list' || block.type === 'unordered-list') {
      const List = block.type === 'ordered-list' ? 'ol' : 'ul'
      return <List key={blockIndex}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</List>
    }
    return <p key={blockIndex}>{block.text}</p>
  })}</div>
}

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
      .slice(-16)
      .filter((msg) => msg.text && ['user', 'assistant'].includes(msg.type) && !msg.isError && !msg.isWelcome && msg.text !== welcomeMessage.text)
      .map((msg) => ({ role: msg.type, content: msg.text }))

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post('/api/assistant', {
        message: trimmedMessage,
        history: historyContext
      }, { timeout: 35000 })
      const assistantReply = typeof response?.data?.reply === 'string' && response.data.reply.trim()
        ? response.data.reply.trim()
        : 'The assistant returned an empty response. Please try again.'
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

          <div className="ai-messages" role="log" aria-live="polite" aria-relevant="additions text">
            {messages.map((msg, idx) => (
              <div key={`${msg.type}-${idx}`} className={`ai-message-row ${msg.type}`}>
                <div className={`ai-message ${msg.isError ? 'ai-message-error' : ''}`}>
                  {msg.type === 'assistant' && !msg.isError ? renderAssistantMessage(msg.text) : msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-thinking" role="status">
                <span className="ai-spinner" aria-hidden="true" />
                <span>Thinking through your question…</span>
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
