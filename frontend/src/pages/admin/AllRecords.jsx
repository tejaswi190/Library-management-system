import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const STATUS_COLORS = {
  BORROWED: 'bg-blue-100 text-blue-700',
  RETURNED: 'bg-green-100 text-green-700',
  OVERDUE: 'bg-red-100 text-red-700',
}

export default function AllRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/borrow/all')
      .then((res) => setRecords(res.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = records
    .filter((r) => filter === 'ALL' || r.status === filter)
    .filter((r) =>
      search === '' ||
      r.userName?.toLowerCase().includes(search.toLowerCase()) ||
      r.bookTitle?.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId?.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">All Borrow Records</h1>
        <p className="text-slate-500 text-sm mt-1">{records.length} total transactions</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by student name, ID or book title..."
          className="flex-1 min-w-[220px] px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-2">
          {['ALL', 'BORROWED', 'OVERDUE', 'RETURNED'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                filter === s ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-slate-400 text-center py-12">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-xs text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Student ID</th>
                  <th className="px-4 py-3">Book Title</th>
                  <th className="px-4 py-3">Borrow Date</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Return Date</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-right">Fine</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-12 text-slate-400">No records found.</td></tr>
                ) : filtered.map((r) => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-400 text-xs">{r.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{r.userName}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{r.studentId || '—'}</td>
                    <td className="px-4 py-3 text-slate-700 max-w-[180px] truncate">{r.bookTitle}</td>
                    <td className="px-4 py-3 text-slate-600">{r.borrowDate}</td>
                    <td className="px-4 py-3 text-slate-600">{r.dueDate}</td>
                    <td className="px-4 py-3 text-slate-600">{r.returnDate || '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {parseFloat(r.fineAmount) > 0
                        ? <span className="text-red-600">₹{r.fineAmount}</span>
                        : <span className="text-slate-300">—</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
              Showing {filtered.length} of {records.length} records
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}
