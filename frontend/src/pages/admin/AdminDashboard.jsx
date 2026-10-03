import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'
import { Link } from 'react-router-dom'

function StatCard({ title, value, sub, color, icon, to }) {
  const Wrapper = to ? Link : 'div'
  return (
    <Wrapper
      to={to}
      className={`bg-white rounded-xl shadow-sm border-t-4 ${color} p-6 flex flex-col gap-1 hover:shadow-md transition`}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-bold text-slate-800">{value ?? '—'}</span>
      </div>
      <p className="text-sm font-semibold text-slate-700 mt-2">{title}</p>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </Wrapper>
  )
}

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/reports/summary')
      .then((res) => setSummary(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Library overview at a glance</p>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading statistics...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          <StatCard
            title="Total Books"
            value={summary?.totalBooks}
            icon="📚"
            color="border-blue-500"
            to="/admin/books"
          />
          <StatCard
            title="Registered Students"
            value={summary?.totalStudents}
            icon="🎓"
            color="border-teal-500"
          />
          <StatCard
            title="Active Borrows"
            value={summary?.activeBorrows}
            icon="📖"
            color="border-indigo-500"
            to="/admin/records"
          />
          <StatCard
            title="Overdue Books"
            value={summary?.overdueCount}
            icon="⚠️"
            color="border-red-500"
            to="/admin/overdue"
            sub={summary?.overdueCount > 0 ? 'Action needed' : 'None'}
          />
          <StatCard
            title="Total Fines"
            value={`₹${summary?.totalFinesCollected ?? 0}`}
            icon="💰"
            color="border-yellow-500"
          />
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/admin/issue-return"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 transition text-sm font-medium text-center">
            <span className="text-2xl">📤</span>Issue Book
          </Link>
          <Link to="/admin/issue-return"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 transition text-sm font-medium text-center">
            <span className="text-2xl">📥</span>Return Book
          </Link>
          <Link to="/admin/books"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 transition text-sm font-medium text-center">
            <span className="text-2xl">➕</span>Add Book
          </Link>
          <Link to="/admin/overdue"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 transition text-sm font-medium text-center">
            <span className="text-2xl">🔎</span>View Overdue
          </Link>
        </div>
      </div>
    </Layout>
  )
}
