import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { doctorService } from '../services/doctorService';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Star, 
  Award, 
  ArrowLeft, 
  Check, 
  Bell, 
  Share2 
} from 'lucide-react';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  
  // Reservation Form State
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  // Slots and Booking State
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enableReminders, setEnableReminders] = useState(true);

  // Fetch doctor profile
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const data = await doctorService.getDoctorById(id);
        setDoctor(data);
      } catch (err) {
        console.error("Failed to load doctor profile:", err);
        setDoctor(null);
        toast.error("Could not load doctor details from the database.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, [id]);

  // Fetch available slots when date changes
  useEffect(() => {
    if (!date) {
      setAvailableSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        setLoadingSlots(true);
        const slots = await doctorService.getDoctorAvailability(id, date);
        setAvailableSlots(slots);
      } catch (err) {
        console.error("Failed to fetch slots:", err);
        const baseSlots = doctor?.availability 
          ? doctor.availability.split(',').map(s => s.trim()) 
          : [];
        setAvailableSlots(baseSlots);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [date, id, doctor]);

  // Open reservation modal
  const handleOpenBooking = () => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to book an appointment.", {
        position: "top-center",
        autoClose: 3000
      });
      // Redirect to login page and preserve redirect state
      navigate('/auth/sign-in', { state: { from: `/doctors/${id}` } });
      return;
    }
    setIsModalOpen(true);
  };

  // Submit Booking Form
  const handleBooking = async (e) => {
    e.preventDefault();
    
    // Front-end Required Field Validation
    if (!address || !phone || !date || !time) {
      toast.error("Please fill all required fields to complete the reservation.");
      return;
    }

    const appointmentTime = `${date}T${time}:00`;
    
    setIsSubmitting(true);
    try {
      await doctorService.bookAppointment({
        doctorId: parseInt(id, 10),
        appointmentTime,
        durationMinutes: duration,
        address,
        phone,
        notes
      });
      
      // Close booking modal, open success dialog
      setIsModalOpen(false);
      setIsSuccessOpen(true);
      toast.success("Appointment booked successfully!");

    } catch (error) {
      console.error("Booking failed:", error);
      if (error.response && error.response.data) {
        // Backend specific error messages
        const errMsg = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.error || "An error occurred while booking.";
        toast.error(errMsg);
      } else {
        toast.error("An error occurred while booking the appointment. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate and download local .ics file
  const handleCalendarExport = () => {
    if (!date || !time || !doctor) return;
    
    const [year, month, day] = date.split('-');
    const [hour, min] = time.split(':');
    
    const startDt = new Date(year, month - 1, day, hour, min);
    const endDt = new Date(startDt.getTime() + duration * 60000);
    
    const formatICSDate = (dateObj) => {
      return dateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const icsString = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Clinique App//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@clinique.com`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(startDt)}`,
      `DTEND:${formatICSDate(endDt)}`,
      `SUMMARY:Appointment with Dr. ${doctor.firstName} ${doctor.lastName}`,
      `DESCRIPTION:Clinic appointment reservation with Dr. ${doctor.lastName} (${doctor.speciality}). Notes: ${notes || 'None'}`,
      'LOCATION:Clinique Medical Center - 123 Healthcare Blvd',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
    
    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Dr_${doctor.lastName}_Appointment.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("ICS Calendar event downloaded successfully!");
  };

  // Reset booking form and close success modal
  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
    setDate('');
    setTime('');
    setAddress('');
    setPhone('');
    setNotes('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fcfc] via-[#ecfffb]/30 to-[#f8fcfc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-6xl mx-auto animate-pulse">
          {/* Breadcrumb skeleton */}
          <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column skeleton */}
            <div className="lg:col-span-2 space-y-8">
              {/* Doctor info card skeleton */}
              <div className="bg-white rounded-[2.5rem] shadow-soft border border-gray-100/60 p-6 sm:p-10">
                <div className="flex flex-col sm:flex-row gap-8 items-start">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] bg-gray-200 shrink-0 mx-auto sm:mx-0"></div>
                  <div className="flex-1 space-y-4 text-center sm:text-left w-full">
                    <div className="flex gap-3 justify-center sm:justify-start">
                      <div className="h-6 bg-gray-200 rounded-xl w-24"></div>
                      <div className="h-6 bg-gray-200 rounded-xl w-16"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto sm:mx-0"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto sm:mx-0"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Slots card skeleton */}
              <div className="bg-white rounded-[2.5rem] shadow-soft border border-gray-100/60 p-6 sm:p-10 space-y-6">
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-10 bg-gray-200 rounded-2xl w-20"></div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-[2.5rem] shadow-soft border border-gray-100/60 p-8 space-y-6 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                <div className="border-t border-b border-gray-100 py-4 space-y-3">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
                <div className="h-14 bg-gray-200 rounded-2xl w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fcfc]">
        <div className="text-center p-8 bg-white shadow-soft rounded-3xl border border-gray-100 max-w-sm">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Doctor Not Found</h2>
          <p className="text-gray-500 text-sm mb-6">The specialist you are looking for does not exist or has been removed.</p>
          <button onClick={() => navigate('/doctors')} className="w-full bg-[#1e6262] text-white py-3 rounded-xl font-bold text-sm">
            Back to Doctors
          </button>
        </div>
      </div>
    );
  }

  // Availability is always a list of dates (YYYY-MM-DD)
  const availableDays = doctor.availability
    ? doctor.availability.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fcfc] via-[#ecfffb]/30 to-[#f8fcfc] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <button 
          onClick={() => navigate('/doctors')} 
          className="mb-8 group flex items-center gap-2 text-[#1e6262] hover:text-[#2d767f] font-semibold text-sm transition-all"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Specialists
        </button>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Doctor Profile card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] shadow-soft border border-gray-100/60 p-6 sm:p-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#ecfffb] rounded-full translate-x-12 -translate-y-12 -z-10"></div>
              
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                {/* Avatar */}
                <div className="relative shrink-0 mx-auto sm:mx-0">
                  <img 
                    src={doctor.imageUrl || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop"} 
                    alt={`Dr. ${doctor.lastName}`} 
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] object-cover ring-8 ring-[#ecfffb] shadow-md"
                  />
                  <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-green-500 border-4 border-white" title="Online now"></div>
                </div>

                {/* Main Details */}
                <div className="flex-1 space-y-4 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                    <span className="bg-[#1e6262]/10 text-[#1e6262] px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                      {doctor.speciality}
                    </span>
                    <div className="flex items-center gap-1 bg-[#fff8e6] px-3 py-1 rounded-xl shadow-sm border border-amber-100">
                      <Star size={14} className="fill-[#f59e0b] stroke-[#f59e0b]" />
                      <span className="text-xs font-extrabold text-[#b45309]">{doctor.rating || "4.8"}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h1>
                    <p className="text-gray-400 text-sm font-semibold mt-1 flex items-center justify-center sm:justify-start gap-1">
                      <Award size={16} className="text-[#2d767f]" />
                      {doctor.experience} of Clinical Practice
                    </p>
                  </div>

                  <p className="text-gray-500 leading-relaxed text-sm md:text-base font-normal max-w-xl">
                    {doctor.description || "Dedicated medical professional committed to providing the highest quality of healthcare services with personalized care and advanced treatments."}
                  </p>
                </div>
              </div>
            </div>

            {/* General Availability Card */}
            <div className="bg-white rounded-[2.5rem] shadow-soft border border-gray-100/60 p-6 sm:p-10 space-y-6">
              <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                <Calendar className="text-[#1e6262]" size={22} />
                Available Days
              </h2>
              <p className="text-sm text-gray-400">
                Select one of Dr. {doctor.lastName}'s available dates below to book a consultation.
                Each day offers slots from 09:00 to 16:00.
              </p>

              {availableDays.length === 0 ? (
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                  <AlertCircle size={16} />
                  No available dates configured for this doctor yet.
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {availableDays.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-[#f8fcfc] border border-gray-100 px-4 py-2.5 rounded-2xl shadow-sm hover:border-[#1e6262]/30 transition-all font-semibold text-gray-600 text-sm"
                    >
                      <Calendar size={14} className="text-[#2d767f]" />
                      {day}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Premium Booking Action Box */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] shadow-soft border border-gray-100/60 p-8 space-y-6 sticky top-8 text-center">
              <div className="w-16 h-16 bg-[#ecfffb] text-[#1e6262] rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                <Calendar size={28} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-gray-800">Instant Consultation</h3>
                <p className="text-gray-400 text-xs mt-1">Book a premium session and receive real-time SMS & Email confirmations.</p>
              </div>

              <div className="border-t border-b border-gray-100 py-4 space-y-3.5 text-left text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Session Fee:</span>
                  <span className="font-bold text-gray-800">$120.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Available Days:</span>
                  <span className="font-bold text-[#1e6262] bg-[#ecfffb] px-2 py-0.5 rounded-lg text-xs">Mon - Fri</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium">Instant Booking:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                    <Check size={14} /> Active
                  </span>
                </div>
              </div>

              {/* Animated Booking Trigger Button */}
              <motion.button 
                whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(30, 98, 98, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenBooking}
                className="w-full bg-gradient-to-r from-[#1e6262] to-[#2d767f] text-white py-4.5 rounded-2xl text-base font-bold shadow-lg shadow-[#1e6262]/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Book Appointment</span>
                <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Pop-up Reservation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e6262]/40 backdrop-blur-md overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden my-8 border border-white/60 relative"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-[#1e6262] to-[#2d767f] p-6 sm:p-8 flex justify-between items-center text-white relative">
                <div>
                  <span className="text-xs font-bold tracking-wider text-[#b4f1f1] uppercase">Reservation Form</span>
                  <h2 className="text-2xl font-black mt-1">Book Consultation</h2>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-white hover:text-[#b4f1f1] transition rounded-full p-2 bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Form Content */}
              <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
                
                {/* Doctor Preview block */}
                <div className="flex items-center gap-4 bg-[#f8fcfc] p-4.5 rounded-[1.75rem] border border-[#1e6262]/10 shadow-inner">
                  <img 
                    src={doctor.imageUrl || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400&auto=format&fit=crop"} 
                    alt="Doctor" 
                    className="w-14 h-14 rounded-2xl object-cover shadow-sm ring-2 ring-white" 
                  />
                  <div>
                    <h3 className="font-extrabold text-gray-800 text-base">Dr. {doctor.firstName} {doctor.lastName}</h3>
                    <p className="text-[#2d767f] text-xs font-bold">{doctor.speciality} • {doctor.experience} exp</p>
                  </div>
                </div>

                <form onSubmit={handleBooking} className="space-y-6">
                  
                  {/* Step 1: Personal Info Confirmation */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">1. Contact & Location Confirmation</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <Phone size={14} className="text-[#2d767f]" /> Mobile Phone *
                        </label>
                        <input 
                          type="tel" 
                          required
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full p-3.5 rounded-xl border border-gray-200 bg-[#f8fcfc]/40 font-semibold text-gray-700 text-sm focus:border-[#1e6262] focus:ring-4 focus:ring-[#1e6262]/5 outline-none transition"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <MapPin size={14} className="text-[#2d767f]" /> Physical Address *
                        </label>
                        <input 
                          type="text" 
                          required
                          placeholder="Street Address, City, Zip"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full p-3.5 rounded-xl border border-gray-200 bg-[#f8fcfc]/40 font-semibold text-gray-700 text-sm focus:border-[#1e6262] focus:ring-4 focus:ring-[#1e6262]/5 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Date & Slot Selection */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase text-gray-400 tracking-wider">2. Schedule Details</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Date selection — only available days */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <Calendar size={14} className="text-[#2d767f]" /> Select Date *
                        </label>
                        {availableDays.length === 0 ? (
                          <div className="w-full p-3.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 text-xs font-semibold">
                            No available dates for this doctor.
                          </div>
                        ) : (
                          <select
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-3.5 rounded-xl border border-gray-200 bg-[#f8fcfc]/40 font-semibold text-gray-700 text-sm focus:border-[#1e6262] focus:ring-4 focus:ring-[#1e6262]/5 outline-none transition cursor-pointer"
                          >
                            <option value="">— Choose a date —</option>
                            {availableDays
                              .filter(d => d >= new Date().toISOString().split('T')[0])
                              .map(d => (
                                <option key={d} value={d}>{d}</option>
                              ))
                            }
                          </select>
                        )}
                      </div>

                      {/* Duration selector */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <Clock size={14} className="text-[#2d767f]" /> Session Duration
                        </label>
                        <select 
                          value={duration}
                          onChange={(e) => setDuration(parseInt(e.target.value))}
                          className="w-full p-3.5 rounded-xl border border-gray-200 bg-[#f8fcfc]/40 font-semibold text-gray-700 text-sm focus:border-[#1e6262] focus:ring-4 focus:ring-[#1e6262]/5 outline-none transition cursor-pointer"
                        >
                          <option value={15}>15 Minutes (Brief Checkup)</option>
                          <option value={30}>30 Minutes (Standard Consultation)</option>
                          <option value={45}>45 Minutes (Detailed Examination)</option>
                          <option value={60}>60 Minutes (Comprehensive Review)</option>
                        </select>
                      </div>
                    </div>

                    {/* Real-time Time Slots grid */}
                    {date && (
                      <div className="space-y-2 mt-4 animate-fadeIn">
                        <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                          <Clock size={14} className="text-[#2d767f]" /> Available Slots for {date} *
                        </label>
                        
                        {loadingSlots ? (
                          <div className="flex items-center gap-2 py-3">
                            <div className="w-4 h-4 border-2 border-[#1e6262] border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-xs text-gray-400">Querying real-time slot registry...</span>
                          </div>
                        ) : availableSlots.length === 0 ? (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-xs flex gap-2 items-center">
                            <AlertCircle size={16} />
                            No consultation intervals available on this date. Please choose another date.
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 pt-1.5">
                            {availableSlots.map((slot) => {
                              const isSelected = time === slot;
                              return (
                                <button
                                  type="button"
                                  key={slot}
                                  onClick={() => setTime(slot)}
                                  className={`p-3 rounded-xl border transition-all text-xs font-extrabold cursor-pointer ${
                                    isSelected 
                                      ? 'bg-[#1e6262] text-white border-[#1e6262] shadow-md shadow-[#1e6262]/10 scale-105' 
                                      : 'bg-[#f8fcfc]/60 text-gray-600 border-gray-200 hover:border-[#1e6262] hover:bg-[#ecfffb]'
                                  }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Step 3: Special Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
                      <FileText size={14} className="text-[#2d767f]" /> Special Notes or Symptoms (Optional)
                    </label>
                    <textarea 
                      rows="3"
                      placeholder="Add any current symptoms, relevant medical history, or specific requests for the specialist here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3.5 rounded-xl border border-gray-200 bg-[#f8fcfc]/40 font-semibold text-gray-700 text-sm focus:border-[#1e6262] focus:ring-4 focus:ring-[#1e6262]/5 outline-none transition resize-none"
                    ></textarea>
                  </div>

                  {/* Form Actions */}
                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <input 
                        type="checkbox" 
                        id="reminders" 
                        checked={enableReminders}
                        onChange={(e) => setEnableReminders(e.target.checked)}
                        className="rounded border-gray-300 text-[#1e6262] focus:ring-[#1e6262] w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="reminders" className="text-xs font-semibold text-gray-500 flex items-center gap-1 select-none cursor-pointer">
                        <Bell size={12} /> Enable SMS & email reminders
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
                      <button 
                        type="button" 
                        onClick={() => setIsModalOpen(false)}
                        className="px-5 py-3 text-gray-400 font-bold hover:bg-[#f8fcfc] rounded-xl transition text-sm cursor-pointer"
                      >
                        Cancel
                      </button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting || (date && !time)}
                        className={`px-8 py-3.5 rounded-xl text-white font-extrabold text-sm flex items-center gap-2 shadow-md transition cursor-pointer ${
                          isSubmitting || (date && !time) 
                            ? 'bg-[#1e6262]/50 cursor-not-allowed shadow-none' 
                            : 'bg-[#1e6262] hover:bg-[#2d767f]'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Securing Slot...
                          </>
                        ) : (
                          <>
                            <CheckCircle size={18} />
                            Confirm Booking
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Popup Screen */}
      <AnimatePresence>
        {isSuccessOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1e6262]/50 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.85, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 40 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8 border border-white text-center space-y-6"
            >
              {/* Success Tick Animation */}
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner relative animate-[pulse_2s_infinite]">
                <CheckCircle size={44} className="stroke-[2.5]" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-800">Appointment booked successfully</h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto">
                  Your reservation with <strong className="text-gray-700">Dr. {doctor.firstName} {doctor.lastName}</strong> is confirmed. A summary with coordinates has been registered.
                </p>
              </div>

              {/* Appointment summary block */}
              <div className="bg-[#f8fcfc] p-4.5 rounded-2xl border border-gray-100 text-left text-xs space-y-2.5">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Specialist:</span>
                  <span className="font-extrabold text-gray-700">Dr. {doctor.lastName}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Date:</span>
                  <span className="font-extrabold text-gray-700">{date}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Time Slot:</span>
                  <span className="font-extrabold text-[#1e6262] bg-[#ecfffb] px-2 py-0.5 rounded-md font-mono">{time}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Duration:</span>
                  <span className="font-extrabold text-gray-700">{duration} minutes</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-2">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCalendarExport}
                  className="w-full bg-[#1e6262] hover:bg-[#2d767f] text-white py-3.5 rounded-xl text-sm font-extrabold shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar size={16} /> Add to Calendar (.ics)
                </motion.button>
                
                <button 
                  onClick={handleCloseSuccess}
                  className="w-full bg-gray-50 hover:bg-gray-100 text-gray-500 py-3 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  Close & Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorDetails;
