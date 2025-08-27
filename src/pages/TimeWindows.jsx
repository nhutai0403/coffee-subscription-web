import React, { useEffect, useState } from 'react'
import {
  Container,
  Button,
  Table,
  Spinner,
  Alert,
  Modal,
  Form,
  Row,
  Col,
  Card,
  Badge
} from 'react-bootstrap'
import { timeWindowService } from '../services/timeWindowService'

const initialForm = {
  planId: '',
  startTime: '',
  endTime: '',
  description: ''
}

export default function TimeWindows() {
  const [windows, setWindows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState(initialForm)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState('')

  const [showEdit, setShowEdit] = useState(false)
  const [editForm, setEditForm] = useState(initialForm)
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')
  const [editingWindow, setEditingWindow] = useState(null)

  const [showDelete, setShowDelete] = useState(false)
  const [deletingWindow, setDeletingWindow] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    fetchWindows()
  }, [])

  const fetchWindows = async () => {
    try {
      setLoading(true)
      const data = await timeWindowService.getAll()
      setWindows(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChange = (e) => {
    const { name, value } = e.target
    setCreateForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    setCreateLoading(true)
    setCreateError('')
    try {
      await timeWindowService.create(createForm)
      setShowCreate(false)
      setCreateForm(initialForm)
      fetchWindows()
    } catch (err) {
      setCreateError(err.message)
    } finally {
      setCreateLoading(false)
    }
  }

  const openEdit = (w) => {
    setEditingWindow(w)
    setEditForm({
      planId: w.planId || '',
      startTime: w.startTime || '',
      endTime: w.endTime || '',
      description: w.description || ''
    })
    setShowEdit(true)
    setEditError('')
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    setEditError('')
    try {
      await timeWindowService.update(editingWindow.windowId, editForm)
      setShowEdit(false)
      setEditingWindow(null)
      fetchWindows()
    } catch (err) {
      setEditError(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingWindow) return
    try {
      await timeWindowService.remove(deletingWindow.windowId)
      setWindows(prev => prev.filter(window => window.windowId !== deletingWindow.windowId))
      setShowDelete(false)
      setDeletingWindow(null)
    } catch (err) {
      setDeleteError(err.message)
    }
  }

  const totalWindows = windows.length
  const activeWindows = windows.filter((w) => w.isActive !== false).length
  const weekdayWindows = windows.filter(
    (w) => w.dayOfWeek && !['Saturday', 'Sunday'].includes(w.dayOfWeek)
  ).length
  const weekendWindows = windows.filter(
    (w) => w.dayOfWeek && ['Saturday', 'Sunday'].includes(w.dayOfWeek)
  ).length

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>⏰ Time Window Management</h2>
        <div>
          <Button variant="secondary" className="me-2" onClick={fetchWindows}>
            Refresh
          </Button>
          <Button variant="primary" onClick={() => setShowCreate(true)}>
            + Add Time Window
          </Button>
        </div>
      </div>

      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-2">
          <Card>
            <Card.Body>
              <Card.Title>Total Windows</Card.Title>
              <h3>{totalWindows}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-2">
          <Card>
            <Card.Body>
              <Card.Title>Active Windows</Card.Title>
              <h3>{activeWindows}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-2">
          <Card>
            <Card.Body>
              <Card.Title>Weekday Windows</Card.Title>
              <h3>{weekdayWindows}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} className="mb-2">
          <Card>
            <Card.Body>
              <Card.Title>Weekend Windows</Card.Title>
              <h3>{weekendWindows}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th>Time Range</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {windows.map((w, idx) => (
              <tr key={w.windowId}>
                <td>{idx + 1}</td>
                <td>{w.description}</td>
                <td>
                  {w.startTime} - {w.endTime}
                </td>
                <td>{w.planId}</td>
                <td>
                  {w.isActive !== false ? (
                    <Badge bg="success">Active</Badge>
                  ) : (
                    <Badge bg="secondary">Inactive</Badge>
                  )}
                </td>
                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    className="me-2"
                    onClick={() => openEdit(w)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setDeletingWindow(w)
                      setShowDelete(true)
                      setDeleteError('')
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Create Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Time Window</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateSubmit}>
          <Modal.Body>
            {createError && <Alert variant="danger">{createError}</Alert>}
            <Form.Group className="mb-2">
              <Form.Label>Plan ID</Form.Label>
              <Form.Control
                name="planId"
                value={createForm.planId}
                onChange={handleCreateChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="startTime"
                value={createForm.startTime}
                onChange={handleCreateChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="endTime"
                value={createForm.endTime}
                onChange={handleCreateChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                value={createForm.description}
                onChange={handleCreateChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={createLoading}>
              {createLoading ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Time Window</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            {editError && <Alert variant="danger">{editError}</Alert>}
            <Form.Group className="mb-2">
              <Form.Label>Plan ID</Form.Label>
              <Form.Control
                name="planId"
                value={editForm.planId}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="startTime"
                value={editForm.startTime}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="endTime"
                value={editForm.endTime}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={editLoading}>
              {editLoading ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Time Window</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && <Alert variant="danger">{deleteError}</Alert>}
          Are you sure you want to delete this time window?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
