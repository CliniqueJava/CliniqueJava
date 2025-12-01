import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Search, Users, Calendar, Phone, Mail, X, ChevronDown, ChevronUp } from 'lucide-react';
import { StatusBadge } from './DoctorDashboard';

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:8009/api/doctor/patients', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPatients(Array.from(res.data)))
      .catch(() => toast.error('Failed to load patients.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p => {
    const name = `${p.firstName} ${p.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase()) || p.email?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
          <Users size={24} className="text-[#1e6262]" />
          My Patients
        </h1>
        <p className="text-gray-400 text-sm mt-1">{patients.length} unique patient{patients.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1e6262] focus:ring-2 focus:ring-[#1e6262]/10 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#1e6262] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <Users size={36} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm font-medium">No patients found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((patient) => (
            <motion.div
              key={patient.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Patient Header */}
              <button
                onClick={() => setExpanded(expanded === patient.id ? null : patient.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors text-left"
              >
                <div className="w-11 h-11 rounded-full bg-[#1e6262]/10 flex items-center justify-center text-[#1e6262] font-bold text-sm shrink-0">
                  {patient.firstName?.[0]}{patient.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800">{patient.firstName} {patient.lastName}</p>
                  <p className="text-xs text-gray-400 truncate">{patient.email}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-[#1e6262] bg-[#ecfffb] px-2.5 py-1 rounded-full border border-[#1e6262]/10">
                    {patient.appointments?.length || 0} visit{patient.appointments?.length !== 1 ? 's' : ''}
                  </span>
                  {expanded === patient.id
                    ? <ChevronUp size={16} className="text-gray-400" />
                    : <ChevronDown size={16} className="text-gray-400" />
                  }
                </div>
              </button>

              {/* Expanded Details */}
              <AnimatePresence>
                {expanded === patient.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-4">
                      {/* Contact Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail size={14} className="text-[#2d767f] shrink-0" />
                          <span className="truncate">{patient.email}</span>
                        </div>
                        {patient.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} className="text-[#2d767f] shrink-0" />
                            <span>{patient.phone}</span>
                          </div>
                        )}
                        {patient.birthday && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={14} className="text-[#2d767f] shrink-0" />
                            <span>DOB: {patient.birthday}</span>
                          </div>
                        )}
                      </div>

                      {/* Appointment History */}
                      {patient.appointments?.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Consultation History</p>
                          <div className="space-y-2">
                            {patient.appointments.map(appt => (
                              <div key={appt.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
                                <div>
                                  <p className="text-sm font-semibold text-gray-700">
                                    {new Date(appt.appointmentTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                    {' · '}
                                    {new Date(appt.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                  {appt.notes && <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{appt.notes}</p>}
                                </div>
                                <StatusBadge status={appt.status} />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
