import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminPatients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentPatient, setCurrentPatient] = useState({ id: null, firstName: '', lastName: '', email: '', password: '', birthday: '' });

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8009/api/admin/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data);
    } catch (err) {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleOpenModal = (mode, patient = null) => {
    setModalMode(mode);
    if (patient) {
      setCurrentPatient({ ...patient, password: '' }); // Don't show password on edit
    } else {
      setCurrentPatient({ id: null, firstName: '', lastName: '', email: '', password: '', birthday: '' });
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
      
      if (modalMode === 'add') {
        await axios.post('http://localhost:8009/api/admin/patients', currentPatient, config);
        toast.success('Patient added successfully');
      } else {
        await axios.put(`http://localhost:8009/api/admin/patients/${currentPatient.id}`, currentPatient, config);
        toast.success('Patient updated successfully');
      }
      setIsModalOpen(false);
      fetchPatients();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8009/api/admin/patients/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Patient deleted successfully');
        fetchPatients();
      } catch (err) {
        toast.error('Failed to delete patient');
      }
    }
  };

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-96 group">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1e6262]" />
          <input 
            type="text" 
            placeholder="Search patients by name or email..." 
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
          Add Patient
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/80 text-gray-400 font-bold tracking-wider uppercase text-xs border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Birthday</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400">Loading...</td>
                </tr>
              ) : filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-400">No patients found</td>
                </tr>
              ) : (
                filteredPatients.map(patient => (
                  <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1e6262]/10 flex items-center justify-center text-[#1e6262] font-bold text-xs">
                          {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-800">{patient.firstName} {patient.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{patient.email}</td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{patient.birthday}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal('edit', patient)} className="p-2 text-gray-400 hover:text-[#1e6262] hover:bg-[#1e6262]/10 rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(patient.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="font-bold text-xl text-gray-800">
                {modalMode === 'add' ? 'Add New Patient' : 'Edit Patient'}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-800 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">First Name</label>
                  <input required type="text" value={currentPatient.firstName} onChange={e => setCurrentPatient({...currentPatient, firstName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1e6262] focus:ring-2 focus:ring-[#1e6262]/20" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Last Name</label>
                  <input required type="text" value={currentPatient.lastName} onChange={e => setCurrentPatient({...currentPatient, lastName: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1e6262] focus:ring-2 focus:ring-[#1e6262]/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email</label>
                <input required type="email" value={currentPatient.email} onChange={e => setCurrentPatient({...currentPatient, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1e6262] focus:ring-2 focus:ring-[#1e6262]/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Password {modalMode === 'edit' && '(Leave blank to keep current)'}</label>
                <input type="password" value={currentPatient.password} onChange={e => setCurrentPatient({...currentPatient, password: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1e6262] focus:ring-2 focus:ring-[#1e6262]/20" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Birthday (MM/dd/yyyy)</label>
                <input required type="text" placeholder="MM/dd/yyyy" value={currentPatient.birthday} onChange={e => setCurrentPatient({...currentPatient, birthday: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1e6262] focus:ring-2 focus:ring-[#1e6262]/20" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-[#1e6262] text-white font-bold rounded-xl hover:bg-[#154646] transition-colors text-sm shadow-md">Save Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
