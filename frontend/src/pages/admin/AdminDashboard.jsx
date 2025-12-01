import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Users, UserRoundCog, Calendar, TrendingUp,
  CheckCircle, XCircle, Clock, AlertCircle, ArrowRight
} from 'lucide-react';

// ── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ title, value, icon, trend, colorClass, loading }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-40 relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 transition-transform group-hover:scale-150 ${colorClass}`} />
      <div className="flex justify-between items-start z-10">
        <div>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
          {loading
            ? <div className="h-9 w-16 bg-gray-200 rounded-lg animate-pulse mt-1" />
            : <h3 className="text-3xl font-extrabold text-gray-800">{value}</h3>
          }
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${colorClass} shadow-md`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-4 z-10">
          <TrendingUp size={16} className="text-green-500" />
          <span className="text-sm font-bold text-green-500">{trend}</span>
          <span className="text-xs font-medium text-gray-400 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
}

// ── Status badge ─────────────────────────────────────────────────────────────
const STATUS_META = {
  CONFIRMED: { color: 'bg-blue-100 text-blue-600',    icon: <CheckCircle size={12} /> },
  COMPLETED: { color: 'bg-emerald-100 text-emerald-600', icon: <CheckCircle size={12} /> },
  REFUSED:   { color: 'bg-red-100 text-red-500',      icon: <XCircle size={12} /> },
  CANCELLED: { color: 'bg-gray-100 text-gray-500',    icon: <XCircle size={12} /> },
  PENDING:   { color: 'bg-amber-100 text-amber-600',  icon: <Clock size={12} /> },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || { color: 'bg-gray-100 text-gray-500', icon: null };
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${meta.color}`}>
      {meta.icon}{status}
    </span>
  );
}

// ── Mini bar chart ────────────────────────────────────────────────────────────
function StatusBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-gray-600">{label}</span>
        <span className="font-extrabold text-gray-800">{count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats]               = useState({ patients: 0, doctors: 0 });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [apptLoading, setApptLoading]   = useState(true);

  const token  = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch patients + doctors count
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pRes, dRes] = await Promise.all([
          axios.get('http://localhost:8009/api/admin/patients', config),
          axios.get('http://localhost:8009/api/admin/doctors',  config),
        ]);
        setStats({ patients: pRes.data.length, doctors: dRes.data.length });
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fetch all appointments
  useEffect(() => {
    const fetchAppts = async () => {
      try {
        const res = await axios.get('http://localhost:8009/api/appointments', config);
        setAppointments(res.data);
      } catch (err) {
        console.error('Failed to load appointments', err);
      } finally {
        setApptLoading(false);
      }
    };
    fetchAppts();
  }, []);

  // Derived stats
  const total     = appointments.length;
  const confirmed = appointments.filter(a => a.status === 'CONFIRMED').length;
  const completed = appointments.filter(a => a.status === 'COMPLETED').length;
  const refused   = appointments.filter(a => a.status === 'REFUSED').length;
  const cancelled = appointments.filter(a => a.status === 'CANCELLED').length;
  const pending   = appointments.filter(a => a.status === 'PENDING').length;

  // 5 most recent appointments for activity feed
  const recent = appointments.slice(0, 8);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Patients"  value={stats.patients} icon={<Users size={24} />}        trend="+12%" colorClass="bg-blue-500"    loading={loading} />
        <StatCard title="Total Doctors"   value={stats.doctors}  icon={<UserRoundCog size={24} />}  trend="+2%"  colorClass="bg-[#1e6262]"   loading={loading} />
        <StatCard title="Appointments"    value={total}          icon={<Calendar size={24} />}      trend="+28%" colorClass="bg-purple-500"  loading={apptLoading} />
        <StatCard title="Pending Review"  value={pending}        icon={<AlertCircle size={24} />}               colorClass="bg-orange-500"  loading={apptLoading} />
      </div>

      {/* ── Bottom Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Appointments by Status — live breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-gray-800">Appointments Overview</h3>
              <p className="text-xs text-gray-400 mt-0.5">Live breakdown from database</p>
            </div>
            <Link to="/admin/appointments"
              className="flex items-center gap-1 text-xs font-bold text-[#1e6262] hover:underline">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {apptLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#1e6262] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : total === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
              <Calendar size={40} className="mb-2" />
              <p className="text-sm font-medium text-gray-400">No appointments yet</p>
            </div>
          ) : (
            <div className="space-y-5 flex-1">
              {/* Big number summary */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Confirmed', val: confirmed, cls: 'text-blue-600 bg-blue-50 border-blue-100' },
                  { label: 'Completed', val: completed, cls: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                  { label: 'Pending',   val: pending,   cls: 'text-amber-600 bg-amber-50 border-amber-100' },
                ].map(({ label, val, cls }) => (
                  <div key={label} className={`rounded-xl border p-3 text-center ${cls}`}>
                    <p className="text-2xl font-extrabold">{val}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider mt-0.5 opacity-70">{label}</p>
                  </div>
                ))}
              </div>

              {/* Progress bars */}
              <div className="space-y-3 pt-2">
                <StatusBar label="Confirmed" count={confirmed} total={total} color="bg-blue-500" />
                <StatusBar label="Completed" count={completed} total={total} color="bg-emerald-500" />
                <StatusBar label="Pending"   count={pending}   total={total} color="bg-amber-400" />
                <StatusBar label="Refused"   count={refused}   total={total} color="bg-red-400" />
                <StatusBar label="Cancelled" count={cancelled} total={total} color="bg-gray-400" />
              </div>

              <p className="text-xs text-gray-400 text-right pt-1">
                {total} total appointments in database
              </p>
            </div>
          )}
        </div>

        {/* Recent Appointments — live feed */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold text-gray-800">Recent Appointments</h3>
            <Link to="/admin/appointments"
              className="text-xs font-bold text-[#1e6262] hover:underline flex items-center gap-1">
              All <ArrowRight size={12} />
            </Link>
          </div>

          {apptLoading ? (
            <div className="flex-1 space-y-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
              <Calendar size={32} className="mb-2" />
              <p className="text-sm text-gray-400">No recent activity</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {recent.map(appt => (
                <div key={appt.id} className="flex items-start gap-3 group">
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-[#1e6262]/10 flex items-center justify-center text-[#1e6262] font-bold text-xs shrink-0 mt-0.5">
                    {appt.patient?.firstName?.[0]}{appt.patient?.lastName?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {appt.patient?.firstName} {appt.patient?.lastName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      Dr. {appt.doctor?.firstName} {appt.doctor?.lastName}
                      {' · '}
                      {new Date(appt.appointmentTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <StatusBadge status={appt.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
