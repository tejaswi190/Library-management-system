import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function IssueReturn() {
  const [tab, setTab] = useState('issue')
  const [students, setStudents] = useState([])
  const [books, setBooks] = useState([])
  const [activeRecords, setActiveRecords] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedBook, setSelectedBook] = useState('')
  const [selectedRecord, setSelectedRecord] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/users/students').then((res) => setStudents(res.data))
    api.get('/books').then((res) => setBooks(res.data))
    api.get('/borrow/all').then((res) =>
      setActiveRecords(res.data.filter((r) => r.status === 'BORROWED' || r.status === 'OVERDUE'))
    )
  }, [])

  const handleIssue = async (e) => {
    e.preventDefault()
    if (!selectedStudent || !selectedBook) return toast.error('Select student and book')
    setSubmitting(true)
    try {
      await api.post('/borrow', { userId: parseInt(selectedStudent), bookId: parseInt(selectedBook) })
      toast.success('Book issued successfully')
      setSelectedStudent('')
      setSelectedBook('')
      // refresh
      api.get('/books').then((res) => setBooks(res.data))
      api.get('/borrow/all').then((res) =>
        setActiveRecords(res.data.filter((r) => r.status === 'BORROWED' || r.status === 'OVERDUE'))
      )
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to issue book')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReturn = async (e) => {
    e.preventDefault()
    if (!selectedRecord) return toast.error('Select a borrow record')
    setSubmitting(true)
    try {
      const res = await api.put(`/borrow/${selectedRecord}/return`)
      const fine = parseFloat(res.data.fineAmount)
      if (fine > 0) {
        toast.success(`Book returned. Fine: ₹${fine}`)
      } else {
        toast.success('Book returned successfully')
      }
      setSelectedRecord('')
      api.get('/books').then((r) => setBooks(r.data))
      api.get('/borrow/all').then((r) =>
        setActiveRecords(r.data.filter((rec) => rec.status === 'BORROWED' || rec.status === 'OVERDUE'))
      )
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to return book')
    } finally {
      setSubmitting(false)
    }
  }

  const availableBooks = books.filter((b) => b.availableCopies > 0)

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Issue / Return Books</h1>
        <p className="text-slate-500 text-sm mt-1">Manage book transactions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('issue')}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition ${
            tab === 'issue' ? 'bg-blue-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
          }`}
        >
          📤 Issue Book
        </button>
        <button
          onClick={() => setTab('return')}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition ${
            tab === 'return' ? 'bg-green-700 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-green-300'
          }`}
        >
          📥 Return Book
        </button>
      </div>

      <div className="max-w-lg">
        {tab === 'issue' ? (
          <form onSubmit={handleIssue} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-700">Issue a Book to a Student</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Student</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Student --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.studentId ? `(${s.studentId})` : ''} — {s.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Select Book <span className="text-slate-400 font-normal">({availableBooks.length} available)</span>
              </label>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Book --</option>
                {availableBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} by {b.author} ({b.availableCopies} left)
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 disabled:bg-blue-400 transition"
            >
              {submitting ? 'Issuing...' : 'Issue Book (14-day loan)'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReturn} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-700">Record a Book Return</h2>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Select Active Borrow <span className="text-slate-400 font-normal">({activeRecords.length} active)</span>
              </label>
              <select
                value={selectedRecord}
                onChange={(e) => setSelectedRecord(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">-- Select Record --</option>
                {activeRecords.map((r) => (
                  <option key={r.id} value={r.id}>
                    [{r.status}] {r.userName} — "{r.bookTitle}" (due: {r.dueDate})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 disabled:bg-green-400 transition"
            >
              {submitting ? 'Processing...' : 'Return Book'}
            </button>
            <p className="text-xs text-slate-400 text-center">Fine of ₹5/day will be calculated if overdue</p>
          </form>
        )}
      </div>
    </Layout>
  )
}
