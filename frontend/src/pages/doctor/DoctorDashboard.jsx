import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarCheck, Users, Clock, CheckCircle, XCircle,
  AlertCircle, Stethoscope, TrendingUp, ArrowRight
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notAuthorized, setNotAuthorized] = useState(false);

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, apptRes] = await Promise.all([
          axios.get('http://localhost:8009/api/doctor/me', { headers: authHeader }),
          axios.get('http://localhost:8009/api/doctor/appointments', { headers: authHeader })
        ]);
        setProfile(profileRes.data);
        setAppointments(apptRes.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setNotAuthorized(true);
        } else {
          toast.error('Failed to load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#1e6262] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Stats
  const total = appointments.length;
  const confirmed = appointments.filter(a => a.status === 'CONFIRMED').length;
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;
  const cancelled = appointments.filter(a => a.status === 'CANCELLED').length;
  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.appointmentTime?.startsWith(today));
  const uniquePatients = new Set(appointments.map(a => a.patient?.id)).size;

  const stats = [
    { label: 'Total Appointments', value: total, icon: CalendarCheck, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { label: 'Confirmed', value: confirmed, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
    { label: 'Completed', value: completed, icon: TrendingUp, color: 'bg-[#ecfffb] text-[#1e6262]', border: 'border-[#1e6262]/10' },
    { label: 'My Patients', value: uniquePatients, icon: Users, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  ];

  return (
    <>
      {/* Not Authorized Popup */}
      <AnimatePresence>
        {notAuthorized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center space-y-5"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={36} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-800 mb-2">Account Not Available</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Your doctor account is not available. Please contact the administration.
                </p>
              </div>
              <Link
                to="/"
                className="block w-full py-3 bg-[#1e6262] text-white rounded-xl font-bold text-sm hover:bg-[#154646] transition-colors"
              >
                Back to Home
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, Dr. {user?.firstName} 👋
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {todayAppts.length > 0
                ? `You have ${todayAppts.length} appointment${todayAppts.length > 1 ? 's' : ''} today.`
                : 'No appointments scheduled for today.'}
            </p>
          </div>
          {profile && (
            <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
              {profile.imageUrl ? (
                <img src={profile.imageUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#1e6262]/10 flex items-center justify-center text-[#1e6262] font-bold text-sm">
                  {profile.firstName?.[0]}{profile.lastName?.[0]}
                </div>
              )}
              <div>
                <p className="font-bold text-gray-800 text-sm">Dr. {profile.firstName} {profile.lastName}</p>
                <p className="text-xs text-[#2d767f] font-semibold">{profile.speciality}</p>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color, border }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-white rounded-2xl p-5 border ${border} shadow-sm`}
            >
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-extrabold text-gray-800">{value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-extrabold text-gray-800 flex items-center gap-2">
              <Clock size={18} className="text-[#1e6262]" />
              Today's Schedule
            </h2>
            <Link to="/doctor/appointments" className="text-xs font-bold text-[#1e6262] hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {todayAppts.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <Stethoscope size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm font-medium">No appointments today</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {todayAppts.slice(0, 5).map((appt) => (
                <div key={appt.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#1e6262]/10 flex items-center justify-center text-[#1e6262] font-bold text-sm shrink-0">
                    {appt.patient?.firstName?.[0]}{appt.patient?.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">
                      {appt.patient?.firstName} {appt.patient?.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' · '}{appt.durationMinutes} min
                    </p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-extrabold text-gray-800 flex items-center gap-2">
              <CalendarCheck size={18} className="text-[#1e6262]" />
              Recent Appointments
            </h2>
            <Link to="/doctor/appointments" className="text-xs font-bold text-[#1e6262] hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {appointments.slice(0, 6).map((appt) => (
              <div key={appt.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#1e6262]/10 flex items-center justify-center text-[#1e6262] font-bold text-sm shrink-0">
                  {appt.patient?.firstName?.[0]}{appt.patient?.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm truncate">
                    {appt.patient?.firstName} {appt.patient?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(appt.appointmentTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' · '}{new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function StatusBadge({ status }) {
  const map = {
    CONFIRMED: 'bg-blue-50 text-blue-600 border-blue-100',
    COMPLETED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    CANCELLED: 'bg-red-50 text-red-500 border-red-100',
    PENDING:   'bg-amber-50 text-amber-600 border-amber-100',
  };
  return (
    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wide ${map[status] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
      {status}
    </span>
  );
}

// iyadh: stats
