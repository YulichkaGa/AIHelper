import { useEffect, useState, useRef } from 'react'
import { api } from '../api'

const MEAL_TYPES = ['ארוחת בוקר', 'ארוחת צהריים', 'ארוחת ערב', 'חטיף']

const EMPTY = { name: '', calories: '', protein: '', carbs: '', fat: '', meal_type: 'ארוחת צהריים' }

export default function NutritionPage() {
  const [meals, setMeals] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const fileRef = useRef()

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const data = await api.nutrition.getMeals()
      setMeals(data)
    } catch {}
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.nutrition.addMeal({
        ...form,
        calories: Number(form.calories),
        protein: Number(form.protein) || 0,
        carbs: Number(form.carbs) || 0,
        fat: Number(form.fat) || 0,
      })
      setForm(EMPTY)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAnalyze(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setAnalyzing(true)
    setError('')
    try {
      const reader = new FileReader()
      reader.onload = async () => {
        try {
          const base64 = reader.result.split(',')[1]
          const result = await api.nutrition.analyze(base64)
          setForm(f => ({
            ...f,
            name: result.name,
            calories: String(result.calories),
            protein: String(result.protein),
            carbs: String(result.carbs),
            fat: String(result.fat),
          }))
        } catch {
          setError('שגיאה בניתוח התמונה')
        } finally {
          setAnalyzing(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('שגיאה בניתוח התמונה')
      setAnalyzing(false)
    }
  }

  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + (m.calories || 0),
    protein: acc.protein + (m.protein || 0),
  }), { calories: 0, protein: 0 })

  return (
    <div className="page">
      <div className="page-header">
        <h2>🥗 תזונה</h2>
        <div className="totals-row">
          <span className="badge orange">🔥 {totals.calories} קק״ל</span>
          <span className="badge purple">🥩 {totals.protein}g חלבון</span>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <h3>הוסף ארוחה</h3>
          <button
            type="button"
            className="btn-secondary mb"
            onClick={() => fileRef.current?.click()}
            disabled={analyzing}
          >
            {analyzing ? '🔍 מנתח...' : '📷 נתח תמונה עם AI'}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAnalyze} style={{ display: 'none' }} />

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="field span2">
              <label>שם המאכל</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="עוף בגריל" />
            </div>
            <div className="field">
              <label>קלוריות</label>
              <input type="number" value={form.calories} onChange={e => setForm(f => ({ ...f, calories: e.target.value }))} required min="0" placeholder="350" />
            </div>
            <div className="field">
              <label>חלבון (גרם)</label>
              <input type="number" value={form.protein} onChange={e => setForm(f => ({ ...f, protein: e.target.value }))} min="0" placeholder="30" />
            </div>
            <div className="field">
              <label>פחמימות (גרם)</label>
              <input type="number" value={form.carbs} onChange={e => setForm(f => ({ ...f, carbs: e.target.value }))} min="0" placeholder="20" />
            </div>
            <div className="field">
              <label>שומן (גרם)</label>
              <input type="number" value={form.fat} onChange={e => setForm(f => ({ ...f, fat: e.target.value }))} min="0" placeholder="10" />
            </div>
            <div className="field span2">
              <label>סוג ארוחה</label>
              <select value={form.meal_type} onChange={e => setForm(f => ({ ...f, meal_type: e.target.value }))}>
                {MEAL_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            {error && <p className="form-error span2">{error}</p>}
            <button type="submit" className="btn-primary span2" disabled={loading}>
              {loading ? 'שומר...' : '+ הוסף ארוחה'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>ארוחות היום</h3>
          {meals.length === 0
            ? <p className="empty-state">לא נרשמו ארוחות היום</p>
            : (
              <div className="meal-list">
                {meals.map(m => (
                  <div key={m.id} className="meal-item">
                    <div className="meal-info">
                      <strong>{m.name}</strong>
                      <span className="meal-type-tag">{m.meal_type}</span>
                    </div>
                    <div className="meal-macros">
                      <span>🔥 {m.calories}</span>
                      <span>🥩 {m.protein}g</span>
                      <span>🌾 {m.carbs}g</span>
                      <span>🧈 {m.fat}g</span>
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