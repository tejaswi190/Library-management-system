import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const CATEGORIES = [
  'All', 'Anatomy', 'Physiology', 'Biochemistry', 'Pathology',
  'Pharmacology', 'Microbiology', 'Medicine', 'Surgery', 'Pediatrics',
  'Obstetrics', 'Radiology', 'Psychiatry', 'Forensic', 'Community Medicine',
]

function BookCard({ book }) {
  const available = book.availableCopies > 0

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-slate-800 text-sm leading-tight">{book.title}</h3>
          <p className="text-slate-500 text-xs mt-1">{book.author}</p>
        </div>
        <span className={`ml-2 shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${
          available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {available ? `${book.availableCopies} avail.` : 'Unavailable'}
        </span>
      </div>

      {book.category && (
        <span className="self-start px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
          {book.category}
        </span>
      )}

      {book.description && (
        <p className="text-slate-400 text-xs line-clamp-2">{book.description}</p>
      )}

      <div className="mt-auto pt-2 border-t border-slate-50 grid grid-cols-2 gap-x-3 text-xs text-slate-400">
        {book.publisher && <span>Publisher: {book.publisher}</span>}
        {book.year && <span>Year: {book.year}</span>}
        {book.isbn && <span className="col-span-2">ISBN: {book.isbn}</span>}
        <span>Total: {book.totalCopies} cop.</span>
      </div>
    </div>
  )
}

export default function BrowseBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('All')

  const fetchBooks = () => {
    setLoading(true)
    const params = {}
    if (title) params.title = title
    if (author) params.author = author
    if (category !== 'All') params.category = category
    api.get('/books', { params })
      .then((res) => setBooks(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchBooks() }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchBooks()
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Browse Books</h1>
        <p className="text-slate-500 text-sm mt-1">Search the medical library catalogue</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-sm p-5 mb-6 flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Gray's Anatomy"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-slate-600 mb-1">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="min-w-[160px]">
          <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => { setTitle(''); setAuthor(''); setCategory('All'); }}
          className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-lg hover:bg-slate-200 transition"
        >
          Clear
        </button>
      </form>

      {loading ? (
        <p className="text-slate-400 text-center py-12">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-slate-400 text-center py-12">No books found matching your search.</p>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">{books.length} book{books.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {books.map((book) => <BookCard key={book.id} book={book} />)}
          </div>
        </>
      )}
    </Layout>
  )
}
