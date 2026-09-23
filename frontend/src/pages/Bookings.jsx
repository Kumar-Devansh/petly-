import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Pages.css'

function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings')
        setBookings(response.data)
      } catch (err) {
        setError('Failed to load bookings')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) return <div className="loading">Loading bookings...</div>
  if (error) return <div className="error">{error}</div>

  const getStatusBadge = (status) => {
    const badgeClass = {
      'Confirmed': 'badge-success',
      'Pending': 'badge-info',
      'Cancelled': 'badge-danger'
    }[status] || 'badge-info'

    return <span className={`badge ${badgeClass}`}>{status}</span>
  }

  return (
    <div>
      <div className="page-header">
        <h1>📅 Service Bookings</h1>
        <p>Manage your pet care appointments</p>
      </div>

      <div className="container">
        <button className="btn-primary">+ New Booking</button>

        <div className="grid" style={{ marginTop: '30px' }}>
          {bookings.map(booking => (
            <div key={booking.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3>{booking.service}</h3>
                  <p style={{ color: '#666', marginTop: '5px' }}>Pet #{booking.petId}</p>
                </div>
                {getStatusBadge(booking.status)}
              </div>
              <div className="item-details" style={{ marginTop: '15px' }}>
                <div className="detail-row">
                  <span className="detail-label">Provider:</span>
                  <span className="detail-value">{booking.provider}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Date:</span>
                  <span className="detail-value">{new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time:</span>
                  <span className="detail-value">{booking.time}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                    ${booking.price}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button className="btn-secondary">Reschedule</button>
                <button className="btn-danger">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Bookings
