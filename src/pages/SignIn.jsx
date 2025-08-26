import { useState } from 'react'
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
      const redirectTo = location.state?.from || '/home'
      navigate(redirectTo)
    } catch (err) {
      setError(err?.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto" style={{ maxWidth: 420 }}>
      <Card.Body>
        <Card.Title className="mb-3">Sign In</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>
          <div className="d-grid gap-2">
            <Button type="submit" disabled={loading} variant="primary">
              {loading ? (<><Spinner size="sm" animation="border" className="me-2" />Signing in…</>) : 'Sign In'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}


