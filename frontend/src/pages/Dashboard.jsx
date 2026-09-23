import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Pages.css'

const fallbackImage = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85'
const actions = [
  { to: '/pets', icon: '🐾', title: 'Your pets', detail: 'Profiles & care details', tone: 'peach' },
  { to: '/bookings', icon: '✦', title: 'Book a service', detail: 'Vet, grooming & more', tone: 'lavender' },
  { to: '/vaccinations', icon: '♡', title: 'Health records', detail: 'Vaccinations & wellness', tone: 'mint' },
  { to: '/ai-assistant', icon: '✳', title: 'Ask Petly', detail: 'Personal care guidance', tone: 'blue' },
  { to: '/products', icon: '✿', title: 'Pet essentials', detail: 'Shop thoughtful favorites', tone: 'peach' },
  { to: '/adoption', icon: '♥', title: 'Find a friend', detail: 'Meet pets looking for home', tone: 'lavender' },
  { to: '/health-tips', icon: '☼', title: 'Care journal', detail: 'Little ideas for a healthy life', tone: 'mint' },
]

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem('petly-daily-care') || '{}') } catch { return {} }
  })

  useEffect(() => {
    axios.get('/api/dashboard')
      .then(({ data }) => setStats(data))
      .catch(() => setError('Your dashboard data could not load. Please try again.'))
  }, [])

  const toggleTask = (id) => setChecked((current) => {
    const next = { ...current, [id]: !current[id] }
    localStorage.setItem('petly-daily-care', JSON.stringify(next))
    return next
  })
  const pets = stats?.pets || []
  const tasks = [
    { id: 'water', icon: '◉', title: 'Refresh the water bowls', detail: 'A little fresh water goes a long way' },
    { id: 'walk', icon: '↗', title: 'Make time for movement', detail: 'A walk, a play session, or a little exploring' },
    { id: 'checkin', icon: '♡', title: 'Do a quick wellness check', detail: 'Notice appetite, energy, and mood' },
  ]

  return (
    <div className="dashboard-page">
      <main className="dashboard-shell">
        <section className="dashboard-welcome">
          <div className="dashboard-welcome-copy">
            <span className="dashboard-eyebrow"><span /> YOUR PET CARE, AT A GLANCE</span>
            <h1>Good care starts<br />with <em>being here.</em></h1>
            <p>Everything your pets need, thoughtfully brought together in one place.</p>
            <Link to="/pets" className="dashboard-primary-link">Meet your pets <span>↗</span></Link>
          </div>
          <div className="dashboard-welcome-art" aria-label="A happy golden retriever">
            <img src={pets[0]?.image || fallbackImage} alt={pets[0]?.name || 'Happy golden retriever'} />
            <div className="dashboard-art-note"><span>✦</span><div><strong>A good day to be a pet</strong><small>And a good day to care for one</small></div></div>
            <span className="dashboard-art-orbit" aria-hidden="true">✳</span>
          </div>
          <div className="dashboard-welcome-index">01 <span /> PETLY JOURNAL</div>
        </section>

        {error && <div className="dashboard-notice" role="alert">{error}</div>}

        <section className="dashboard-overview" aria-label="Pet care overview">
          <div className="dashboard-section-heading">
            <div><span className="dashboard-kicker">A LITTLE OVERVIEW</span><h2>Your household</h2></div>
            <span className="dashboard-updated">A calmer way to stay on top of care</span>
          </div>
          <div className="dashboard-stat-grid">
            <Link to="/pets" className="dashboard-stat"><span className="dashboard-stat-icon peach">🐾</span><span className="dashboard-stat-copy"><small>IN YOUR CARE</small><strong>{stats?.totalPets ?? '—'} <i>pets</i></strong></span><span className="dashboard-stat-arrow">↗</span></Link>
            <Link to="/bookings" className="dashboard-stat"><span className="dashboard-stat-icon lavender">✦</span><span className="dashboard-stat-copy"><small>TO LOOK FORWARD TO</small><strong>{stats?.upcomingBookings ?? '—'} <i>bookings</i></strong></span><span className="dashboard-stat-arrow">↗</span></Link>
            <Link to="/vaccinations" className="dashboard-stat"><span className="dashboard-stat-icon mint">♡</span><span className="dashboard-stat-copy"><small>NEEDS A CHECK-IN</small><strong>{stats?.overdueVaccinations ?? '—'} <i>vaccines</i></strong></span><span className="dashboard-stat-arrow">↗</span></Link>
          </div>
        </section>

        <section className="dashboard-main-grid">
          <div className="dashboard-panel dashboard-today">
            <div className="dashboard-panel-heading"><div><span className="dashboard-kicker">THE EVERYDAY THINGS</span><h2>Today, with care</h2></div><span className="dashboard-date">{new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date())}</span></div>
            <div className="dashboard-task-list">
              {tasks.map((task) => <button type="button" key={task.id} onClick={() => toggleTask(task.id)} className={`dashboard-task ${checked[task.id] ? 'is-done' : ''}`} aria-pressed={Boolean(checked[task.id])}>
                <span className="dashboard-task-check">{checked[task.id] ? '✓' : task.icon}</span><span className="dashboard-task-copy"><strong>{task.title}</strong><small>{task.detail}</small></span><span className="dashboard-task-mark">{checked[task.id] ? 'Done' : 'Mark done'}</span>
              </button>)}
            </div>
            <div className="dashboard-today-footer"><span>Small routines make a lovely difference.</span><span aria-hidden="true">✿</span></div>
          </div>

          <div className="dashboard-panel dashboard-pack">
            <div className="dashboard-panel-heading"><div><span className="dashboard-kicker">THE ONES YOU LOVE</span><h2>Your little pack</h2></div><Link to="/pets" className="dashboard-text-link">See all ↗</Link></div>
            {pets.length ? <div className="dashboard-pet-list">{pets.slice(0, 3).map((pet) => <Link to="/pets" className="dashboard-pet-row" key={pet.id}><img src={pet.image || fallbackImage} alt={pet.name} /><span><strong>{pet.name}</strong><small>{[pet.breed, pet.age ? `${pet.age} years old` : pet.type].filter(Boolean).join(' · ')}</small></span><span className="dashboard-pet-arrow">↗</span></Link>)}</div> : <div className="dashboard-empty-pack"><span>🐶</span><strong>Your pet profiles are waiting</strong><p>Add a profile to keep their care details close at hand.</p><Link to="/pets">Add a pet ↗</Link></div>}
          </div>
        </section>

        <section className="dashboard-bottom-grid">
          <div className="dashboard-section-heading dashboard-actions-heading"><div><span className="dashboard-kicker">A FEW HELPFUL SHORTCUTS</span><h2>Care, made a little easier</h2></div></div>
          <div className="dashboard-action-grid">{actions.map((action) => <Link to={action.to} key={action.to} className="dashboard-action-card"><span className={`dashboard-action-icon ${action.tone}`}>{action.icon}</span><span><strong>{action.title}</strong><small>{action.detail}</small></span><span className="dashboard-action-arrow">↗</span></Link>)}</div>
          <div className="dashboard-activity dashboard-panel"><div className="dashboard-panel-heading"><div><span className="dashboard-kicker">LITTLE UPDATES</span><h2>Recent activity</h2></div><span className="dashboard-activity-mark">✳</span></div>{stats?.recentActivity?.length ? <ul>{stats.recentActivity.map((item, index) => <li key={`${item}-${index}`}><span className="dashboard-activity-dot" /><span>{item}</span></li>)}</ul> : <p className="dashboard-muted">Your latest care updates will show up here.</p>}</div>
        </section>
        <footer className="dashboard-footer"><span>Made with care, for the ones who make a house a home.</span><span>Petly <b>✳</b></span></footer>
      </main>
    </div>
  )
}

export default Dashboard
