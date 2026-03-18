import { useState, useEffect } from 'react'
import { LIFTS, WORKOUT_TYPES, saveSet } from '../lib/supabase'

const today = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

export default function EntryScreen({ onSetLogged, todaysSets }) {
  const [workout, setWorkout] = useState('')
  const [lift, setLift] = useState('')
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // When workout changes, default lift to first in list (preserve if same category)
  useEffect(() => {
    if (workout) {
      const lifts = LIFTS[workout] || []
      // Only reset lift if current lift isn't in new category
      if (!lifts.includes(lift)) setLift(lifts[0] || '')
    }
  }, [workout])

  const canSubmit = workout && lift && weight && reps && !saving

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSaving(true)
    setError(null)
    try {
      const saved = await saveSet({ workout_type: workout, lift, weight_lbs: weight, reps })
      onSetLogged(saved)
      // Keep all field values — user just changes what's different
    } catch (err) {
      console.error(err)
      setError('Failed to save. Check your Supabase connection.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="header">
        <div className="logo">Iron<span>Log</span></div>
        <div className="date-badge">{today()}</div>
      </div>

      <div className="content">
        {/* Workout selector */}
        <div className="field">
          <label>Workout</label>
          <div className="select-wrap">
            <select value={workout} onChange={e => setWorkout(e.target.value)}>
              <option value="">Select workout...</option>
              {WORKOUT_TYPES.map(w => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Lift selector */}
        <div className="field">
          <label>Lift</label>
          <div className="select-wrap">
            <select
              value={lift}
              onChange={e => setLift(e.target.value)}
              disabled={!workout}
            >
              {!workout && <option value="">Select workout first...</option>}
              {(LIFTS[workout] || []).map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Weight + Reps */}
        <div className="num-row">
          <div className="field">
            <label>Weight (lbs)</label>
            <input
              type="number"
              inputMode="decimal"
              placeholder="135"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              min="0"
              step="5"
            />
          </div>
          <div className="field">
            <label>Reps</label>
            <input
              type="number"
              inputMode="numeric"
              placeholder="10"
              value={reps}
              onChange={e => setReps(e.target.value)}
              min="1"
              step="1"
            />
          </div>
        </div>

        {error && (
          <div style={{ color: '#E24B4A', fontSize: 13, marginTop: -8 }}>{error}</div>
        )}

        <button className="btn btn-primary" onClick={handleSubmit} disabled={!canSubmit}>
          {saving ? 'Saving...' : 'Log Set →'}
        </button>

        {/* Today's sets */}
        {todaysSets.length > 0 && (
          <div className="sets-log">
            <div className="sets-log-title">Today's sets</div>
            {todaysSets.map(s => (
              <div className="set-row" key={s.id}>
                <div>
                  <span className={`badge badge-${s.workout_type}`}>{s.workout_type}</span>
                  <div className="set-lift">{s.lift}</div>
                  <div className="set-detail">{s.weight_lbs} lbs × {s.reps} reps</div>
                </div>
                <div className="set-time">
                  {new Date(s.logged_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

