import { Nav, Button } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut()
    navigate('/')
  }

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/coffee-management', label: 'Coffee Items', icon: '☕' },
    { path: '/users', label: 'User Management', icon: '👥' },
    { path: '/subscriptions', label: 'Subscriptions', icon: '📦' },
    { path: '/subscription-plans', label: 'Subscription Plans', icon: '📋' },
    { path: '/plan-coffee-options', label: 'Plan Coffee Options', icon: '⚙️' },
    { path: '/time-windows', label: 'Time Windows', icon: '⏰' },
    { path: '/daily-cup-tracking', label: 'Daily Cup Tracking', icon: '📈' }
  ]

  return (
    <div
      className="d-flex flex-column vh-100 position-fixed top-0 start-0 shadow-lg"
      style={{ 
        width: 280,
        background: 'linear-gradient(180deg, #8B4513 0%, #A0522D 100%)',
        zIndex: 1000
      }}
    >
      {/* Header */}
      <div 
        className="text-center py-4 px-3"
        style={{ 
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <div 
          className="d-inline-flex align-items-center justify-content-center mb-2"
          style={{
            width: '60px',
            height: '60px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            fontSize: '2rem'
          }}
        >
          ☕
        </div>
        <h4 
          className="mb-0"
          style={{ 
            color: '#fff',
            fontWeight: '700',
            fontSize: '1.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          Coffee Admin
        </h4>
        <p 
          className="mb-0 mt-1"
          style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.9rem'
          }}
        >
          Management Portal
        </p>
      </div>

      {/* Navigation */}
      <Nav className="flex-column flex-grow-1 py-3">
        {menuItems.map((item, index) => (
          <Nav.Link 
            key={index}
            as={NavLink} 
            to={item.path} 
            end={item.path === '/dashboard'}
            className="text-decoration-none mx-3 mb-2"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => {
              const navLink = e.currentTarget
              if (!navLink.classList.contains('active')) {
                navLink.style.background = 'rgba(255, 255, 255, 0.1)'
                navLink.style.transform = 'translateX(5px)'
              }
            }}
            onMouseLeave={(e) => {
              const navLink = e.currentTarget
              if (!navLink.classList.contains('active')) {
                navLink.style.background = 'transparent'
                navLink.style.transform = 'translateX(0)'
              }
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span>{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>

      {/* Logout Button */}
      <div className="p-3">
        <Button 
          variant="outline-light"
          className="w-100 border-2"
          onClick={handleLogout}
          style={{
            padding: '12px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
          onMouseEnter={(e) => {
            const button = e.currentTarget
            button.style.background = 'rgba(220, 53, 69, 0.2)'
            button.style.borderColor = '#dc3545'
            button.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            const button = e.currentTarget
            button.style.background = 'rgba(255, 255, 255, 0.1)'
            button.style.borderColor = 'rgba(255, 255, 255, 0.5)'
            button.style.transform = 'translateY(0)'
          }}
        >
          🚪 Logout
        </Button>
      </div>
    </div>
  )
}

