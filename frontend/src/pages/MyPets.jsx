import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Pages.css'

const fallbackPetImage = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85'

function MyPets() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedPet, setSelectedPet] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ name: '', type: '', breed: '', age: '' })

  const fetchPets = async () => {
    try {
      const { data } = await axios.get('/api/pets')
      setPets(data)
      setError('')
    } catch {
      setError('We couldn’t load your pet profiles. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPets() }, [])

  const handleAddPet = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { data } = await axios.post('/api/pets', { ...formData, age: Number(formData.age) })
      setPets((current) => [...current, data])
      setFormData({ name: '', type: '', breed: '', age: '' })
      setShowForm(false)
    } catch {
      setError('Your new profile couldn’t be saved. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="petly-page pets-page">
      <header className="showcase-hero pets-hero">
        <div className="showcase-hero-content">
          <span className="showcase-eyebrow">THE BEST PART OF YOUR DAY</span>
          <h1>Your people.<br /><em>Your pets.</em></h1>
          <p>A little home for every face, favorite, and funny habit you love.</p>
          <button type="button" className="showcase-button" onClick={() => setShowForm((open) => !open)}>
            {showForm ? 'Close profile form' : '＋ Add a pet'}
          </button>
        </div>
        <div className="showcase-hero-caption"><span>01 / 04</span><span>A home for the whole pack</span></div>
      </header>

      <main className="page-shell">
        <div className="page-intro-row">
          <div><span className="page-eyebrow">YOUR HOUSEHOLD</span><h2>Meet the crew</h2></div>
          <p>{pets.length ? `${pets.length} lovely ${pets.length === 1 ? 'companion' : 'companions'} make this place home.` : 'Your pet family starts with a profile.'}</p>
        </div>

        {error && <div className="page-alert" role="alert">{error}</div>}

        {showForm && <section className="page-form-panel" aria-labelledby="new-pet-title">
          <div className="page-panel-heading"><div><span className="page-eyebrow">A NEW LITTLE PROFILE</span><h2 id="new-pet-title">Tell us about them</h2></div><span className="page-panel-illustration">🐾</span></div>
          <form className="page-form-grid" onSubmit={handleAddPet}>
            <label>Pet’s name<input name="name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="e.g. Miso" required /></label>
            <label>Kind of pet<select name="type" value={formData.type} onChange={(event) => setFormData({ ...formData, type: event.target.value })} required><option value="">Choose a pet</option><option>Dog</option><option>Cat</option><option>Bird</option><option>Rabbit</option><option>Other</option></select></label>
            <label>Breed or mix<input name="breed" value={formData.breed} onChange={(event) => setFormData({ ...formData, breed: event.target.value })} placeholder="If you know it" required /></label>
            <label>Age in years<input name="age" type="number" min="0" step="0.1" value={formData.age} onChange={(event) => setFormData({ ...formData, age: event.target.value })} placeholder="e.g. 2" required /></label>
            <div className="page-form-actions"><button className="showcase-button" type="submit" disabled={saving}>{saving ? 'Saving profile…' : 'Save their profile'}</button><button type="button" className="quiet-button" onClick={() => setShowForm(false)}>Cancel</button></div>
          </form>
        </section>}

        {loading ? <div className="page-loading">Gathering the family portraits…</div> : pets.length ? <div className="pet-profile-grid">
          {pets.map((pet, index) => <article className="pet-profile-card" key={pet.id}>
            <button type="button" className="pet-profile-image-button" onClick={() => setSelectedPet(pet)} aria-label={`View ${pet.name}’s profile`}>
              <img src={pet.image || fallbackPetImage} alt={`${pet.name}, ${pet.breed || pet.type}`} loading="lazy" onError={(event) => { event.currentTarget.src = fallbackPetImage }} />
              <span className="pet-profile-index">PET NO. {String(index + 1).padStart(2, '0')}</span>
              <span className="pet-profile-kind">{pet.type || 'Companion'}</span>
            </button>
            <div className="pet-profile-info"><div><h3>{pet.name}</h3><p>{pet.breed || 'A one-of-a-kind original'}</p></div><span className="pet-profile-age">{pet.age ?? '—'} <small>yrs</small></span></div>
            <button type="button" className="pet-profile-details" onClick={() => setSelectedPet(pet)}>Get to know {pet.name} <span>↗</span></button>
          </article>)}
        </div> : <section className="page-empty-state"><span>🐾</span><h3>There’s room for one more story</h3><p>Add a pet profile to keep their little details in one easy place.</p><button type="button" className="showcase-button" onClick={() => setShowForm(true)}>Create a pet profile</button></section>}

        <section className="page-soft-banner pet-care-banner"><span className="soft-banner-icon">✿</span><div><span className="page-eyebrow">A LITTLE REMINDER</span><h3>Every pet has their own kind of wonderful.</h3><p>Keep their care notes close, and let their personality take up all the space it needs.</p></div><Link to="/ai-assistant" className="page-inline-link">Ask the care guide ↗</Link></section>
      </main>

      {selectedPet && <div className="page-modal-backdrop" role="presentation" onClick={() => setSelectedPet(null)}><section className="page-modal pet-detail-modal" role="dialog" aria-modal="true" aria-labelledby="pet-modal-title" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="page-modal-close" onClick={() => setSelectedPet(null)} aria-label="Close pet details">×</button>
        <img src={selectedPet.image || fallbackPetImage} alt={`${selectedPet.name}`} />
        <div className="page-modal-content"><span className="page-eyebrow">A VERY GOOD COMPANION</span><h2 id="pet-modal-title">{selectedPet.name}</h2><p>{selectedPet.breed || selectedPet.type} · {selectedPet.age ?? 'Age unknown'} years old</p><div className="page-modal-links"><Link to="/vaccinations">Health records ↗</Link><Link to="/bookings">Plan a visit ↗</Link><Link to="/ai-assistant">Ask about {selectedPet.name} ↗</Link></div></div>
      </section></div>}
    </div>
  )
}

export default MyPets
