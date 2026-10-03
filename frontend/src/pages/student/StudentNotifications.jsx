import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'
import toast from 'react-hot-toast'

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = () => {
    api.get('/notifications')
      .then((res) => setNotifications(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchNotifications() }, [])

  const markRead = async (id) => {
    try {
      const res = await api.put(`/notifications/${id}/read`)
      setNotifications((prev) => prev.map((n) => (n.id === id ? res.data : n)))
    } catch {
      toast.error('Failed to mark as read')
    }
  }

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead)
    await Promise.all(unread.map((n) => api.put(`/notifications/${n.id}/read`)))
    fetchNotifications()
    toast.success('All notifications marked as read')
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-slate-400 text-center py-12">Loading...</p>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">🔔</div>
          <p className="text-slate-400">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border p-4 flex items-start gap-4 transition ${
                n.isRead ? 'bg-white border-slate-100' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${n.isRead ? 'bg-slate-300' : 'bg-blue-500'}`} />
              <div className="flex-1">
                <p className="text-sm text-slate-700">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
              {!n.isRead && (
                <button
                  onClick={() => markRead(n.id)}
                  className="text-xs text-blue-600 hover:underline shrink-0 font-medium"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}
