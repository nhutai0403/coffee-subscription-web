import { Routes, Route } from 'react-router-dom'
import SignIn from './pages/SignIn'
import CoffeeManagement from './pages/CoffeeManagement'
import ProtectedRoute from './routes/ProtectedRoute'
import SubscriptionPlanPage from './pages/SubscriptionPlanPage'
import SubscriptionPlanDetail from './pages/SubscriptionPlanDetail'
import Dashboard from './pages/Dashboard'
import DashboardLayout from './components/DashboardLayout'
import UserManagement from './pages/UserManagement'
import Subscriptions from './pages/Subscriptions'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/coffee-management" element={<CoffeeManagement />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/subscription-plans" element={<SubscriptionPlanPage />} />
        <Route path="/subscription-plans/:id" element={<SubscriptionPlanDetail />} />
      </Route>
    </Routes>
  )
}
