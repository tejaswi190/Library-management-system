import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const STATUS_COLORS = {
  BORROWED: 'bg-blue-100 text-blue-700',
  RETURNED: 'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
}

export default function MyBooks() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    api.get('/borrow/my')
      .then((res) => setRecords(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'ALL' ? records : records.filter((r) => r.status === filter)

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Books</h1>
        <p className="text-slate-500 text-sm mt-1">Your borrowing history and active loans</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {['ALL', 'BORROWED', 'OVERDUE', 'RETURNED'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              filter === s
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
            }`}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-400 text-center py-12">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-slate-400 text-center py-12">No records found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold text-slate-800">{r.bookTitle}</h3>
                  <p className="text-sm text-slate-500">{r.bookAuthor}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status]}`}>
                  {r.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Borrow Date</p>
                  <p className="text-slate-700 font-medium">{r.borrowDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Due Date</p>
                  <p className="text-slate-700 font-medium">{r.dueDate}</p>
                </div>
                {r.returnDate && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Returned On</p>
                    <p className="text-slate-700 font-medium">{r.returnDate}</p>
                  </div>
                )}
                {parseFloat(r.fineAmount) > 0 && (
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">Fine</p>
                    <p className="text-red-600 font-bold">₹{r.fineAmount}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
