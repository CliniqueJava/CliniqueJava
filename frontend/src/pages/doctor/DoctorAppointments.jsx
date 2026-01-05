import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Search, CalendarCheck, Clock, Phone, MapPin, FileText, X, AlertTriangle } from 'lucide-react';
import { StatusBadge } from './DoctorDashboard';

const STATUS_OPTIONS = ['ALL', 'CONFIRMED', 'COMPLETED', 'REFUSED', 'CANCELLED', 'PENDING'];

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(null);

  // Refusal modal state
  const [refusalModal, setRefusalModal] = useState(null); // { id } when open
  const [refusalReason, setRefusalReason] = useState('');

  const token = localStorage.getItem('token');
  const authHeader = { Authorization: `Bearer ${token}` };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:8009/api/doctor/appointments', { headers: authHeader });
      setAppointments(res.data);
    } catch {
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const updateStatus = async (id, status, cancellationReason = null) => {
    setUpdating(id);
    try {
      const body = { status };
      if (cancellationReason) body.cancellationReason = cancellationReason;

      await axios.put(
        `http://localhost:8009/api/doctor/appointments/${id}/status`,
        body,
        { headers: authHeader }
      );
      setAppointments(prev =>
        prev.map(a => a.id === id ? { ...a, status, cancellationReason } : a)
      );
      if (selected?.id === id) setSelected(prev => ({ ...prev, status, cancellationReason }));
      toast.success(`Appointment marked as ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  const handleRefuse = (id) => {
    setRefusalReason('');
    setRefusalModal({ id });
  };

  const submitRefusal = async () => {
    if (!refusalReason.trim()) {
      toast.error('Please provide a reason for refusing this appointment.');
      return;
    }
    await updateStatus(refusalModal.id, 'REFUSED', refusalReason.trim());
    setRefusalModal(null);
    setRefusalReason('');
    if (selected?.id === refusalModal.id) setSelected(null);
  };

  const filtered = appointments.filter(a => {
    const name = `${a.patient?.firstName} ${a.patient?.lastName}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) ||
      a.patient?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5 max-w-6xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
          <CalendarCheck size={24} className="text-[#1e6262]" />
          Appointments
        </h1>
        <p className="text-gray-400 text-sm mt-1">{appointments.length} total appointments</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name or email..."
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
              className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
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
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#1e6262] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarCheck size={36} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  {['Patient', 'Date & Time', 'Duration', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((appt) => (
                  <motion.tr
                    key={appt.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1e6262]/10 flex items-center justify-center text-[#1e6262] font-bold text-xs shrink-0">
                          {appt.patient?.firstName?.[0]}{appt.patient?.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{appt.patient?.firstName} {appt.patient?.lastName}</p>
                          <p className="text-xs text-gray-400">{appt.patient?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-700">
                        {new Date(appt.appointmentTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-gray-500 font-medium">{appt.durationMinutes} min</td>
                    <td className="px-5 py-4"><StatusBadge status={appt.status} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => setSelected(appt)} className="text-xs font-bold text-[#1e6262] hover:underline">
                          Details
                        </button>
                        {appt.status === 'CONFIRMED' && (
                          <>
                            <button disabled={updating === appt.id} onClick={() => updateStatus(appt.id, 'COMPLETED')}
                              className="text-xs font-bold text-emerald-600 hover:underline disabled:opacity-50">Complete</button>
                            <button disabled={updating === appt.id} onClick={() => handleRefuse(appt.id)}
                              className="text-xs font-bold text-red-500 hover:underline disabled:opacity-50">Refuse</button>
                          </>
                        )}
                        {appt.status === 'PENDING' && (
                          <>
                            <button disabled={updating === appt.id} onClick={() => updateStatus(appt.id, 'CONFIRMED')}
                              className="text-xs font-bold text-blue-600 hover:underline disabled:opacity-50">Confirm</button>
                            <button disabled={updating === appt.id} onClick={() => handleRefuse(appt.id)}
                              className="text-xs font-bold text-red-500 hover:underline disabled:opacity-50">Refuse</button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Refusal Reason Modal ── */}
      <AnimatePresence>
        {refusalModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setRefusalModal(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} className="text-white" />
                  <div>
                    <p className="text-red-100 text-xs font-bold uppercase tracking-wider">Action Required</p>
                    <h3 className="text-white font-extrabold text-lg">Refuse Appointment</h3>
                  </div>
                </div>
                <button onClick={() => setRefusalModal(null)} className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500">
                  You are about to refuse this appointment. The patient will be notified with your reason.
                  Please provide a clear explanation.
                </p>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
                    Cancellation Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={refusalReason}
                    onChange={e => setRefusalReason(e.target.value)}
                    placeholder="e.g. Doctor unavailable on this date due to an emergency. Please reschedule."
                    className="w-full p-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition resize-none"
                    autoFocus
                  />
                  <p className="text-[10px] text-gray-400 mt-1">{refusalReason.length}/500 characters</p>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setRefusalModal(null)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-bold transition-colors">
                    Cancel
                  </button>
                  <button
                    onClick={submitRefusal}
                    disabled={!refusalReason.trim() || updating === refusalModal?.id}
                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {updating === refusalModal?.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <><AlertTriangle size={14} /> Confirm Refusal</>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#1e6262] to-[#2d767f] px-6 py-5 flex justify-between items-center">
                <div>
                  <p className="text-[#b4f1f1] text-xs font-bold uppercase tracking-wider">Appointment Details</p>
                  <h3 className="text-white font-extrabold text-lg mt-0.5">
                    {selected.patient?.firstName} {selected.patient?.lastName}
                  </h3>
                </div>
                <button onClick={() => setSelected(null)} className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <InfoItem icon={CalendarCheck} label="Date" value={new Date(selected.appointmentTime).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })} />
                  <InfoItem icon={Clock} label="Time" value={new Date(selected.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                  <InfoItem icon={Clock} label="Duration" value={`${selected.durationMinutes} minutes`} />
                  <div className="flex flex-col gap-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                    <StatusBadge status={selected.status} />
                  </div>
                </div>
                {selected.phone && <InfoItem icon={Phone} label="Phone" value={selected.phone} />}
                {selected.address && <InfoItem icon={MapPin} label="Address" value={selected.address} />}
                {selected.notes && <InfoItem icon={FileText} label="Notes" value={selected.notes} />}
                {selected.cancellationReason && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">Refusal Reason</p>
                    <p className="text-sm text-red-700">{selected.cancellationReason}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Patient Info</p>
                  <p className="text-sm font-bold text-gray-800">{selected.patient?.firstName} {selected.patient?.lastName}</p>
                  <p className="text-xs text-gray-500">{selected.patient?.email}</p>
                  {selected.patient?.birthday && <p className="text-xs text-gray-500">DOB: {selected.patient.birthday}</p>}
                </div>
                <div className="flex gap-2 pt-2">
                  {selected.status === 'CONFIRMED' && (
                    <>
                      <button disabled={updating === selected.id} onClick={() => updateStatus(selected.id, 'COMPLETED')}
                        className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50">
                        Mark Completed
                      </button>
                      <button disabled={updating === selected.id} onClick={() => { setSelected(null); handleRefuse(selected.id); }}
                        className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-xs font-bold transition-colors disabled:opacity-50">
                        Refuse
                      </button>
                    </>
                  )}
                  {selected.status === 'PENDING' && (
                    <>
                      <button disabled={updating === selected.id} onClick={() => updateStatus(selected.id, 'CONFIRMED')}
                        className="flex-1 py-2.5 bg-[#1e6262] hover:bg-[#154646] text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50">
                        Confirm
                      </button>
                      <button disabled={updating === selected.id} onClick={() => { setSelected(null); handleRefuse(selected.id); }}
                        className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl text-xs font-bold transition-colors disabled:opacity-50">
                        Refuse
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
        <Icon size={10} /> {label}
      </p>
      <p className="text-sm font-semibold text-gray-700">{value}</p>
    </div>
  );
}

// iyadh: refuse modal
