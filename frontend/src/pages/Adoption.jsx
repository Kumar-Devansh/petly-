import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Pages.css'

function Adoption() {
  const [adoptions, setAdoptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        const response = await axios.get('/api/adoptions')
        setAdoptions(response.data)
      } catch (err) {
        setError('Failed to load adoption pets')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAdoptions()
  }, [])

  if (loading) return <div className="loading">Loading adoptable pets...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div>
      <div className="page-header">
        <h1>🏠 Pet Adoption</h1>
        <p>Find your perfect pet companion</p>
      </div>

      <div className="container">
        <div className="card" style={{ marginBottom: '30px', backgroundColor: '#f0f8ff', borderLeft: '4px solid #2196F3' }}>
          <h3>💝 Make a Difference</h3>
          <p>
            Adopting a pet from our partner NGOs not only gives them a loving home but also helps us 
            continue our mission to rescue and care for abandoned animals. Every adoption saves a life!
          </p>
        </div>

        <div className="grid">
          {adoptions.map(pet => (
            <div key={pet.id} className="item-card">
              <img
                src={pet.image}
                alt={`${pet.name}, ${pet.breed}`}
                onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=85' }}
              />
              <h3>{pet.name}</h3>
              <div className="item-details" style={{ marginBottom: '15px' }}>
                <div className="detail-row">
                  <span className="detail-label">Type:</span>
                  <span className="detail-value">{pet.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Breed:</span>
                  <span className="detail-value">{pet.breed}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Age:</span>
                  <span className="detail-value">{pet.age}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">NGO:</span>
                  <span className="detail-value" style={{ fontSize: '0.9em' }}>{pet.ngo}</span>
                </div>
              </div>
              <p style={{ color: '#666', fontSize: '0.9em', marginBottom: '15px', fontStyle: 'italic' }}>
                "{pet.description}"
              </p>
              <button className="btn-primary" style={{ width: '100%' }}>
                Adopt Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Adoption
