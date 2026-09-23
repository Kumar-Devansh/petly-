import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Pages.css'

const categoryImages = {
  Nutrition: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=900&q=85',
  Exercise: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=85',
  Health: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=900&q=85',
  Safety: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=85',
  Enrichment: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=85',
  Hygiene: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=900&q=85',
  Grooming: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=85',
  'Seasonal Care': 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85',
  Behavior: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=85'
}

function HealthTips() {
  const [tips, setTips] = useState([])
  const [activeCategory, setActiveCategory] = useState('Everything')
  const [search, setSearch] = useState('')
  const [expandedTip, setExpandedTip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get('/api/health-tips')
      .then(({ data }) => setTips(data))
      .catch(() => setError('The care journal couldn’t load. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => ['Everything', ...new Set(tips.map((tip) => tip.category))], [tips])
  const visibleTips = useMemo(() => tips.filter((tip) => {
    const matchesCategory = activeCategory === 'Everything' || tip.category === activeCategory
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || `${tip.title} ${tip.category} ${tip.content}`.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  }), [activeCategory, search, tips])

  return (
    <div className="petly-page journal-page">
      <header className="showcase-hero journal-hero">
        <div className="showcase-hero-content">
          <span className="showcase-eyebrow">LITTLE NOTES FOR A LOVELY LIFE</span>
          <h1>Good care is<br /><em>made of little things.</em></h1>
          <p>Small, thoughtful ideas for happier routines, healthier habits, and more good days together.</p>
          <a className="showcase-button" href="#care-journal">Explore the journal <span>↓</span></a>
        </div>
        <div className="showcase-hero-caption"><span>CARE / NOTES</span><span>Curiosity looks good on you</span></div>
      </header>

      <main className="page-shell" id="care-journal">
        <div className="page-intro-row"><div><span className="page-eyebrow">A POCKET-SIZED CARE LIBRARY</span><h2>Find your next little idea</h2></div><Link to="/ai-assistant" className="page-inline-link">Ask a question ↗</Link></div>
        <label className="journal-search"><span>⌕</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search routines, topics, or tiny questions…" aria-label="Search care notes" /></label>
        <div className="journal-categories" aria-label="Care note categories">{categories.map((category) => <button type="button" key={category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
        {error && <div className="page-alert" role="alert">{error}</div>}
        {loading ? <div className="page-loading">Picking out a few helpful notes…</div> : visibleTips.length ? <div className="journal-grid">{visibleTips.map((tip, index) => <article className={`journal-card ${expandedTip === tip.id ? 'expanded' : ''}`} key={tip.id}>
          <div className="journal-card-image"><img src={categoryImages[tip.category] || categoryImages.Health} alt="" loading="lazy" /><span>{tip.category}</span><span className="journal-card-index">{String(index + 1).padStart(2, '0')}</span></div>
          <div className="journal-card-copy"><span className="page-eyebrow">A SMALL THING TO TRY</span><h3>{tip.title}</h3><p>{tip.content}</p><button type="button" className="journal-read-more" aria-expanded={expandedTip === tip.id} onClick={() => setExpandedTip((current) => current === tip.id ? null : tip.id)}>{expandedTip === tip.id ? 'A little less ↑' : 'Keep reading ↗'}</button></div>
        </article>)}</div> : <section className="page-empty-state compact"><span>⌕</span><h3>No notes found</h3><p>Try another search or choose a different topic.</p><button type="button" className="quiet-button" onClick={() => { setSearch(''); setActiveCategory('Everything') }}>Clear search</button></section>}

        <section className="journal-disclaimer"><span>✚</span><div><strong>For the big questions, call your vet.</strong><p>These notes are general ideas, not a diagnosis or a care plan for an individual pet. Your veterinary team knows your companion best.</p></div><Link to="/ai-assistant">Ask Petly ↗</Link></section>
      </main>
    </div>
  )
}

export default HealthTips
