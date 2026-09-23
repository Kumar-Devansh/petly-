import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Pages.css'

const fallbackPhoto = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87e?auto=format&fit=crop&w=900&q=85'
const filters = ['All friends', 'Dogs', 'Cats']

function Adoption() {
  const [adoptions, setAdoptions] = useState([])
  const [activeFilter, setActiveFilter] = useState('All friends')
  const [selectedPet, setSelectedPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get('/api/adoptions')
      .then(({ data }) => setAdoptions(data))
      .catch(() => setError('We couldn’t load the adoption listings. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const visiblePets = useMemo(() => activeFilter === 'All friends'
    ? adoptions
    : adoptions.filter((pet) => pet.type.toLowerCase() === activeFilter.slice(0, -1).toLowerCase()), [activeFilter, adoptions])

  return (
    <div className="petly-page adoption-page">
      <header className="showcase-hero adoption-hero">
        <div className="showcase-hero-content">
          <span className="showcase-eyebrow">A LITTLE MORE LOVE IN THE WORLD</span>
          <h1>Somewhere,<br /><em>your friend is waiting.</em></h1>
          <p>Meet lovely animals from our rescue partners, each with a story still being written.</p>
          <a className="showcase-button" href="#adoption-friends">Meet the friends <span>↓</span></a>
        </div>
        <div className="showcase-hero-caption"><span>04 / 04</span><span>Good things find their way home</span></div>
      </header>

      <main className="page-shell" id="adoption-friends">
        <section className="adoption-note"><span className="adoption-note-icon">♡</span><div><span className="page-eyebrow">A THOUGHTFUL FIRST STEP</span><h2>Every good match starts with a hello.</h2><p>Get to know the pet and the rescue partner first. They can share the details, arrange a meet, and help you decide if it feels right.</p></div><Link to="/health-tips" className="page-inline-link">Getting ready to adopt ↗</Link></section>

        <div className="page-intro-row"><div><span className="page-eyebrow">MEET YOUR NEW FAVORITE</span><h2>Friends looking for home</h2></div><p>Good chemistry takes one little introduction.</p></div>
        <div className="adoption-filters" role="tablist" aria-label="Filter adoptable pets">{filters.map((filter) => <button type="button" role="tab" aria-selected={activeFilter === filter} className={activeFilter === filter ? 'active' : ''} key={filter} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
        {error && <div className="page-alert" role="alert">{error}</div>}
        {loading ? <div className="page-loading">Finding the latest little faces…</div> : visiblePets.length ? <div className="adoption-grid">{visiblePets.map((pet, index) => <article className="adoption-card" key={pet.id}>
          <button type="button" className="adoption-photo-button" onClick={() => setSelectedPet(pet)} aria-label={`Meet ${pet.name}`}><img src={pet.image || fallbackPhoto} alt={`${pet.name}, ${pet.breed}`} loading="lazy" onError={(event) => { event.currentTarget.src = fallbackPhoto }} /><span className="adoption-photo-tag">A FRIENDLY HELLO</span><span className="adoption-photo-arrow">↗</span></button>
          <div className="adoption-card-copy"><div className="adoption-pet-heading"><div><span className="page-eyebrow">{pet.type} · {pet.age}</span><h3>{pet.name}</h3></div><span className="adoption-heart" aria-hidden="true">{index % 2 ? '✿' : '♡'}</span></div><p className="adoption-breed">{pet.breed}</p><p className="adoption-description">“{pet.description}”</p><div className="adoption-card-footer"><span>With {pet.ngo}</span><button type="button" onClick={() => setSelectedPet(pet)}>A little about {pet.name} ↗</button></div></div>
        </article>)}</div> : <section className="page-empty-state compact"><span>♡</span><h3>No matches in this group</h3><p>Try another filter to meet more of our friends.</p><button type="button" className="quiet-button" onClick={() => setActiveFilter('All friends')}>See all friends</button></section>}

        <section className="page-soft-banner adoption-bottom-banner"><span className="soft-banner-icon">☼</span><div><span className="page-eyebrow">ALREADY HAVE A PET?</span><h3>There’s still plenty of love to go around.</h3><p>Keep the whole household happy with profiles, routines, and care notes.</p></div><Link to="/pets" className="page-inline-link">Meet your crew ↗</Link></section>
      </main>

      {selectedPet && <div className="page-modal-backdrop" role="presentation" onClick={() => setSelectedPet(null)}><section className="page-modal adoption-detail-modal" role="dialog" aria-modal="true" aria-labelledby="adoption-modal-title" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="page-modal-close" onClick={() => setSelectedPet(null)} aria-label="Close adoption details">×</button><img src={selectedPet.image || fallbackPhoto} alt={selectedPet.name} /><div className="page-modal-content"><span className="page-eyebrow">A FRIEND FROM {selectedPet.ngo}</span><h2 id="adoption-modal-title">Say hello to {selectedPet.name}</h2><p>{selectedPet.age} · {selectedPet.breed}</p><blockquote>“{selectedPet.description}”</blockquote><p>Reach out to <strong>{selectedPet.ngo}</strong> to learn about {selectedPet.name}’s story and arrange a first meeting.</p><Link to="/ai-assistant" className="showcase-button">Ask how to prepare ↗</Link></div>
      </section></div>}
    </div>
  )
}

export default Adoption
