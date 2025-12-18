import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { createPortal } from "react-dom";

function CalendarPicker({ selectedDates, setSelectedDates }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const toggleDate = (dateStr) => {
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr].sort());
    }
  };

  const toggleWeekdayPattern = (dayOfWeek) => {
    const datesToToggle = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      if (d.getDay() === dayOfWeek) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        datesToToggle.push(dateStr);
      }
    }

    const allSelected = datesToToggle.every(d => selectedDates.includes(d));
    if (allSelected) {
      setSelectedDates(selectedDates.filter(d => !datesToToggle.includes(d)));
    } else {
      const newSelected = [...selectedDates];
      datesToToggle.forEach(d => {
        if (!newSelected.includes(d)) {
          newSelected.push(d);
        }
      });
      setSelectedDates(newSelected.sort());
    }
  };

  const clearAll = () => {
    setSelectedDates([]);
  };

  const selectWeekdays = () => {
    const datesToSelect = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const dayOfWeek = d.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        datesToSelect.push(dateStr);
      }
    }
    const newSelected = [...selectedDates];
    datesToSelect.forEach(d => {
      if (!newSelected.includes(d)) {
        newSelected.push(d);
      }
    });
    setSelectedDates(newSelected.sort());
  };

  const cells = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    cells.push({ day: i, isCurrentMonth: true });
  }

  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const weekdayFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
          <span className="text-[#1e6262] font-semibold">{monthNames[month]} {year}</span>
        </h4>
        <div className="flex gap-1">
          <button type="button" onClick={handlePrevMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button type="button" onClick={handleNextMonth} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {weekdays.map(d => <div key={d} className="py-1">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          const dateStr = cell.isCurrentMonth 
            ? `${year}-${String(month + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
            : null;
          const isSelected = dateStr && selectedDates.includes(dateStr);

          return (
            <button
              key={idx}
              type="button"
              disabled={!cell.isCurrentMonth}
              onClick={() => dateStr && toggleDate(dateStr)}
              className={`
                aspect-square flex items-center justify-center text-xs font-medium rounded-lg transition-all
                ${!cell.isCurrentMonth ? 'text-gray-300 pointer-events-none' : ''}
                ${cell.isCurrentMonth && !isSelected ? 'text-gray-700 hover:bg-[#1e6262]/10 hover:text-[#1e6262]' : ''}
                ${isSelected ? 'bg-[#1e6262] text-white shadow-sm font-bold scale-105' : ''}
              `}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-2">
        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Quick Weekly Patterns</span>
        <div className="flex flex-wrap gap-1">
          {["S", "M", "T", "W", "T", "F", "S"].map((label, idx) => {
            const datesOfThisWeekday = [];
            for (let day = 1; day <= daysInMonth; day++) {
              const d = new Date(year, month, day);
              if (d.getDay() === idx) {
                datesOfThisWeekday.push(`${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
              }
            }
            const isAllSelected = datesOfThisWeekday.length > 0 && datesOfThisWeekday.every(d => selectedDates.includes(d));

            return (
              <button
                key={idx}
                type="button"
                onClick={() => toggleWeekdayPattern(idx)}
                className={`
                  text-[10px] font-bold w-6 h-6 rounded-md flex items-center justify-center transition-all border
                  ${isAllSelected 
                    ? 'bg-[#1e6262]/10 border-[#1e6262] text-[#1e6262]' 
                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                  }
                `}
                title={`Toggle all ${weekdayFull[idx]}s`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 text-[10px] font-bold mt-2">
          <button type="button" onClick={selectWeekdays} className="text-[#1e6262] hover:underline">Select all Mon-Fri</button>
          <span className="text-gray-300">|</span>
          <button type="button" onClick={clearAll} className="text-red-500 hover:underline">Clear all</button>
        </div>
      </div>
      
      {selectedDates.length > 0 && (
        <div className="text-[11px] text-gray-500 flex flex-wrap gap-1 items-center max-h-16 overflow-y-auto pt-1">
          <span className="font-bold text-gray-400 uppercase tracking-wider block mr-1">{selectedDates.length} Selected:</span>
          {selectedDates.slice(0, 5).map(d => (
            <span key={d} className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-mono">{d.substring(5)}</span>
          ))}
          {selectedDates.length > 5 && <span className="text-[10px] text-gray-400">+{selectedDates.length - 5} more</span>}
        </div>
      )}
    </div>
  );
}

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentDoctor, setCurrentDoctor] = useState({ 
    id: null, firstName: '', lastName: '', email: '',
    speciality: '', specialtyDescription: '', price: '',
    experience: '', phone: '', availability: '', imageUrl: '',
    password: ''
  });

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8009/api/admin/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data);
    } catch (err) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenModal = (mode, doctor = null) => {
    setModalMode(mode);
    if (doctor) {
      setCurrentDoctor(doctor);
      if (doctor.availability) {
        setSelectedDates(doctor.availability.split(',').map(d => d.trim()).filter(Boolean));
      } else {
        setSelectedDates([]);
      }
    } else {
      setCurrentDoctor({ 
        id: null, firstName: '', lastName: '', email: '',
        speciality: '', specialtyDescription: '', price: '',
        experience: '', phone: '', availability: '', imageUrl: '',
        password: ''
      });
      setSelectedDates([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Build availability string from selected dates
      const availabilityString = selectedDates.join(',');
      
      const payload = {
        ...currentDoctor,
        availability: availabilityString,
        price: parseFloat(currentDoctor.price)
      };
      
      if (modalMode === 'add') {
        await axios.post('http://localhost:8009/api/admin/doctors', payload, config);
        toast.success('Doctor added successfully');
      } else {
        await axios.put(`http://localhost:8009/api/admin/doctors/${currentDoctor.id}`, payload, config);
        toast.success('Doctor updated successfully');
      }
      setIsModalOpen(false);
      fetchDoctors();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8009/api/admin/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Doctor deleted successfully');
        fetchDoctors();
      } catch (err) {
        toast.error('Failed to delete doctor');
      }
    }
  };

  const filteredDoctors = doctors.filter(d => 
    `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1e6262] focus:ring-2 focus:ring-[#1e6262]/20";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1";

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-96 group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e6262]" />
          <input 
            type="text" 
            placeholder="Search doctors by name or speciality..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1e6262]/20 transition-all"
          />
        </div>
        <button 
          onClick={() => handleOpenModal('add')}
          className="flex items-center gap-2 bg-[#1e6262] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:bg-[#154646] hover:shadow-lg transition-all shrink-0"
        >
          <Plus size={18} />
          Add Doctor
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/80 text-gray-400 font-bold tracking-wider uppercase text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Speciality</th>
                <th className="px-6 py-4">Experience</th>
                <th className="px-6 py-4">Availability</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">Loading...</td>
                </tr>
              ) : filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-400">No doctors found</td>
                </tr>
              ) : (
                filteredDoctors.map(doctor => (
                  <tr key={doctor.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {doctor.imageUrl ? (
                          <img src={doctor.imageUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#1e6262]/10 flex items-center justify-center text-[#1e6262] font-bold text-sm">
                            {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-gray-800 block">Dr. {doctor.firstName} {doctor.lastName}</span>
                          <span className="text-xs text-gray-500">{doctor.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-xs font-bold">{doctor.speciality}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{doctor.experience}</td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 font-medium">{doctor.availability || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal('edit', doctor)} className="p-2 text-gray-400 hover:text-[#1e6262] hover:bg-[#1e6262]/10 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(doctor.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in pointer-events-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden transform transition-all flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 shrink-0">
              <h3 className="font-bold text-xl text-gray-800">
                {modalMode === 'add' ? 'Add New Doctor' : 'Edit Doctor'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-800 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-6">
              <form id="doctorForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input required type="text" value={currentDoctor.firstName} onChange={e => setCurrentDoctor({...currentDoctor, firstName: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input required type="text" value={currentDoctor.lastName} onChange={e => setCurrentDoctor({...currentDoctor, lastName: e.target.value})} className={inputClass} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Email</label>
                    <input required type="email" value={currentDoctor.email} onChange={e => setCurrentDoctor({...currentDoctor, email: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Experience</label>
                    <input type="text" placeholder="e.g. 15 years" value={currentDoctor.experience} onChange={e => setCurrentDoctor({...currentDoctor, experience: e.target.value})} className={inputClass} />
                  </div>
                </div>

                {/* Password — required on Add, optional on Edit */}
                <div>
                  <label className={labelClass}>
                    Password {modalMode === 'edit' && <span className="text-gray-400 font-normal normal-case">(leave blank to keep current)</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required={modalMode === 'add'}
                      minLength={6}
                      placeholder={modalMode === 'add' ? 'Min. 6 characters' : '••••••••'}
                      value={currentDoctor.password}
                      onChange={e => setCurrentDoctor({...currentDoctor, password: e.target.value})}
                      className={inputClass}
                      autoComplete="new-password"
                    />
                    {modalMode === 'add' && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#1e6262] bg-[#ecfffb] px-2 py-0.5 rounded-full border border-[#1e6262]/20">
                        BCrypt encrypted
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className={labelClass}>Specialty</label>
                     <select required value={currentDoctor.speciality} onChange={e => setCurrentDoctor({...currentDoctor, speciality: e.target.value})} className={inputClass}>
                       <option value="" disabled>Select specialty</option>
                       <option value="CARDIOLOGY">Cardiology</option>
                       <option value="DERMATOLOGY">Dermatology</option>
                       <option value="PEDIATRICS">Pediatrics</option>
                       <option value="NEUROLOGY">Neurology</option>
                       <option value="GENERAL_MEDICINE">General Medicine</option>
                     </select>
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input type="text" value={currentDoctor.phone} onChange={e => setCurrentDoctor({...currentDoctor, phone: e.target.value})} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                     <label className={labelClass}>Price (USD)</label>
                     <input required type="number" min="0" step="0.01" placeholder="e.g. 150" value={currentDoctor.price} onChange={e => setCurrentDoctor({...currentDoctor, price: e.target.value})} className={inputClass} />
                  </div>
                  <div className="col-span-2">
                     <label className={labelClass}>Availability Calendar</label>
                     <CalendarPicker selectedDates={selectedDates} setSelectedDates={setSelectedDates} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Specialty Description</label>
                  <textarea value={currentDoctor.specialtyDescription} onChange={e => setCurrentDoctor({...currentDoctor, specialtyDescription: e.target.value})} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Image URL (Avatar)</label>
                  <input type="url" placeholder="https://..." value={currentDoctor.imageUrl} onChange={e => setCurrentDoctor({...currentDoctor, imageUrl: e.target.value})} className={inputClass} />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 shrink-0">
              <button type="button" onClick={handleCloseModal} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">Cancel</button>
              <button type="submit" form="doctorForm" className="flex-1 py-3 bg-[#1e6262] text-white font-bold rounded-xl hover:bg-[#154646] transition-colors text-sm shadow-md">Save Doctor</button>
            </div>
          </div>
        </div>
      , document.body)}
    </div>
  );
}

// chaima: calendar picker for availability
