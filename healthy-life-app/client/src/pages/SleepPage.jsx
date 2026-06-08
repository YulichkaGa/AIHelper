import { useEffect, useState } from 'react'
import { api } from '../api'

const QUALITY = [1, 2, 3, 4, 5]
const QUALITY_LABELS = { 1: '😫', 2: '😪', 3: '😐', 4: '😊', 5: '😄' }
const EMPTY = { bedtime: '23:00', wake_time: '07:00', duration: 8, quality: 4, notes: '' }

function calcDuration(bed, wake) {
  const [bh, bm] = bed.split(':').map(Number)
  const [wh, wm] = wake.split(':').map(Number)
  let mins = (wh * 60 + wm) - (bh * 60 + bm)
  if (mins < 0) mins += 24 * 60
  return +(mins / 60).toFixed(1)
}

export default function SleepPage() {
  const [history, setHistory] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const data = await api.sleep.history()
      setHistory(data)
    } catch {}
  }

  function setTime(field, val) {
    setForm(f => {
      const next = { ...f, [field]: val }
      next.duration = calcDuration(
        field === 'bedtime' ? val : f.bedtime,
        field === 'wake_time' ? val : f.wake_time
      )
      return next
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.sleep.log(form)
      setForm(EMPTY)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const avg = history.length
    ? (history.reduce((s, h) => s + (h.duration || 0), 0) / history.length).toFixed(1)
    : 0

  return (
    <div className="page">
      <div className="page-header">
        <h2>😴 שינה</h2>
        <span className="badge indigo">ממוצע: {avg} שעות</span>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>רשום שינה</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="field">
              <label>שעת שינה</label>
              <input type="time" value={form.bedtime} onChange={e => setTime('bedtime', e.target.value)} />
            </div>
            <div className="field">
              <label>שעת קימה</label>
              <input type="time" value={form.wake_time} onChange={e => setTime('wake_time', e.target.value)} />
            </div>
            <div className="field span2">
              <label>משך שינה: <strong>{form.duration} שעות</strong></label>
              <input type="range" min="0" max="12" step="0.5" value={form.duration || 0}
                onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} />
            </div>
            <div className="field span2">
              <label>איכות שינה</label>
              <div className="quality-picker">
                {QUALITY.map(q => (
                  <button
                    key={q} type="button"
                    className={`quality-btn${form.quality === q ? ' selected' : ''}`}
                    onClick={() => setForm(f => ({ ...f, quality: q }))}
                  >
                    {QUALITY_LABELS[q]} {q}
                  </button>
                ))}
              </div>
            </div>
            <div className="field span2">
              <label>הערות</label>
              <input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="חלמתי על..." />
            </div>
            {error && <p className="form-error span2">{error}</p>}
            <button type="submit" className="btn-primary span2" disabled={loading}>
              {loading ? 'שומר...' : '💾 שמור שינה'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>היסטוריית שינה</h3>
          {history.length === 0
            ? <p className="empty-state">אין היסטוריית שינה</p>
            : (
              <div className="sleep-list">
                {history.map(h => (
                  <div key={h.id} className="sleep-item">
                    <div className="sleep-date">{new Date(h.sleep_date).toLocaleDateString('he-IL')}</div>
                    <div className="sleep-stats">
                      <span>{h.bedtime?.slice(0,5)} – {h.wake_time?.slice(0,5)}</span>
                      <span className="badge indigo">{h.duration} שעות</span>
                      <span>{QUALITY_LABELS[h.quality]}</span>
                    </div>
                  </div>
                ))}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}