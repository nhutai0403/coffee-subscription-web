import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { isAuthenticated, user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <Navbar expand="md" bg="dark" data-bs-theme="dark" className="py-3 mb-4">
      <Container>
        <Navbar.Brand as={Link} to={isAuthenticated ? '/home' : '/'}>Coffee Subscription</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
            )}
            {isAuthenticated && (
              <Nav.Link as={NavLink} to="/coffee-management">Coffee Management</Nav.Link>
            )}
            {isAuthenticated && (
              <Nav.Link as={NavLink} to="/subscription-plans">
                Subscription Plans
              </Nav.Link>
            )}
          </Nav>
          <Nav>
            {isAuthenticated ? (
              <>
                <Navbar.Text className="me-2">Signed in as: {user?.name || user?.email}</Navbar.Text>
                <Button variant="outline-light" onClick={handleSignOut}>Sign Out</Button>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/">Sign In</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}


