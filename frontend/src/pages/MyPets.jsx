import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Pages.css'

function MyPets() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', type: '', breed: '', age: '' })

  useEffect(() => {
    fetchPets()
  }, [])

  const fetchPets = async () => {
    try {
      const response = await axios.get('/api/pets')
      setPets(response.data)
    } catch (err) {
      setError('Failed to load pets')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPet = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/pets', formData)
      setFormData({ name: '', type: '', breed: '', age: '' })
      setShowForm(false)
      fetchPets()
    } catch (err) {
      setError('Failed to add pet')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) return <div className="loading">Loading pets...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div>
      <div className="page-header">
        <h1>🐾 My Pets</h1>
        <p>Manage your beloved pets</p>
      </div>

      <div className="container">
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Pet'}
        </button>

        {showForm && (
          <div className="card" style={{ marginTop: '20px' }}>
            <h2>Add New Pet</h2>
            <form onSubmit={handleAddPet}>
              <div className="form-group">
                <label>Pet Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Buddy"
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option>Select Type</option>
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Bird</option>
                  <option>Rabbit</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Breed</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  placeholder="e.g., Golden Retriever"
                  required
                />
              </div>
              <div className="form-group">
                <label>Age (years)</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g., 3"
                  required
                />
              </div>
              <button type="submit" className="btn-primary">Add Pet</button>
            </form>
          </div>
        )}

        <div className="grid" style={{ marginTop: '30px' }}>
          {pets.map(pet => (
            <div key={pet.id} className="item-card">
              <img
                src={pet.image}
                alt={`${pet.name}, ${pet.breed}`}
                onError={(event) => { event.currentTarget.src = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=85' }}
              />
              <h3>{pet.name}</h3>
              <div className="item-details">
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
                  <span className="detail-value">{pet.age} years</span>
                </div>
              </div>
              <button className="btn-secondary" style={{ marginTop: '10px', width: '100%' }}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyPets
