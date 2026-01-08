import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import NotificationBell from '../components/NotificationBell';

const SPECIALITIES = ['All', 'Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist', 'Dentist', 'Orthopedist'];

export default function DoctorsPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeciality, setSelectedSpeciality] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getAllDoctors();
        const mappedDoctors = data.map(doc => ({
          id: doc.id,
          name: `Dr. ${doc.firstName} ${doc.lastName}`,
          speciality: doc.speciality,
          experience: doc.experience || "10 years",
          rating: doc.rating || 4.8,
          description: doc.description || "Dedicated medical professional committed to providing the highest quality of patient care.",
          image: doc.imageUrl || `https://ui-avatars.com/api/?name=${doc.firstName}+${doc.lastName}&background=random`,
          isOnline: Math.random() > 0.5
        }));
        setDoctors(mappedDoctors);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filter and sort logic
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.speciality.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpeciality = selectedSpeciality === 'All' || doc.speciality === selectedSpeciality;
    return matchesSearch && matchesSpeciality;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'experience') return parseInt(b.experience) - parseInt(a.experience);
    return 0; // default / recommended
  });

  return (
    <div className="min-h-screen bg-[#f8fcfc] font-sans pb-20">

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e6262]/10 text-[#1e6262] transition-colors group-hover:bg-[#1e6262] group-hover:text-white">
              <span className="font-bold">C</span>
            </div>
            <span className="font-bold text-gray-800 text-lg">Clinique</span>
          </Link>
          <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-[#1e6262] transition-colors">
            Back to Home
          </Link>
          <NotificationBell />
        </div>
      </header>

      {/* Hero Section for Doctors Page */}
      <section className="bg-gradient-to-br from-[#1e6262] via-[#2d767f] to-[#1e6262] py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 -z-10 h-64 w-64 translate-x-1/3 -translate-y-1/4 rounded-full bg-white/10 blur-3xl"></div>
        <div className="mx-auto max-w-7xl relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Find your Specialist</h1>
          <p className="text-[#ecfffb] opacity-90 text-lg max-w-2xl mx-auto">
            Book an appointment with our trusted medical professionals. Fast, secure, and tailored to your needs.
          </p>

          {/* Search Bar & AI Agent */}
          <div className="mt-8 max-w-2xl mx-auto flex items-center justify-center gap-4">
            <div className="relative group flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-focus-within:text-[#1e6262] transition-colors"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search by name or speciality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white rounded-full py-4 pl-12 pr-4 text-gray-800 shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30 transition-all text-sm font-medium placeholder-gray-400"
              />
            </div>
            
            <button 
              onClick={() => navigate("/chat-agent")}
              className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-xl transition-transform hover:scale-110 animate-[bounce_3s_infinite]"
              title="Ask our Medical AI Assistant"
            >
              <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping"></div>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-8 h-8 z-10 group-hover:scale-110 transition-transform" fill="none">
                {/* Head */}
                <rect x="12" y="14" width="40" height="32" rx="10" fill="#1e6262" />
                {/* Antenna */}
                <line x1="32" y1="14" x2="32" y2="6" stroke="#1e6262" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="32" cy="5" r="3" fill="#2dd4bf"/>
                {/* Eyes */}
                <rect x="20" y="24" width="8" height="6" rx="2" fill="#2dd4bf"/>
                <rect x="36" y="24" width="8" height="6" rx="2" fill="#2dd4bf"/>
                {/* Eye shine */}
                <rect x="22" y="25" width="2" height="2" rx="1" fill="white"/>
                <rect x="38" y="25" width="2" height="2" rx="1" fill="white"/>
                {/* Smile */}
                <path d="M22 36 Q32 42 42 36" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                {/* Ears */}
                <rect x="6" y="24" width="6" height="10" rx="3" fill="#1e6262"/>
                <rect x="52" y="24" width="6" height="10" rx="3" fill="#1e6262"/>
                {/* Stethoscope */}
                <path d="M42 46 Q46 50 46 54 Q46 58 42 58 Q38 58 38 54" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <circle cx="38" cy="54" r="3" fill="none" stroke="#2dd4bf" strokeWidth="2"/>
                <line x1="28" y1="46" x2="42" y2="46" stroke="#2dd4bf" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Filters & Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 mt-12">

        {/* Controls: Pills & Sorting */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">

          {/* Speciality Pills */}
          <div className="flex flex-wrap gap-2">
            {SPECIALITIES.map(spec => (
              <button
                key={spec}
                onClick={() => setSelectedSpeciality(spec)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${selectedSpeciality === spec
                  ? 'bg-[#1e6262] text-white border-[#1e6262] shadow-md shadow-[#1e6262]/20'
                  : 'bg-white text-gray-600 border-gray-200/60 hover:border-[#1e6262]/50 hover:bg-gray-50'
                  }`}
              >
                {spec}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200/60 text-gray-700 text-sm font-bold rounded-xl px-4 py-2.5 outline-none focus:border-[#1e6262] focus:ring-2 focus:ring-[#1e6262]/20 transition-all appearance-none pr-10 relative cursor-pointer shadow-sm"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")", backgroundPosition: "right 0.75rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.2em" }}
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Highest Rating</option>
              <option value="experience">Most Experienced</option>
            </select>
          </div>
        </div>

        {/* Doctor Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-200 shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-gray-100 rounded w-full"></div>
                  <div className="h-3 bg-gray-100 rounded w-5/6"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" /><path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /><path d="M16 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" /><path d="M9 16a5 5 0 0 1 6 0" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No doctors found</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">We couldn't find any specialists matching your search criteria. Try adjusting your filters or search term.</p>
            <button onClick={() => { setSearchTerm(''); setSelectedSpeciality('All'); }} className="mt-6 text-[#1e6262] font-bold text-sm hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDoctors.map(doc => (
              <div key={doc.id} className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#1e6262]/20 flex flex-col h-full transform hover:-translate-y-1">

                {/* Header: Avatar + Status + Rating */}
                <div className="flex justify-between items-start mb-5">
                  <div className="relative">
                    <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-gray-50 shadow-sm" />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${doc.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} title={doc.isOnline ? 'Online' : 'Offline'}></div>
                  </div>
                  <div className="flex items-center gap-1 bg-[#fff8e6] px-2.5 py-1 rounded-lg">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                    <span className="text-xs font-bold text-[#b45309]">{doc.rating}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="mb-4 flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-[#1e6262] transition-colors">{doc.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-[#1e6262] bg-[#e6f4f4] px-2 py-1 rounded-md">{doc.speciality}</span>
                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      {doc.experience}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                    {doc.description}
                  </p>
                </div>

                {/* CTA */}
                <button 
                  onClick={() => navigate(`/doctors/${doc.id}`)}
                  className="w-full mt-auto bg-[#f8fcfc] hover:bg-[#1e6262] text-[#1e6262] hover:text-white border border-gray-200/60 hover:border-[#1e6262] rounded-xl py-3 text-sm font-bold transition-colors duration-300 shadow-sm flex justify-center items-center gap-2"
                >
                  Book Appointment
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// chaima: speciality filter pills
