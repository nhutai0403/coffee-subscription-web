import { useState } from 'react'
import { Form, Button, Card, Alert, Spinner, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }
    
    setLoading(true)
    try {
      await signUp(name, email, password)
      setSuccess('Account created successfully! Redirecting...')
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      setError(err?.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto" style={{ maxWidth: 520 }}>
      <Card.Body>
        <Card.Title className="mb-3">Create your account</Card.Title>
        
        <Alert variant="info" className="mb-3">
          <strong>Note:</strong> Sign up is now available! Create your account to get started.
        </Alert>
        
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Name</Form.Label>
                              <Form.Control 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="Your name"
              />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="you@example.com"
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                />
                <Form.Text className="text-muted">
                  Password must be at least 6 characters long
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="d-grid gap-2">
            <Button type="submit" disabled={loading} variant="primary">
              {loading ? (<><Spinner size="sm" animation="border" className="me-2" />Creating account…</>) : 'Create Account'}
            </Button>
          </div>
        </Form>
        <div className="mt-3">
          Already have an account? <Link to="/signin">Sign in</Link>
        </div>
      </Card.Body>
    </Card>
  )
}


