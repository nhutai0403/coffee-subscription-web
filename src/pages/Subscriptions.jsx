import { useEffect, useState } from 'react'
import {
  Container,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Row,
  Col
} from 'react-bootstrap'
import { userSubscriptionService } from '../services/userSubscriptionService'
import { toast } from 'react-toastify'

export default function Subscriptions() {
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [editData, setEditData] = useState({})
  const [updating, setUpdating] = useState(false)

  const fetchSubs = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await userSubscriptionService.getSubscriptions()
      setSubs(data || [])
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubs()
  }, [])

  const handleView = async (id) => {
    try {
      const data = await userSubscriptionService.getSubscriptionById(id)
      setSelected(data)
      setShowDetail(true)
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err.message)
    }
  }

  const handleEdit = async (id) => {
    try {
      const data = await userSubscriptionService.getSubscriptionById(id)
      setEditData({
        userId: data.userId,
        planId: data.planId,
        startDate: data.startDate,
        endDate: data.endDate,
        remainingCups: data.remainingCups,
        isActive: data.isActive
      })
      setSelected(data)
      setShowEdit(true)
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err.message)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      setUpdating(true)
      await userSubscriptionService.updateSubscription(selected.subscriptionId, editData)
      setShowEdit(false)
      fetchSubs()
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err.message)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return
    try {
      await userSubscriptionService.deleteSubscription(id)
      setSubs(prev => prev.filter(s => s.subscriptionId !== id))
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err.message)
    }
  }

  const totalSubscriptions = subs.length
  const activeSubscriptions = subs.filter(s => s.isActive).length
  const totalCups = subs.reduce((sum, s) => sum + (s.remainingCups || 0), 0)
  const expiringSoon = subs.filter(s => {
    if (!s.endDate) return false
    const end = new Date(s.endDate)
    const now = new Date()
    const diff = (end - now) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 7
  }).length

  return (
    <Container>
      <h2 className="mb-4">📦 Subscription Management</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row className="mb-4 g-3">
        <Col md>
          <Card>
            <Card.Body>
              <h5>Total Subscriptions</h5>
              <h3>{totalSubscriptions}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md>
          <Card>
            <Card.Body>
              <h5>Active Subscriptions</h5>
              <h3>{activeSubscriptions}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md>
          <Card>
            <Card.Body>
              <h5>Total Cups Remaining</h5>
              <h3>{totalCups}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md>
          <Card>
            <Card.Body>
              <h5>Expiring Soon</h5>
              <h3>{expiringSoon}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Plan ID</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Remaining Cups</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subs.map(s => (
                  <tr key={s.subscriptionId}>
                    <td>{s.subscriptionId}</td>
                    <td>{s.userId}</td>
                    <td>{s.planId}</td>
                    <td>{s.startDate ? new Date(s.startDate).toLocaleDateString() : ''}</td>
                    <td>{s.endDate ? new Date(s.endDate).toLocaleDateString() : ''}</td>
                    <td>{s.remainingCups}</td>
                    <td>{s.isActive ? 'Active' : 'Inactive'}</td>
                    <td>
                      <Button variant="info" size="sm" onClick={() => handleView(s.subscriptionId)} className="me-2">
                        View
                      </Button>
                      <Button variant="warning" size="sm" onClick={() => handleEdit(s.subscriptionId)} className="me-2">
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(s.subscriptionId)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showDetail} onHide={() => setShowDetail(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Subscription Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <>
              <p><strong>ID:</strong> {selected.subscriptionId}</p>
              <p><strong>User ID:</strong> {selected.userId}</p>
              <p><strong>Plan ID:</strong> {selected.planId}</p>
              <p><strong>Start Date:</strong> {selected.startDate}</p>
              <p><strong>End Date:</strong> {selected.endDate}</p>
              <p><strong>Remaining Cups:</strong> {selected.remainingCups}</p>
              <p><strong>Active:</strong> {selected.isActive ? 'Yes' : 'No'}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(false)}>Close</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Form onSubmit={handleUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Subscription</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control type="number" value={editData.userId || ''} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Plan ID</Form.Label>
              <Form.Control type="number" value={editData.planId || ''} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Start Date</Form.Label>
              <Form.Control type="text" value={editData.startDate || ''} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>End Date</Form.Label>
              <Form.Control type="text" value={editData.endDate || ''} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Remaining Cups</Form.Label>
              <Form.Control
                type="number"
                value={editData.remainingCups || 0}
                onChange={(e) => setEditData({ ...editData, remainingCups: Number(e.target.value) })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={editData.isActive || false}
                onChange={(e) => setEditData({ ...editData, isActive: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>Cancel</Button>
            <Button type="submit" disabled={updating}>Save</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}
