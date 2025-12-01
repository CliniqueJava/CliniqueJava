import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  Calendar, Search, RefreshCw, X, Clock, User, Stethoscope,
  FileText, Phone, MapPin, AlertTriangle, CheckCircle, XCircle,
  Trash2, ChevronDown, Filter
} from 'lucide-react';

const API = 'http://localhost:8009/api/appointments';

const STATUS_COLORS = {
  CONFIRMED: 'bg-blue-50 text-blue-600 border-blue-100',
  COMPLETED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  REFUSED:   'bg-red-50 text-red-500 border-red-100',
  CANCELLED: 'bg-gray-100 text-gray-500 border-gray-200',
  PENDING:   'bg-amber-50 text-amber-600 border-amber-100',
};

function StatusBadge({ status }) {
  return (
    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border uppercase tracking-wide ${STATUS_COLORS[status] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
      {status}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className={`bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-4 ${color}`}>
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-current/10">
        <Icon size={20} className="text-current" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-800">{value}</p>
        <p className="text-xs text-gray-400 font-medium">{label}</p>
      </div>
    </div>
  );
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchAppointments = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await axios.get(API, { headers: authHeader });
      setAppointments(res.data);
    } catch (err) {
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment permanently?')) return;
    setDeleting(id);
    try {
      await axios.delete(`${API}/${id}`, { headers: authHeader });
      setAppointments(prev => prev.filter(a => a.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Appointment deleted.');
    } catch {
      toast.error('Failed to delete appointment.');
    } finally {
      setDeleting(null);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${API}/${id}/status`, { status }, { headers: authHeader });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  // Stats
  const total     = appointments.length;
  const pending   = appointments.filter(a => a.status === 'PENDING').length;
  const confirmed = appointments.filter(a => a.status === 'CONFIRMED').length;
  const refused   = appointments.filter(a => a.status === 'REFUSED').length;
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;

  const STATUS_OPTIONS = ['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'REFUSED', 'CANCELLED'];

  const filtered = appointments.filter(a => {
    const patient = `${a.patient?.firstName ?? ''} ${a.patient?.lastName ?? ''}`.toLowerCase();
    const doctor  = `${a.doctor?.firstName ?? ''} ${a.doctor?.lastName ?? ''}`.toLowerCase();
    const q = search.toLowerCase();
    const matchSearch = patient.includes(q) || doctor.includes(q) || a.patient?.email?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <Calendar size={24} className="text-[#1e6262]" />
            Appointments
          </h1>
          <p className="text-gray-400 text-sm mt-1">{total} total records in database</p>
        </div>
        <button
          onClick={() => fetchAppointments(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-[#1e6262] hover:text-[#1e6262] transition-all disabled:opacity-50"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard label="Total"     value={total}     icon={Calendar}     color="border-gray-100" />
        <StatCard label="Pending"   value={pending}   icon={Clock}        color="border-amber-100" />
        <StatCard label="Confirmed" value={confirmed} icon={CheckCircle}  color="border-blue-100" />
        <StatCard label="Completed" value={completed} icon={CheckCircle}  color="border-emerald-100" />
        <StatCard label="Refused"   value={refused}   icon={XCircle}      color="border-red-100" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient, doctor, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e6262] focus:ring-2 focus:ring-[#1e6262]/10 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                statusFilter === s
                  ? 'bg-[#1e6262] text-white border-[#1e6262]'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-[#1e6262]/40'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-10 h-10 border-4 border-[#1e6262] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Loading appointments from database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Calendar size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">
              {search || statusFilter !== 'ALL' ? 'No appointments match your filters.' : 'No appointments found in the database.'}
            </p>
            {(search || statusFilter !== 'ALL') && (
              <button onClick={() => { setSearch(''); setStatusFilter('ALL'); }}
                className="mt-3 text-xs font-bold text-[#1e6262] hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  {['Patient', 'Doctor', 'Date & Time', 'Duration', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(appt => (
                  <motion.tr
                    key={appt.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    {/* Patient */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1e6262]/10 flex items-center justify-center text-[#1e6262] font-bold text-xs shrink-0">
                          {appt.patient?.firstName?.[0]}{appt.patient?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{appt.patient?.firstName} {appt.patient?.lastName}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[140px]">{appt.patient?.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Doctor */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                          <Stethoscope size={12} className="text-purple-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700 text-sm">Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}</p>
                          <p className="text-xs text-gray-400">{appt.doctor?.speciality}</p>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-semibold text-gray-700">
                        {new Date(appt.appointmentTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4 text-gray-500 font-medium whitespace-nowrap">{appt.durationMinutes} min</td>

                    {/* Status */}
                    <td className="px-5 py-4"><StatusBadge status={appt.status} /></td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelected(appt)}
                          className="text-xs font-bold text-[#1e6262] hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(appt.id)}
                          disabled={deleting === appt.id}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && filtered.length > 0 && (
        <p className="text-xs text-gray-400 text-right">
          Showing {filtered.length} of {total} appointments
        </p>
      )}

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#1e6262] to-[#2d767f] px-6 py-5 flex justify-between items-center">
                <div>
                  <p className="text-[#b4f1f1] text-xs font-bold uppercase tracking-wider">Appointment #{selected.id}</p>
                  <h3 className="text-white font-extrabold text-lg mt-0.5">
                    {selected.patient?.firstName} {selected.patient?.lastName}
                  </h3>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

                {/* Status + Quick Update */}
                <div className="flex items-center justify-between">
                  <StatusBadge status={selected.status} />
                  <div className="flex gap-2">
                    {selected.status === 'PENDING' && (
                      <button onClick={() => handleStatusUpdate(selected.id, 'CONFIRMED')}
                        className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                        Confirm
                      </button>
                    )}
                    {(selected.status === 'PENDING' || selected.status === 'CONFIRMED') && (
                      <button onClick={() => handleStatusUpdate(selected.id, 'CANCELLED')}
                        className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors">
                        Cancel
                      </button>
                    )}
                    {selected.status === 'CONFIRMED' && (
                      <button onClick={() => handleStatusUpdate(selected.id, 'COMPLETED')}
                        className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                        Complete
                      </button>
                    )}
                  </div>
                </div>

                {/* Two-column info grid */}
                <div className="grid grid-cols-2 gap-4">
                  <InfoBlock icon={User} label="Patient">
                    <p className="font-bold text-gray-800">{selected.patient?.firstName} {selected.patient?.lastName}</p>
                    <p className="text-xs text-gray-400">{selected.patient?.email}</p>
                  </InfoBlock>
                  <InfoBlock icon={Stethoscope} label="Doctor">
                    <p className="font-bold text-gray-800">Dr. {selected.doctor?.firstName} {selected.doctor?.lastName}</p>
                    <p className="text-xs text-gray-400">{selected.doctor?.speciality}</p>
                  </InfoBlock>
                  <InfoBlock icon={Calendar} label="Date">
                    <p className="font-semibold text-gray-700">
                      {new Date(selected.appointmentTime).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </InfoBlock>
                  <InfoBlock icon={Clock} label="Time & Duration">
                    <p className="font-semibold text-gray-700">
                      {new Date(selected.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' · '}{selected.durationMinutes} min
                    </p>
                  </InfoBlock>
                  {selected.phone && (
                    <InfoBlock icon={Phone} label="Phone">
                      <p className="font-semibold text-gray-700">{selected.phone}</p>
                    </InfoBlock>
                  )}
                  {selected.address && (
                    <InfoBlock icon={MapPin} label="Address">
                      <p className="font-semibold text-gray-700 text-xs">{selected.address}</p>
                    </InfoBlock>
                  )}
                </div>

                {/* Notes */}
                {selected.notes && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <FileText size={10} /> Patient Notes
                    </p>
                    <p className="text-sm text-gray-600">{selected.notes}</p>
                  </div>
                )}

                {/* Cancellation Reason */}
                {selected.cancellationReason && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <AlertTriangle size={10} /> Refusal / Cancellation Reason
                    </p>
                    <p className="text-sm text-red-700">{selected.cancellationReason}</p>
                  </div>
                )}

                {/* Delete */}
                <button
                  onClick={() => handleDelete(selected.id)}
                  disabled={deleting === selected.id}
                  className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Trash2 size={13} />
                  Delete Appointment
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoBlock({ icon: Icon, label, children }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
        <Icon size={10} /> {label}
      </p>
      {children}
    </div>
  );
}
