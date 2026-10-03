import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  title: '', author: '', isbn: '', category: '',
  publisher: '', year: '', totalCopies: 1, description: '',
}

function BookModal({ book, onClose, onSaved }) {
  const [form, setForm] = useState(book ? {
    title: book.title, author: book.author, isbn: book.isbn || '',
    category: book.category || '', publisher: book.publisher || '',
    year: book.year || '', totalCopies: book.totalCopies, description: book.description || '',
  } : EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, year: form.year ? parseInt(form.year) : null, totalCopies: parseInt(form.totalCopies) }
      if (book) {
        await api.put(`/books/${book.id}`, payload)
        toast.success('Book updated')
      } else {
        await api.post('/books', payload)
        toast.success('Book added')
      }
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save book')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">{book ? 'Edit Book' : 'Add New Book'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[
            { name: 'title', label: 'Title *', required: true },
            { name: 'author', label: 'Author *', required: true },
            { name: 'isbn', label: 'ISBN' },
            { name: 'category', label: 'Category' },
            { name: 'publisher', label: 'Publisher' },
            { name: 'year', label: 'Year', type: 'number' },
            { name: 'totalCopies', label: 'Total Copies *', type: 'number', required: true, min: 1 },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
              <input
                name={field.name}
                type={field.type || 'text'}
                value={form[field.name]}
                onChange={handleChange}
                required={field.required}
                min={field.min}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:bg-blue-400 transition">
              {saving ? 'Saving...' : 'Save Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ManageBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null) // null | 'add' | { book }
  const [deleting, setDeleting] = useState(null)

  const fetchBooks = () => {
    setLoading(true)
    api.get('/books').then((res) => setBooks(res.data)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchBooks() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return
    setDeleting(id)
    try {
      await api.delete(`/books/${id}`)
      toast.success('Book deleted')
      fetchBooks()
    } catch {
      toast.error('Cannot delete book')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manage Books</h1>
          <p className="text-slate-500 text-sm mt-1">{books.length} books in catalogue</p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="px-5 py-2.5 bg-blue-700 text-white font-semibold text-sm rounded-lg hover:bg-blue-800 transition shadow-sm"
        >
          + Add Book
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or author..."
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-slate-400 text-center py-12">Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-xs text-slate-500 uppercase tracking-wide">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">ISBN</th>
                  <th className="px-4 py-3 text-center">Total</th>
                  <th className="px-4 py-3 text-center">Available</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-slate-400">No books found.</td></tr>
                ) : filtered.map((book) => (
                  <tr key={book.id} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800 max-w-[200px] truncate">{book.title}</td>
                    <td className="px-4 py-3 text-slate-600">{book.author}</td>
                    <td className="px-4 py-3">
                      {book.category && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">{book.category}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">{book.isbn || '—'}</td>
                    <td className="px-4 py-3 text-center text-slate-700">{book.totalCopies}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {book.availableCopies}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setModal(book)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book.id)}
                          disabled={deleting === book.id}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <BookModal
          book={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchBooks() }}
        />
      )}
    </Layout>
  )
}
