import { useState } from 'react'
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-toastify'

export default function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      const redirectTo = location.state?.from || '/dashboard'
      navigate(redirectTo)
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err?.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      className="d-flex align-items-center justify-content-center position-relative"
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #8B4513 0%, #D2691E 50%, #F4A460 100%)',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}
    >
      {/* Coffee beans decoration */}
      <div 
        className="position-absolute coffee-bean"
        style={{
          top: '10%',
          left: '10%',
          width: '60px',
          height: '60px',
          background: '#654321',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          opacity: 0.1,
          animationDelay: '0s'
        }}
      />
      <div 
        className="position-absolute coffee-bean"
        style={{
          top: '20%',
          right: '15%',
          width: '40px',
          height: '40px',
          background: '#654321',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          opacity: 0.1,
          animationDelay: '2s'
        }}
      />
      <div 
        className="position-absolute coffee-bean"
        style={{
          bottom: '15%',
          left: '20%',
          width: '50px',
          height: '50px',
          background: '#654321',
          borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
          opacity: 0.1,
          animationDelay: '4s'
        }}
      />

      <Card 
        className="shadow-lg border-0 login-card"
        style={{ 
          maxWidth: 450, 
          width: '100%',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px'
        }}
      >
        <Card.Body className="p-5">
          {/* Coffee cup icon */}
          <div className="text-center mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center mb-3"
              style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #8B4513, #D2691E)',
                borderRadius: '50%',
                fontSize: '2.5rem'
              }}
            >
              ☕
            </div>
          </div>
          
          <Card.Title 
            className="text-center mb-2"
            style={{ 
              fontSize: '2rem',
              fontWeight: '700',
              color: '#8B4513',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Coffee Admin
          </Card.Title>
          <Card.Text 
            className="text-center mb-4"
            style={{ 
              color: '#666',
              fontSize: '1.1rem',
              fontWeight: '400'
            }}
          >
            Welcome back! Sign in to manage your coffee subscription platform
          </Card.Text>
          
          {error && (
            <Alert 
              variant="danger" 
              className="border-0"
              style={{ 
                background: 'rgba(220, 53, 69, 0.1)',
                borderRadius: '12px'
              }}
            >
              {error}
            </Alert>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="email">
              <Form.Label 
                style={{ 
                  fontWeight: '600',
                  color: '#8B4513',
                  marginBottom: '8px'
                }}
              >
                Email Address
              </Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#D2691E'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </Form.Group>
            
            <Form.Group className="mb-4" controlId="password">
              <Form.Label 
                style={{ 
                  fontWeight: '600',
                  color: '#8B4513',
                  marginBottom: '8px'
                }}
              >
                Password
              </Form.Label>
              <Form.Control 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter your password"
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid #e0e0e0',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#D2691E'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="border-0"
                style={{
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #8B4513, #D2691E)',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(139, 69, 19, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 6px 20px rgba(139, 69, 19, 0.4)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 15px rgba(139, 69, 19, 0.3)'
                  }
                }}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In ☕
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}


