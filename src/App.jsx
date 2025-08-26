import { Container } from 'react-bootstrap'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import CoffeeManagement from './pages/CoffeeManagement'
import ProtectedRoute from './routes/ProtectedRoute'
import SubscriptionPlanPage from './pages/SubscriptionPlanPage';
import SubscriptionPlanDetail from './pages/SubscriptionPlanDetail';
import './App.css'

export default function App() {
  return (
    <>
      <Header />
      <Container>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/coffee-management"
            element={
              <ProtectedRoute>
                <CoffeeManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription-plans"
            element={<ProtectedRoute><SubscriptionPlanPage /></ProtectedRoute>}
          />
          <Route
            path="/subscription-plans/:id"
            element={<ProtectedRoute><SubscriptionPlanDetail /></ProtectedRoute>}
          />
          {/* Example protected route usage:
          <Route path="/account" element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          } />
          */}
        </Routes>
        <Footer />
      </Container>
    </>
  )
}
