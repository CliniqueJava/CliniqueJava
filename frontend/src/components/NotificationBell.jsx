import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, X, CalendarCheck, XCircle, Clock } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const POLL_INTERVAL = 30000; // 30 seconds

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function NotifIcon({ type }) {
  if (type === 'CONFIRMED') return <CheckCheck size={16} className="text-emerald-500" />;
  if (type === 'REFUSED')   return <XCircle size={16} className="text-red-500" />;
  return <Clock size={16} className="text-gray-400" />;
}

function NotifCard({ notif, onRead }) {
  const isConfirmed = notif.type === 'CONFIRMED';
  const isRefused   = notif.type === 'REFUSED';

  const apptDate = notif.appointmentTime
    ? new Date(notif.appointmentTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    : '';
  const apptTime = notif.appointmentTime
    ? new Date(notif.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      onClick={() => !notif.isRead && onRead(notif.id)}
      className={`relative px-4 py-3.5 cursor-pointer transition-colors hover:bg-gray-50 ${
        !notif.isRead ? 'bg-[#f0faf9]' : 'bg-white'
      }`}
    >
      {/* Unread dot */}
      {!notif.isRead && (
        <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#1e6262]" />
      )}

      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
          isConfirmed ? 'bg-emerald-50' : isRefused ? 'bg-red-50' : 'bg-gray-100'
        }`}>
          <NotifIcon type={notif.type} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800">
            {isConfirmed ? 'Appointment Confirmed' : isRefused ? 'Appointment Refused' : notif.type}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {notif.doctorName} · {apptDate} at {apptTime}
          </p>
          {isRefused && notif.cancellationReason && (
            <p className="text-xs text-red-500 mt-1 bg-red-50 rounded-lg px-2 py-1 border border-red-100">
              Reason: {notif.cancellationReason}
            </p>
          )}
          <p className="text-[10px] text-gray-400 mt-1">{timeAgo(notif.createdAt)}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function NotificationBell() {
  const { isAuthenticated, role } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);
  const prevUnreadRef = useRef(0);

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  // Only show for authenticated patients
  if (!isAuthenticated || role !== 'PATIENT') return null;

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:8009/api/notifications', { headers: authHeader });
      const data = res.data;
      setNotifications(data);
      const unread = data.filter(n => !n.isRead).length;

      // Toast alert for new notifications since last poll
      if (unread > prevUnreadRef.current && prevUnreadRef.current !== -1) {
        const newOnes = unread - prevUnreadRef.current;
        toast.info(`🔔 You have ${newOnes} new notification${newOnes > 1 ? 's' : ''}`, {
          position: 'top-right',
          autoClose: 4000,
          toastId: 'notif-alert'
        });
      }
      prevUnreadRef.current = unread;
      setUnreadCount(unread);
    } catch {
      // Silently fail — don't spam errors on poll
    }
  }, [token]);

  // Initial fetch + polling
  useEffect(() => {
    prevUnreadRef.current = -1; // suppress toast on first load
    fetchNotifications();
    const interval = setInterval(fetchNotifications, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = async (id) => {
    try {
      await axios.patch(`http://localhost:8009/api/notifications/${id}/read`, {}, { headers: authHeader });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* silent */ }
  };

  const markAllRead = async () => {
    try {
      await axios.patch('http://localhost:8009/api/notifications/read-all', {}, { headers: authHeader });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch { /* silent */ }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-[#1e6262]"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-[#1e6262] to-[#2d767f]">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-white" />
                <span className="text-white font-bold text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[#b4f1f1] hover:text-white text-[10px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell size={28} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm font-medium">No notifications yet</p>
                </div>
              ) : (
                <AnimatePresence>
                  {notifications.map(n => (
                    <NotifCard key={n.id} notif={n} onRead={markRead} />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
