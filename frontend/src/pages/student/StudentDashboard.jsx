import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

function StatCard({ title, value, color, icon }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border-l-4 ${color} p-6 flex items-center gap-4`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [records, setRecords] = useState([])
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/borrow/my'),
      api.get('/notifications/unread-count'),
    ]).then(([borrowRes, notifRes]) => {
      setRecords(borrowRes.data)
      setUnread(notifRes.data.count)
    }).finally(() => setLoading(false))
  }, [])

  const active = records.filter((r) => r.status === 'BORROWED' || r.status === 'OVERDUE')
  const overdue = records.filter((r) => r.status === 'OVERDUE')
  const today = new Date()
  const dueSoon = active.filter((r) => {
    const due = new Date(r.dueDate)
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    return diff >= 0 && diff <= 3
  })

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, {user?.name}!</h1>
        <p className="text-slate-500 text-sm mt-1">{user?.department} &mdash; {user?.studentId}</p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard title="Books Borrowed" value={active.length} color="border-blue-500" icon="📚" />
            <StatCard title="Overdue" value={overdue.length} color="border-red-500" icon="⏰" />
            <StatCard title="Due in 3 Days" value={dueSoon.length} color="border-yellow-500" icon="📅" />
            <StatCard title="Unread Alerts" value={unread} color="border-teal-500" icon="🔔" />
          </div>

          {/* Active borrows table */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Currently Borrowed Books</h2>
              <Link to="/student/browse" className="text-sm text-blue-600 hover:underline">Browse more →</Link>
            </div>
            {active.length === 0 ? (
              <p className="text-slate-400 text-sm py-4 text-center">No active borrows. Visit the library to borrow books.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wide">
                      <th className="pb-3 pr-4">Book Title</th>
                      <th className="pb-3 pr-4">Author</th>
                      <th className="pb-3 pr-4">Borrow Date</th>
                      <th className="pb-3 pr-4">Due Date</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {active.map((r) => (
                      <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="py-3 pr-4 font-medium text-slate-800">{r.bookTitle}</td>
                        <td className="py-3 pr-4 text-slate-600">{r.bookAuthor}</td>
                        <td className="py-3 pr-4 text-slate-600">{r.borrowDate}</td>
                        <td className="py-3 pr-4 text-slate-600">{r.dueDate}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            r.status === 'OVERDUE'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  )
}
