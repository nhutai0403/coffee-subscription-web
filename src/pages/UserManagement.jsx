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
  Row,
  Col,
  Dropdown
} from 'react-bootstrap'
import { userService } from '../services/userService'
import { toast } from 'react-toastify'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
    phoneNumber: ''
  })
  const [adding, setAdding] = useState(false)
  const [openRoleMenuId, setOpenRoleMenuId] = useState(null)

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const data = await userService.searchUsers(searchTerm, false, 0, 100)
      setUsers(data?.pageData || [])
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      const data = await userService.searchUsers(searchTerm, false, 0, 100)
      setUsers(data?.pageData || [])
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err.message)
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
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err.message)
    }
  }

  const handleToggleActive = async (user) => {
    try {
      await userService.setUserActive(user.id, !user.isActive)
      const updated = await userService.getUserById(user.id)
      setUsers(prev => prev.map(u => (u.id === user.id ? updated : u)))
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err.message)
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
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  const handleChangeUserRole = async (user, role) => {
    try {
      await userService.changeUserRole(user.id, role)
      toast.success('Cập nhật role thành công!')
      fetchUsers()
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else toast.error('Cập nhật role thất bại!')
    }
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>👥 User Management</h2>
          <p className="text-muted">Manage user accounts and permissions</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowAdd(true)}>
            + Add User
          </Button>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search users by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  variant="outline-secondary" 
                  onClick={() => { setSearchTerm(''); fetchUsers() }}
                >
                  🔄 Reset
                </Button>
              </InputGroup>
            </Col>
          </Row>
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
                  <th>Role</th>
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
                    <td style={{ position: 'relative' }}>
                      {user.role}
                      <button
                        style={{
                          border: '1.5px solid #F0CBAB',
                          background: '#fff',
                          color: '#222',
                          borderRadius: 8,
                          fontWeight: 500,
                          marginLeft: 8,
                          padding: '2px 14px',
                          cursor: 'pointer',
                          transition: 'background 0.2s, color 0.2s',
                        }}
                        onClick={() => setOpenRoleMenuId(openRoleMenuId === user.id ? null : user.id)}
                        onMouseOver={e => { e.target.style.background = '#F0CBAB'; e.target.style.color = '#fff'; }}
                        onMouseOut={e => { e.target.style.background = '#fff'; e.target.style.color = '#222'; }}
                      >
                        Change Role ▼
                      </button>
                      {openRoleMenuId === user.id && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            background: '#fff',
                            border: '1.5px solid #F0CBAB',
                            borderRadius: 8,
                            padding: '4px 0',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            minWidth: '120px',
                            zIndex: 1000
                          }}
                        >
                          {['Unverified', 'Member', 'Staff', 'Manager', 'Admin'].map(roleOption => (
                            <div
                              key={roleOption}
                              style={{
                                padding: '6px 16px',
                                cursor: 'pointer',
                                color: '#222',
                                fontWeight: user.role === roleOption ? 700 : 400,
                                background: user.role === roleOption ? '#F0CBAB' : 'transparent'
                              }}
                              onClick={() => {
                                handleChangeUserRole(user, roleOption)
                                setOpenRoleMenuId(null)
                              }}
                              onMouseDown={e => e.preventDefault()}
                            >
                              {roleOption}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
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
