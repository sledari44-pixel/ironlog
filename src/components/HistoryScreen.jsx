import { useState, useEffect } from 'react'
import { fetchAllSets } from '../lib/supabase'

function groupByDate(sets) {
  const groups = {}
  sets.forEach(s => {
    const date = new Date(s.logged_at).toLocaleDateString('en-US', {
      weekday: 'long', month: 'short', day: 'numeric'
    })
    if (!groups[date]) groups[date] = []
    groups[date].push(s)
  })
  return groups
}

export default function HistoryScreen() {
  const [sets, setSets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAllSets()
      .then(setSets)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const groups = groupByDate(sets)

  return (
    <>
      <div className="header">
        <div className="logo">Iron<span>Log</span></div>
        <div className="date-badge">{sets.length} sets total</div>
      </div>

      <div className="content">
        {loading && (
          <div className="empty-state">
            <div>Loading...</div>
          </div>
        )}

        {error && (
          <div style={{ color: '#E24B4A', fontSize: 14 }}>
            Could not load history: {error}
          </div>
        )}

        {!loading && sets.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <div>No sets logged yet. Hit the gym!</div>
          </div>
        )}

        {Object.entries(groups).map(([date, dateSets]) => (
          <div className="history-group" key={date}>
            <div className="history-date">{date}</div>
            <div className="history-card">
              {dateSets.map(s => (
                <div className="set-row" key={s.id}>
                  <div>
                    <span className={`badge badge-${s.workout_type}`}>{s.workout_type}</span>
                    <div className="set-lift">{s.lift}</div>
                    <div className="set-detail">{s.weight_lbs} lbs × {s.reps} reps</div>
                  </div>
                  <div className="set-time">
                    {new Date(s.logged_at).toLocaleTimeString('en-US', {
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
