import { useEffect, useState, useCallback } from 'react'
import {
  Container,
  Card,
  Table,
  Button,
  Form,
  InputGroup,
  Modal,
  Spinner,
  Alert,
  Pagination
} from 'react-bootstrap'
import { userService } from '../services/userService'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageSize = 10
  const [showAdd, setShowAdd] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
    phoneNumber: ''
  })
  const [adding, setAdding] = useState(false)

  const fetchUsers = useCallback(async (pageNum = page) => {
    try {
      setLoading(true)
      setError('')
      const data = await userService.searchUsers(searchTerm, false, pageNum, pageSize)
      setUsers(data?.pageData || [])
      setTotalPages(data?.pageInfo?.totalPages || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const data = await userService.searchUsers(searchTerm, false, 0, pageSize)
      setUsers(data?.pageData || [])
      setTotalPages(data?.pageInfo?.totalPages || 0)
      setPage(0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (id) => {
    try {
      setError('')
      const data = await userService.getUserById(id)
      setSelectedUser(data)
      setShowDetail(true)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggleActive = async (user) => {
    try {
      await userService.setUserActive(user.id, !user.isActive)
      const updated = await userService.getUserById(user.id)
      setUsers(prev => prev.map(u => (u.id === user.id ? updated : u)))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    try {
      setAdding(true)
      setError('')
      await userService.createUser(newUser)
      setShowAdd(false)
      setNewUser({ email: '', password: '', username: '', fullName: '', phoneNumber: '' })
      fetchUsers()
    } catch (err) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  return (
    <Container>
      <h2 className="mb-4">User Management</h2>

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit">Search</Button>
              <Button variant="secondary" onClick={() => { setSearchTerm(''); setPage(0); fetchUsers(0) }}>Reset</Button>
            </InputGroup>
          </Form>
          <Button className="mt-3" onClick={() => setShowAdd(true)}>Add User</Button>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Card>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>
                      <Form.Check
                        type="switch"
                        checked={user.isActive}
                        onChange={() => handleToggleActive(user)}
                      />
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => handleViewDetails(user.id)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {totalPages > 1 && (
              <Pagination className="justify-content-center">
                <Pagination.First disabled={page === 0} onClick={() => setPage(0)} />
                <Pagination.Prev disabled={page === 0} onClick={() => setPage(p => Math.max(p - 1, 0))} />
                {[...Array(totalPages)].map((_, idx) => (
                  <Pagination.Item
                    key={idx}
                    active={idx === page}
                    onClick={() => setPage(idx)}
                  >
                    {idx + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages - 1))}
                />
                <Pagination.Last
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(totalPages - 1)}
                />
              </Pagination>
            )}
          </Card.Body>
        </Card>
      )}

      <Modal show={showAdd} onHide={() => setShowAdd(false)}>
        <Form onSubmit={handleAddUser}>
          <Modal.Header closeButton>
            <Modal.Title>Add User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                value={newUser.phoneNumber}
                onChange={(e) => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={adding}>
              Add
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Modal show={showDetail} onHide={() => setShowDetail(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p><strong>ID:</strong> {selectedUser.id}</p>
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Phone:</strong> {selectedUser.phoneNumber}</p>
              <p><strong>Role:</strong> {selectedUser.role}</p>
              <p><strong>Active:</strong> {selectedUser.isActive ? 'Yes' : 'No'}</p>
              <p><strong>Created At:</strong> {selectedUser.createdAt}</p>
              <p><strong>Updated At:</strong> {selectedUser.updatedAt}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetail(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  )
}
