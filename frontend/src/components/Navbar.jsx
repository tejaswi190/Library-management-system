import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard' },
  { to: '/student/browse', label: 'Browse Books' },
  { to: '/student/my-books', label: 'My Books' },
  { to: '/student/notifications', label: 'Notifications' },
]

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/books', label: 'Manage Books' },
  { to: '/admin/issue-return', label: 'Issue / Return' },
  { to: '/admin/records', label: 'All Records' },
  { to: '/admin/overdue', label: 'Overdue' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links = user?.role === 'ADMIN' ? adminLinks : studentLinks

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <svg className="w-7 h-7 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="font-bold text-lg tracking-wide">MedLib</span>
            <span className="hidden sm:inline text-xs text-blue-300 bg-blue-800 px-2 py-0.5 rounded-full">
              {user?.role}
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive ? 'bg-blue-700 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* User / Logout */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-blue-200">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-blue-800 px-4 py-2 flex flex-wrap gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded text-xs font-medium transition ${
                isActive ? 'bg-blue-700 text-white' : 'text-blue-200 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
