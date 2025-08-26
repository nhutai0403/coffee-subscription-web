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

  return (
    <div className="d-flex flex-column vh-100 p-3 bg-light" style={{ width: 240 }}>
      <h4 className="mb-4">Coffee Admin</h4>
      <Nav className="flex-column mb-auto">
        <Nav.Link as={NavLink} to="/dashboard" end>
          Dashboard
        </Nav.Link>
        <Nav.Link as={NavLink} to="/coffee-management">
          Coffee Items
        </Nav.Link>
        <Nav.Link as={NavLink} to="/users">
          User Management
        </Nav.Link>
        <Nav.Link as={NavLink} to="/subscriptions">
          Subscriptions
        </Nav.Link>
        <Nav.Link as={NavLink} to="/subscription-plans">
          Subscription Plans
        </Nav.Link>
        <Nav.Link as={NavLink} to="/time-windows">
          Time Windows
        </Nav.Link>
        <Nav.Link as={NavLink} to="/daily-cup-tracking">
          Daily Cup Tracking
        </Nav.Link>
      </Nav>
      <Button variant="outline-danger" className="mt-auto" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  )
}

