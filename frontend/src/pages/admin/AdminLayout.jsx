import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, UserRoundCog, Calendar, LogOut } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLayout() {
  const { logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Patients', path: '/admin/patients', icon: <Users size={20} /> },
    { name: 'Doctors', path: '/admin/doctors', icon: <UserRoundCog size={20} /> },
    { name: 'Appointments', path: '/admin/appointments', icon: <Calendar size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-[#f8fcfc] font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200/60 flex flex-col shadow-sm relative z-20">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e6262]/10 text-[#1e6262]">
            <span className="font-bold text-xl">C</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-800 text-lg leading-tight">Clinique</h1>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Admin Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 mt-2 px-3">Menu</div>
          {navLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 font-medium text-sm ${
                  isActive 
                    ? 'bg-[#1e6262] text-white shadow-md shadow-[#1e6262]/20' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#1e6262]'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-gray-400'}`}>{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-3 rounded-xl transition-colors font-medium text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={20} className="text-red-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        
        {/* Topbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between px-8 shrink-0">
          <h2 className="font-bold text-gray-800 capitalize text-lg">
            {location.pathname.split('/').pop()}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">Super Admin</span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {/* Decorative background blur */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#b4f1f1]/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <Outlet />
        </div>
      </main>

      {/* Toast Notifications container inside admin to avoid conflict with existing custom toast if any */}
      <ToastContainer position="bottom-right" theme="colored" hideProgressBar autoClose={3000} />
    </div>
  );
}
