import React, { useEffect, useState } from 'react'
import {
  Container,
  Table,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
  Card
} from 'react-bootstrap'
import { planCoffeeOptionService } from '../services/planCoffeeOptionService'
import { toast } from 'react-toastify'

const initialForm = {
  planId: '',
  coffeeId: ''
}

export default function PlanCoffeeOption() {
  const [options, setOptions] = useState([])
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
  const [editingOption, setEditingOption] = useState(null)

  const [showDelete, setShowDelete] = useState(false)
  const [deletingOption, setDeletingOption] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    fetchOptions()
  }, [])

  const fetchOptions = async () => {
    try {
      setLoading(true)
      const data = await planCoffeeOptionService.getAll()
      setOptions(data)
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChange = (e) => {
    const { name, value } = e.target
    setCreateForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    setCreateLoading(true)
    setCreateError('')
    try {
      await planCoffeeOptionService.create({
        planId: Number(createForm.planId),
        coffeeId: Number(createForm.coffeeId)
      })
      setShowCreate(false)
      setCreateForm(initialForm)
      fetchOptions()
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setCreateError(err.message)
    } finally {
      setCreateLoading(false)
    }
  }

  const openEdit = async (optionId) => {
    try {
      const data = await planCoffeeOptionService.getById(optionId)
      setEditingOption(data)
      setEditForm({
        planId: data.planId || '',
        coffeeId: data.coffeeId || ''
      })
      setShowEdit(true)
      setEditError('')
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err.message)
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingOption) return
    setEditLoading(true)
    setEditError('')
    try {
      await planCoffeeOptionService.update(editingOption.optionId, {
        planId: Number(editForm.planId),
        coffeeId: Number(editForm.coffeeId)
      })
      setShowEdit(false)
      setEditingOption(null)
      fetchOptions()
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setEditError(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingOption) return
    try {
      await planCoffeeOptionService.remove(deletingOption.optionId)
      setOptions(prev => prev.filter(option => option.optionId !== deletingOption.optionId))
      setShowDelete(false)
      setDeletingOption(null)
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setDeleteError(err.message)
    }
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">⚙️ Plan Coffee Options</h5>
          <Button onClick={() => setShowCreate(true)}>Add Option</Button>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Table bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Plan ID</th>
                  <th>Coffee ID</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {options && options.length > 0 ? (
                  options.map((opt) => (
                    <tr key={opt.optionId}>
                      <td>{opt.optionId}</td>
                      <td>{opt.planId}</td>
                      <td>{opt.coffeeId}</td>
                      <td>{opt.isActive ? 'Yes' : 'No'}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="me-2"
                          onClick={() => openEdit(opt.optionId)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => {
                            setDeletingOption(opt)
                            setShowDelete(true)
                            setDeleteError('')
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No options found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Create Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Plan Coffee Option</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateSubmit}>
          <Modal.Body>
            {createError && <Alert variant="danger">{createError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Plan ID</Form.Label>
              <Form.Control
                name="planId"
                value={createForm.planId}
                onChange={handleCreateChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Coffee ID</Form.Label>
              <Form.Control
                name="coffeeId"
                value={createForm.coffeeId}
                onChange={handleCreateChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={createLoading}>
              {createLoading ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Plan Coffee Option</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            {editError && <Alert variant="danger">{editError}</Alert>}
            <Form.Group className="mb-3">
              <Form.Label>Plan ID</Form.Label>
              <Form.Control
                name="planId"
                value={editForm.planId}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Coffee ID</Form.Label>
              <Form.Control
                name="coffeeId"
                value={editForm.coffeeId}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={editLoading}>
              {editLoading ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Plan Coffee Option</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && <Alert variant="danger">{deleteError}</Alert>}
          Are you sure you want to delete this option?
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
