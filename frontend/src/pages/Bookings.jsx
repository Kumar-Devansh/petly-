import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Pages.css'

const services = [
  { name: 'Wellness check', price: 899, icon: '✚' },
  { name: 'Grooming session', price: 699, icon: '✿' },
  { name: 'Vaccination visit', price: 599, icon: '♡' },
  { name: 'Day care', price: 499, icon: '☼' }
]
const statusTabs = ['All visits', 'Confirmed', 'Pending', 'Cancelled']
const bookingPhoto = 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80'
const displayDate = (value) => {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? 'Date to be confirmed' : new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(date)
}
const toInputTime = (value = '') => {
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
  if (!match) return value
  let hour = Number(match[1])
  if (match[3]?.toUpperCase() === 'PM' && hour < 12) hour += 12
  if (match[3]?.toUpperCase() === 'AM' && hour === 12) hour = 0
  return `${String(hour).padStart(2, '0')}:${match[2]}`
}
const canonicalService = (name) => ({
  Grooming: 'Grooming session',
  'Veterinary Checkup': 'Wellness check',
  Vaccination: 'Vaccination visit'
}[name] || name)

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('All visits')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ petId: '', service: services[0].name, date: '', time: '' })

  const fetchData = async () => {
    try {
      const [bookingResponse, petResponse] = await Promise.all([axios.get('/api/bookings'), axios.get('/api/pets')])
      setBookings(bookingResponse.data)
      setPets(petResponse.data)
      setError('')
    } catch {
      setError('Your visit planner couldn’t load. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchData() }, [])

  const filteredBookings = useMemo(() => activeTab === 'All visits'
    ? bookings
    : bookings.filter((booking) => booking.status === activeTab), [activeTab, bookings])
  const selectedService = services.find((service) => service.name === formData.service) || services[0]

  const openNewBooking = () => {
    setEditingId(null)
    setFormData({ petId: pets[0] ? String(pets[0].id) : '', service: services[0].name, date: '', time: '' })
    setShowForm(true)
  }

  const openReschedule = (booking) => {
    setEditingId(booking.id)
    setFormData({ petId: String(booking.petId), service: canonicalService(booking.service), date: booking.date, time: toInputTime(booking.time) })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    const bookingData = {
      petId: Number(formData.petId),
      service: formData.service,
      provider: 'Petly Care Network',
      date: formData.date,
      time: formData.time,
      price: selectedService.price,
      status: 'Pending'
    }
    try {
      if (editingId) {
        const { data } = await axios.put(`/api/bookings/${editingId}`, bookingData)
        setBookings((current) => current.map((booking) => booking.id === editingId ? data : booking))
      } else {
        const { data } = await axios.post('/api/bookings', bookingData)
        setBookings((current) => [data, ...current])
      }
      setShowForm(false)
      setEditingId(null)
    } catch {
      setError('We couldn’t save this visit. Please check the details and try again.')
    } finally {
      setSaving(false)
    }
  }

  const cancelBooking = async (booking) => {
    if (!window.confirm(`Cancel ${booking.service.toLowerCase()} for ${pets.find((pet) => pet.id === booking.petId)?.name || 'your pet'}?`)) return
    try {
      const { data } = await axios.put(`/api/bookings/${booking.id}`, { status: 'Cancelled' })
      setBookings((current) => current.map((item) => item.id === booking.id ? data : item))
    } catch {
      setError('That visit couldn’t be cancelled. Please try again.')
    }
  }

  return (
    <div className="petly-page bookings-page">
      <header className="showcase-hero booking-hero">
        <div className="showcase-hero-content">
          <span className="showcase-eyebrow">GOOD CARE, ON THE CALENDAR</span>
          <h1>Make room for<br /><em>their good days.</em></h1>
          <p>Keep vet visits, grooming, and all the little plans in one calm place.</p>
          <button type="button" className="showcase-button" onClick={openNewBooking}>＋ Plan a visit</button>
        </div>
        <div className="showcase-hero-caption"><span>03 / 04</span><span>A little planning, lots of tail wags</span></div>
      </header>

      <main className="page-shell">
        {error && <div className="page-alert" role="alert">{error}</div>}
        {showForm && <section className="page-form-panel booking-form-panel" aria-labelledby="booking-form-title">
          <div className="page-panel-heading"><div><span className="page-eyebrow">{editingId ? 'UPDATE YOUR PLANS' : 'A LITTLE TIME FOR CARE'}</span><h2 id="booking-form-title">{editingId ? 'Reschedule a visit' : 'Plan a visit'}</h2></div><button type="button" className="page-modal-close inline-close" onClick={() => setShowForm(false)} aria-label="Close form">×</button></div>
          {pets.length ? <form className="page-form-grid" onSubmit={handleSave}>
            <label>Who’s going?<select required value={formData.petId} onChange={(event) => setFormData({ ...formData, petId: event.target.value })}>{pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.name}</option>)}</select></label>
            <label>What do they need?<select value={formData.service} onChange={(event) => setFormData({ ...formData, service: event.target.value })}>{services.map((service) => <option key={service.name} value={service.name}>{service.name}</option>)}</select></label>
            <label>Pick a day<input type="date" required value={formData.date} onChange={(event) => setFormData({ ...formData, date: event.target.value })} /></label>
            <label>Pick a time<input type="time" required value={formData.time} onChange={(event) => setFormData({ ...formData, time: event.target.value })} /></label>
            <div className="booking-form-summary"><span>{selectedService.icon}</span><div><strong>{selectedService.name}</strong><small>Estimated service price · ₹{selectedService.price.toLocaleString('en-IN')}</small></div><button className="showcase-button" type="submit" disabled={saving}>{saving ? 'Saving…' : editingId ? 'Save changes' : 'Request visit'}</button></div>
          </form> : <div className="booking-no-pets"><p>Add a pet profile before planning their first visit.</p><Link to="/pets" className="page-inline-link">Create a profile ↗</Link></div>}
        </section>}

        <div className="page-intro-row"><div><span className="page-eyebrow">YOUR CARE CALENDAR</span><h2>Visits & little plans</h2></div><p>Plans can change. Keeping them together makes the next step easier.</p></div>
        <div className="booking-filter-row" role="tablist" aria-label="Filter bookings">{statusTabs.map((tab) => <button type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'active' : ''} key={tab} onClick={() => setActiveTab(tab)}>{tab}{tab === 'All visits' && <span>{bookings.length}</span>}</button>)}</div>

        {loading ? <div className="page-loading">Checking the calendar…</div> : filteredBookings.length ? <div className="booking-list">{filteredBookings.map((booking) => {
          const pet = pets.find((entry) => entry.id === booking.petId)
          const service = services.find((entry) => entry.name === booking.service) || services[0]
          return <article className="booking-card" key={booking.id}>
            <div className="booking-card-photo"><img src={pet?.image || bookingPhoto} alt={pet?.name || 'Pet'} loading="lazy" onError={(event) => { event.currentTarget.src = bookingPhoto }} /><span>{service.icon}</span></div>
            <div className="booking-card-info"><div className="booking-title-row"><div><span className="page-eyebrow">{pet?.name || `PET #${booking.petId}`}</span><h3>{booking.service}</h3></div><span className={`booking-status ${booking.status.toLowerCase()}`}>{booking.status}</span></div>
              <div className="booking-card-meta"><span>◷ {displayDate(booking.date)} · {booking.time}</span><span>⌂ {booking.provider}</span><strong>₹{Number(booking.price).toLocaleString('en-IN')}</strong></div>
              {booking.status !== 'Cancelled' && <div className="booking-card-actions"><button type="button" className="booking-reschedule" onClick={() => openReschedule(booking)}>Change visit ↗</button><button type="button" className="booking-cancel" onClick={() => cancelBooking(booking)}>Cancel visit</button></div>}
            </div>
          </article>
        })}</div> : <section className="page-empty-state compact"><span>☼</span><h3>No visits in this view</h3><p>When there’s something on the calendar, you’ll find it here.</p><button type="button" className="showcase-button" onClick={openNewBooking}>Plan a visit</button></section>}

        <section className="service-ideas"><div className="page-intro-row"><div><span className="page-eyebrow">A FEW THOUGHTFUL OPTIONS</span><h2>What can we help with?</h2></div><Link to="/health-tips" className="page-inline-link">Browse care notes ↗</Link></div><div className="service-idea-grid">{services.map((service) => <button key={service.name} type="button" className="service-idea-card" onClick={() => { openNewBooking(); setFormData((current) => ({ ...current, service: service.name })) }}><span>{service.icon}</span><strong>{service.name}</strong><small>From ₹{service.price.toLocaleString('en-IN')}</small></button>)}</div></section>
      </main>
    </div>
  )
}

export default Bookings
