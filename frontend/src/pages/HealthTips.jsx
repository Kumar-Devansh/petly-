import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Pages.css'

function HealthTips() {
  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTips = async () => {
      try {
        const response = await axios.get('/api/health-tips')
        setTips(response.data)
      } catch (err) {
        setError('Failed to load health tips')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTips()
  }, [])

  if (loading) return <div className="loading">Loading health tips...</div>
  if (error) return <div className="error">{error}</div>

  const categories = [...new Set(tips.map(t => t.category))]

  return (
    <div>
      <div className="page-header">
        <h1>💚 Pet Health Tips</h1>
        <p>Valuable information for your pet's well-being</p>
      </div>

      <div className="container">
        {categories.map(category => (
          <div key={category} style={{ marginBottom: '40px' }}>
            <h2 style={{ color: '#667eea', marginBottom: '20px', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>
              📚 {category}
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {tips
                .filter(tip => tip.category === category)
                .map(tip => (
                  <div key={tip.id} className="card">
                    <h3>{tip.title}</h3>
                    <p style={{ color: '#666', lineHeight: '1.6', marginTop: '10px' }}>
                      {tip.content}
                    </p>
                    <div style={{ marginTop: '15px' }}>
                      <span className="badge badge-info">{tip.category}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <div className="card" style={{ marginTop: '40px', backgroundColor: '#fff9c4', borderLeft: '4px solid #ff9800' }}>
          <h3>⚠️ Important Note</h3>
          <p>
            These health tips are for informational purposes only. For any specific health concerns about your pet,
            please consult with a qualified veterinarian. Regular checkups are essential for your pet's long-term health.
          </p>
        </div>
      </div>
    </div>
  )
}

export default HealthTips
