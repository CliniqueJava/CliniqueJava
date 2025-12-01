import { Navigate, Route, Routes } from 'react-router-dom'
import HOME from './pages/HOME.jsx'
import AuthPage from './pages/auth/AuthPage.jsx'
import DoctorsPage from './pages/DoctorsPage.jsx'
import DoctorDetails from './pages/DoctorDetails.jsx'
import ChatAgent from './pages/ChatAgent.jsx'

import AdminRoute from './components/AdminRoute.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminPatients from './pages/admin/AdminPatients.jsx'
import AdminDoctors from './pages/admin/AdminDoctors.jsx'
import AdminAppointments from './pages/admin/AdminAppointments.jsx'

import DoctorRoute from './components/DoctorRoute.jsx'
import DoctorLayout from './pages/doctor/DoctorLayout.jsx'
import DoctorDashboard from './pages/doctor/DoctorDashboard.jsx'
import DoctorAppointments from './pages/doctor/DoctorAppointments.jsx'
import DoctorPatients from './pages/doctor/DoctorPatients.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HOME />} />
      <Route path="/auth/sign-in" element={<AuthPage />} />
      <Route path="/auth/sign-up" element={<AuthPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/doctors/:id" element={<DoctorDetails />} />
      <Route path="/chat-agent" element={<ChatAgent />} />
      <Route path="/auth" element={<Navigate to="/auth/sign-in" replace />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="appointments" element={<AdminAppointments />} />
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor" element={<DoctorRoute><DoctorLayout /></DoctorRoute>}>
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="appointments" element={<DoctorAppointments />} />
        <Route path="patients" element={<DoctorPatients />} />
        <Route index element={<Navigate to="/doctor/dashboard" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
