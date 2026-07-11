import { useId, useRef, useState } from 'react'
import { useStore } from '../context/StoreContext'

function AIAssistant() {
  const { name } = useStore()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I can help you with ${name} inventory, pricing, and quick campaign ideas.`,
    },
  ])
  const [draft, setDraft] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const inputRef = useRef(null)
  const inputId = useId()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!draft.trim()) {
      return
    }

    const prompt = draft.trim()
    setMessages((current) => [...current, { role: 'user', content: prompt }])
    setDraft('')
    setIsThinking(true)

    await new Promise((resolve) => window.setTimeout(resolve, 700))

    const reply = generateReply(prompt)
    setMessages((current) => [...current, { role: 'assistant', content: reply }])
    setIsThinking(false)
    inputRef.current?.focus()
  }

  return (
    <section className="ai-card">
      <div className="card-heading">
        <p className="eyebrow">AI assistant</p>
        <h3>Ask for a quick recommendation</h3>
      </div>

      <div className="message-list" aria-live="polite">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
        {isThinking ? <div className="message assistant">Thinking...</div> : null}
      </div>

      <form className="assistant-form" onSubmit={handleSubmit}>
        <label htmlFor={inputId} className="sr-only">
          Ask the assistant
        </label>
        <input
          ref={inputRef}
          id={inputId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Try: suggest a weekend promo"
        />
        <button type="submit">Send</button>
      </form>
    </section>
  )
}

function generateReply(prompt) {
  const lowerPrompt = prompt.toLowerCase()

  if (lowerPrompt.includes('promo') || lowerPrompt.includes('sale')) {
    return 'A limited weekend bundle could lift conversion. Try pairing a house roast with a pastry add-on for a $4 uplift.'
  }

  if (lowerPrompt.includes('price')) {
    return 'Pricing works best when it feels premium but approachable. Consider a $2 test increase on the featured roast if demand stays steady.'
  }

  if (lowerPrompt.includes('stock')) {
    return 'Keep best-sellers visible first. I would spotlight the top two fast movers and refresh the rest of the catalog weekly.'
  }

  return 'I can help draft a promotion, review a product price, or organize the catalog around your best sellers.'
}

export default AIAssistant
