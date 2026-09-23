import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Pages.css'

function Vaccinations() {
  const [vaccinations, setVaccinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchVaccinations = async () => {
      try {
        const response = await axios.get('/api/vaccinations')
        setVaccinations(response.data)
      } catch (err) {
        setError('Failed to load vaccinations')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVaccinations()
  }, [])

  if (loading) return <div className="loading">Loading vaccinations...</div>
  if (error) return <div className="error">{error}</div>

  const getStatusBadge = (status) => {
    const badgeClass = {
      'Completed': 'badge-success',
      'Upcoming': 'badge-info',
      'Overdue': 'badge-danger'
    }[status] || 'badge-info'

    return <span className={`badge ${badgeClass}`}>{status}</span>
  }

  return (
    <div>
      <div className="page-header">
        <h1>💉 Vaccinations</h1>
        <p>Track your pet's vaccination records</p>
      </div>

      <div className="container">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Pet ID</th>
                <th>Vaccine Name</th>
                <th>Vaccination Date</th>
                <th>Next Due</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vaccinations.map(vac => (
                <tr key={vac.id}>
                  <td>Pet #{vac.petId}</td>
                  <td>{vac.vaccine}</td>
                  <td>{new Date(vac.date).toLocaleDateString()}</td>
                  <td>{new Date(vac.nextDue).toLocaleDateString()}</td>
                  <td>{getStatusBadge(vac.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>📌 Vaccination Tips</h2>
          <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
            <li>Keep vaccination records in a safe place</li>
            <li>Set reminders for upcoming vaccinations</li>
            <li>Follow your veterinarian's recommended schedule</li>
            <li>Report any adverse reactions to your vet</li>
            <li>Ensure all family pets are up-to-date on vaccinations</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Vaccinations
