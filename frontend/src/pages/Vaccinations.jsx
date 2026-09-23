import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Pages.css'

const tabs = ['All records', 'Upcoming', 'Overdue', 'Completed']
const fallbackPhoto = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80'
const prettyDate = (value) => {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? 'Date not set' : new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date)
}

function Vaccinations() {
  const [vaccinations, setVaccinations] = useState([])
  const [pets, setPets] = useState([])
  const [activeTab, setActiveTab] = useState('All records')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([axios.get('/api/vaccinations'), axios.get('/api/pets')])
      .then(([vaccineResponse, petResponse]) => {
        setVaccinations(vaccineResponse.data)
        setPets(petResponse.data)
      })
      .catch(() => setError('We couldn’t load your health records. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredRecords = useMemo(() => activeTab === 'All records'
    ? vaccinations
    : vaccinations.filter((record) => record.status === activeTab), [activeTab, vaccinations])
  const countFor = (status) => vaccinations.filter((record) => record.status === status).length

  return (
    <div className="petly-page wellness-page">
      <header className="showcase-hero vaccine-hero">
        <div className="showcase-hero-content">
          <span className="showcase-eyebrow">THE LITTLE THINGS THAT PROTECT</span>
          <h1>Healthy days,<br /><em>well remembered.</em></h1>
          <p>Keep the important dates and vet notes together, without the paper shuffle.</p>
          <Link to="/pets" className="showcase-button">View your pets <span>↗</span></Link>
        </div>
        <div className="showcase-hero-caption"><span>02 / 04</span><span>Wellness, kept close</span></div>
      </header>

      <main className="page-shell">
        <div className="page-intro-row"><div><span className="page-eyebrow">PREVENTIVE CARE</span><h2>Vaccination records</h2></div><p>A little organization goes a long way at the next check-up.</p></div>
        <div className="vaccine-summary-row">
          <button type="button" className={`vaccine-summary-card ${activeTab === 'All records' ? 'active' : ''}`} onClick={() => setActiveTab('All records')}><span>✳</span><small>ALL RECORDS</small><strong>{vaccinations.length}</strong></button>
          {['Upcoming', 'Overdue', 'Completed'].map((status) => <button type="button" key={status} className={`vaccine-summary-card ${status.toLowerCase()} ${activeTab === status ? 'active' : ''}`} onClick={() => setActiveTab(status)}><span>{status === 'Upcoming' ? '◷' : status === 'Overdue' ? '!' : '✓'}</span><small>{status.toUpperCase()}</small><strong>{countFor(status)}</strong></button>)}
        </div>

        <section className="page-content-panel">
          <div className="page-panel-heading vaccine-list-heading"><div><span className="page-eyebrow">YOUR PETS’ HISTORY</span><h2>{activeTab}</h2></div><div className="vaccine-tabs" role="tablist" aria-label="Filter vaccination records">{tabs.map((tab) => <button type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'active' : ''} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div></div>
          {error && <div className="page-alert" role="alert">{error}</div>}
          {loading ? <div className="page-loading">Gathering your pet’s records…</div> : filteredRecords.length ? <div className="vaccine-record-list">{filteredRecords.map((record) => {
            const pet = pets.find((entry) => entry.id === record.petId)
            return <article className="vaccine-record" key={record.id}>
              <img src={pet?.image || fallbackPhoto} alt={pet?.name || 'Pet'} loading="lazy" onError={(event) => { event.currentTarget.src = fallbackPhoto }} />
              <div className="vaccine-record-main"><span className="page-eyebrow">{pet?.name || `PET #${record.petId}`}</span><h3>{record.vaccine}</h3><p>Given {prettyDate(record.date)} <span>·</span> Next due {prettyDate(record.nextDue)}</p></div>
              <span className={`vaccine-status ${record.status.toLowerCase()}`}>{record.status}</span>
              <Link to="/ai-assistant" className="vaccine-record-link" aria-label={`Ask about ${record.vaccine}`}>↗</Link>
            </article>
          })}</div> : <div className="page-empty-state compact"><span>✿</span><h3>Nothing in this view yet</h3><p>When you add more records, they’ll show up here.</p></div>}
        </section>

        <section className="page-soft-banner vaccine-note"><span className="soft-banner-icon">✚</span><div><span className="page-eyebrow">A NOTE FOR YOUR NEXT VISIT</span><h3>Schedules are personal.</h3><p>Your veterinarian can tailor vaccine timing to your pet’s age, health, local risks, and lifestyle.</p></div><Link to="/ai-assistant" className="page-inline-link">Ask a general question ↗</Link></section>
      </main>
    </div>
  )
}

export default Vaccinations
