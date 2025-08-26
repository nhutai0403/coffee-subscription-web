import React, { useEffect, useState } from 'react'
import { Container, Button, Table, Spinner, Alert, Modal, Form } from 'react-bootstrap'
import { dailyCupTrackingService } from '../services/dailyCupTrackingService'

const initialForm = {
  subscriptionId: '',
  date: '',
  cupsTaken: ''
}

export default function DailyCupTracking() {
  const [trackings, setTrackings] = useState([])
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
  const [editing, setEditing] = useState(null)

  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    fetchTrackings()
  }, [])

  const fetchTrackings = async () => {
    try {
      setLoading(true)
      const data = await dailyCupTrackingService.getAll()
      setTrackings(data)
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
      await dailyCupTrackingService.create(createForm)
      setShowCreate(false)
      setCreateForm(initialForm)
      fetchTrackings()
    } catch (err) {
      setCreateError(err.message)
    } finally {
      setCreateLoading(false)
    }
  }

  const openEdit = (item) => {
    setEditing(item)
    setEditForm({
      subscriptionId: item.subscriptionId,
      date: item.date,
      cupsTaken: item.cupsTaken
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
      await dailyCupTrackingService.update(editing.trackingId, editForm)
      setShowEdit(false)
      setEditing(null)
      fetchTrackings()
    } catch (err) {
      setEditError(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  const openDelete = (item) => {
    setDeleting(item)
    setDeleteError('')
    setShowDelete(true)
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await dailyCupTrackingService.remove(deleting.trackingId)
      setShowDelete(false)
      setDeleting(null)
      fetchTrackings()
    } catch (err) {
      setDeleteError(err.message)
    }
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Daily Cup Tracking</h2>
        <Button onClick={() => setShowCreate(true)}>Add Tracking</Button>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Subscription ID</th>
              <th>Date</th>
              <th>Cups Taken</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trackings.length > 0 ? (
              trackings.map((t) => (
                <tr key={t.trackingId}>
                  <td>{t.trackingId}</td>
                  <td>{t.subscriptionId}</td>
                  <td>{t.date}</td>
                  <td>{t.cupsTaken}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => openEdit(t)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => openDelete(t)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
                  No records
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Create Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Tracking</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateSubmit}>
          <Modal.Body>
            {createError && <Alert variant="danger">{createError}</Alert>}
            <Form.Group className="mb-2">
              <Form.Label>Subscription ID</Form.Label>
              <Form.Control
                name="subscriptionId"
                value={createForm.subscriptionId}
                onChange={handleCreateChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={createForm.date}
                onChange={handleCreateChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cups Taken</Form.Label>
              <Form.Control
                type="number"
                name="cupsTaken"
                value={createForm.cupsTaken}
                onChange={handleCreateChange}
                required
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
          <Modal.Title>Edit Tracking</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            {editError && <Alert variant="danger">{editError}</Alert>}
            <Form.Group className="mb-2">
              <Form.Label>Subscription ID</Form.Label>
              <Form.Control
                name="subscriptionId"
                value={editForm.subscriptionId}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={editForm.date}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Cups Taken</Form.Label>
              <Form.Control
                type="number"
                name="cupsTaken"
                value={editForm.cupsTaken}
                onChange={handleEditChange}
                required
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
          <Modal.Title>Delete Tracking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && <Alert variant="danger">{deleteError}</Alert>}
          Are you sure you want to delete this tracking?
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
