import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function OverdueBooks() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [returningId, setReturningId] = useState(null)

  const fetchOverdue = () => {
    setLoading(true)
    api.get('/borrow/overdue')
      .then((res) => setRecords(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchOverdue() }, [])

  const handleReturn = async (id) => {
    setReturningId(id)
    try {
      const res = await api.put(`/borrow/${id}/return`)
      toast.success(`Returned. Fine: ₹${res.data.fineAmount}`)
      fetchOverdue()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to return')
    } finally {
      setReturningId(null)
    }
  }

  const totalFine = records.reduce((sum, r) => sum + parseFloat(r.fineAmount || 0), 0)

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Overdue Books</h1>
          <p className="text-slate-500 text-sm mt-1">
            {records.length} overdue &mdash; Total fine accrued: <span className="font-semibold text-red-600">₹{totalFine.toFixed(2)}</span>
          </p>
        </div>
        <button
          onClick={fetchOverdue}
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400 text-center py-12">Loading...</p>
      ) : records.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
          <div className="text-5xl mb-3">✅</div>
          <p className="text-slate-600 font-medium">No overdue books!</p>
          <p className="text-slate-400 text-sm mt-1">All borrowed books are within their due dates.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((r) => {
            const today = new Date()
            const due = new Date(r.dueDate)
            const overdueDays = Math.floor((today - due) / (1000 * 60 * 60 * 24))
            return (
              <div key={r.id} className="bg-white rounded-xl shadow-sm border border-red-100 p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">{r.bookTitle}</h3>
                    <p className="text-sm text-slate-500">{r.bookAuthor}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                      {overdueDays} day{overdueDays !== 1 ? 's' : ''} overdue
                    </span>
                    <button
                      onClick={() => handleReturn(r.id)}
                      disabled={returningId === r.id}
                      className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:bg-green-400 font-medium transition"
                    >
                      {returningId === r.id ? 'Returning...' : 'Return Now'}
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Student</p>
                    <p className="text-slate-700 font-medium">{r.userName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Student ID</p>
                    <p className="text-slate-700">{r.studentId || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Due Date</p>
                    <p className="text-red-600 font-medium">{r.dueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Fine (₹5/day)</p>
                    <p className="text-red-600 font-bold text-lg">₹{r.fineAmount}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Layout>
  )
}
