import { useState, useEffect, useCallback } from 'react'
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  InputGroup, 
  Badge, 
  Modal,
  Alert,
  Spinner,
  Image
} from 'react-bootstrap'
import { coffeeService } from '../services/coffeeService'

export default function CoffeeManagement() {
  const [coffeeItems, setCoffeeItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCoffee, setSelectedCoffee] = useState(null)
  const [editForm, setEditForm] = useState({
    categoryId: '',
    coffeeName: '',
    description: '',
    code: '',
    isActive: true,
    imageUrl: ''
  })
  const [editLoading, setEditLoading] = useState(false)
  const [createForm, setCreateForm] = useState({
    categoryId: '',
    coffeeName: '',
    description: '',
    code: '',
    isActive: true,
    imageUrl: ''
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [createLoading, setCreateLoading] = useState(false)

  // Fetch coffee items on component mount
  useEffect(() => {
    fetchCoffeeItems()
  }, [])

  const filterItems = useCallback(() => {
    let filtered = coffeeItems

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.coffeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.categoryId.toString() === categoryFilter)
    }

    setFilteredItems(filtered)
  }, [coffeeItems, searchTerm, categoryFilter])

  // Filter items when search or category changes
  useEffect(() => {
    filterItems()
  }, [filterItems])

  const fetchCoffeeItems = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await coffeeService.getAllCoffeeItems()
      setCoffeeItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  

  const handleEdit = (coffee) => {
    setSelectedCoffee(coffee)
    setEditForm({
      categoryId: coffee.categoryId || '',
      coffeeName: coffee.coffeeName || '',
      description: coffee.description || '',
      code: coffee.code || '',
      isActive: coffee.isActive !== undefined ? coffee.isActive : true,
      imageUrl: coffee.imageUrl || ''
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCoffee) return

    try {
      setEditLoading(true)
      setError('')
      
      // Prepare data for API call
      const updateData = {
        categoryId: parseInt(editForm.categoryId) || null,
        coffeeName: editForm.coffeeName || null,
        description: editForm.description || null,
        code: editForm.code || null,
        isActive: editForm.isActive,
        imageUrl: editForm.imageUrl || null
      }

      await coffeeService.updateCoffeeItem(selectedCoffee.coffeeId, updateData)
      
      // Update local state
      setCoffeeItems(prev => prev.map(item => 
        item.coffeeId === selectedCoffee.coffeeId 
          ? { ...item, ...updateData }
          : item
      ))
      
      setShowEditModal(false)
      setSelectedCoffee(null)
      setEditForm({
        categoryId: '',
        coffeeName: '',
        description: '',
        code: '',
        isActive: true,
        imageUrl: ''
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setEditLoading(false)
    }
  }

  const handleCreate = () => {
    setCreateForm({
      categoryId: '',
      coffeeName: '',
      description: '',
      code: '',
      isActive: true,
      imageUrl: ''
    })
    setSelectedImage(null)
    setShowCreateModal(true)
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()

    try {
      setCreateLoading(true)
      setError('')
      
      // Prepare data for API call - ensure proper data types
      const createData = {
        categoryId: createForm.categoryId ? parseInt(createForm.categoryId) : null,
        coffeeName: createForm.coffeeName.trim() || null,
        description: createForm.description.trim() || null,
        code: createForm.code.trim() || null,
        isActive: createForm.isActive,
        imageUrl: createForm.imageUrl.trim() || null
      }
      
      // Validate required fields
      if (!createData.categoryId) {
        throw new Error('Category is required')
      }
      if (!createData.coffeeName) {
        throw new Error('Coffee name is required')
      }
      if (!createData.code) {
        throw new Error('Code is required')
      }

      // Upload image first if selected
      let imageUrl = ''
      if (selectedImage) {
        try {
          const uploadResult = await coffeeService.uploadCoffeeImage(selectedImage)
          imageUrl = uploadResult.url || uploadResult.imageUrl || uploadResult.path || ''
          console.log('Image uploaded successfully:', imageUrl)
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError)
          // Continue with coffee creation even if image upload fails
        }
      }

      // Create coffee item with image URL
      const coffeeDataWithImage = {
        ...createData,
        image: imageUrl
      }
      
      const newCoffee = await coffeeService.createCoffeeItem(coffeeDataWithImage)
      
      // Add new coffee to local state
      setCoffeeItems(prev => [...prev, newCoffee])
      
      setShowCreateModal(false)
      setCreateForm({
        categoryId: '',
        coffeeName: '',
        description: '',
        code: '',
        isActive: true,
        imageUrl: ''
      })
      setSelectedImage(null)
    } catch (err) {
      // Format validation errors for better display
      if (err.message.includes('Validation errors:')) {
        setError(err.message.replace('Validation errors:\n', 'Validation errors:\n• ').replace(/\n/g, '\n• '))
      } else {
        setError(err.message)
      }
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedCoffee) return

    try {
      await coffeeService.deleteCoffeeItem(selectedCoffee.coffeeId)
      setCoffeeItems(prev => prev.filter(item => item.coffeeId !== selectedCoffee.coffeeId))
      setShowDeleteModal(false)
      setSelectedCoffee(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const getCategoryName = (categoryId) => {
    const categories = {
      1: 'Vietnamese Coffee',
      2: 'Espresso',
      3: 'Cold Brew'
    }
    return categories[categoryId] || `Category ${categoryId}`
  }

  const getStatusBadge = (isActive) => {
    return isActive ? (
      <Badge bg="success">Active</Badge>
    ) : (
      <Badge bg="secondary">Inactive</Badge>
    )
  }

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading coffee items...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>☕ Coffee Items Management</h2>
          <p className="text-muted">Manage your coffee menu and inventory</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary" size="sm" onClick={handleCreate}>
            + Add New Coffee
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <div style={{ whiteSpace: 'pre-line' }}>
            {error}
          </div>
        </Alert>
      )}

      {/* Search and Filter Controls */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>🔍</InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, description, or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="1">Vietnamese Coffee</option>
                <option value="2">Espresso</option>
                <option value="3">Cold Brew</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button 
                variant="outline-secondary" 
                onClick={fetchCoffeeItems}
                size="sm"
              >
                🔄 Refresh
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Results Summary */}
      <div className="mb-3">
        <small className="text-muted">
          Showing {filteredItems.length} of {coffeeItems.length} coffee items
        </small>
      </div>

      {/* Coffee Items Table */}
      <Card>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="table-dark">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Code</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <p className="text-muted mb-0">No coffee items found</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((coffee) => (
                  <tr key={coffee.coffeeId}>
                    <td>
                      {coffee.imageUrl && coffee.imageUrl !== 'string' ? (
                        <Image
                          src={coffee.imageUrl}
                          alt={coffee.coffeeName}
                          width="50"
                          height="50"
                          className="rounded"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div 
                          className="bg-light rounded d-flex align-items-center justify-content-center"
                          style={{ width: '50px', height: '50px' }}
                        >
                          ☕
                        </div>
                      )}
                    </td>
                    <td>
                      <strong>{coffee.coffeeName}</strong>
                    </td>
                    <td>
                      <code className="text-primary">{coffee.code}</code>
                    </td>
                    <td>
                      <Badge bg="info">{getCategoryName(coffee.categoryId)}</Badge>
                    </td>
                    <td>
                      <small className="text-muted">
                        {coffee.description.length > 50 
                          ? `${coffee.description.substring(0, 50)}...`
                          : coffee.description
                        }
                      </small>
                    </td>
                    <td>
                      {getStatusBadge(coffee.isActive)}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleEdit(coffee)}
                        >
                          ✏️ Edit
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => {
                            setSelectedCoffee(coffee)
                            setShowDeleteModal(true)
                          }}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Edit Coffee Item Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Coffee Item</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category ID</Form.Label>
                  <Form.Select
                    value={editForm.categoryId}
                    onChange={(e) => setEditForm(prev => ({ ...prev, categoryId: e.target.value }))}
                  >
                    <option value="">Select Category</option>
                    <option value="1">1 - Vietnamese Coffee</option>
                    <option value="2">2 - Espresso</option>
                    <option value="3">3 - Cold Brew</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={editForm.code}
                    onChange={(e) => setEditForm(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g., CF001"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Coffee Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.coffeeName}
                onChange={(e) => setEditForm(prev => ({ ...prev, coffeeName: e.target.value }))}
                placeholder="Enter coffee name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter coffee description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="url"
                value={editForm.imageUrl}
                onChange={(e) => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
              <Form.Text className="text-muted">
                Enter image URL or leave empty for default icon
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={editForm.isActive}
                onChange={(e) => setEditForm(prev => ({ ...prev, isActive: e.target.checked }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={editLoading}>
              {editLoading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Updating...
                </>
              ) : (
                'Update Coffee Item'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Create Coffee Item Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Coffee Item</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category ID *</Form.Label>
                  <Form.Select
                    value={createForm.categoryId}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, categoryId: e.target.value }))}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="1">1 - Vietnamese Coffee</option>
                    <option value="2">2 - Espresso</option>
                    <option value="3">3 - Cold Brew</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Code *</Form.Label>
                  <Form.Control
                    type="text"
                    value={createForm.code}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g., CF001"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Coffee Name *</Form.Label>
              <Form.Control
                type="text"
                value={createForm.coffeeName}
                onChange={(e) => setCreateForm(prev => ({ ...prev, coffeeName: e.target.value }))}
                placeholder="Enter coffee name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={createForm.description}
                onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter coffee description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image File</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0]
                  setSelectedImage(file)
                  if (file) {
                    setCreateForm(prev => ({ ...prev, imageUrl: file.name }))
                  }
                }}
              />
              <Form.Text className="text-muted">
                Upload an image file (JPG, PNG, etc.) or leave empty for default icon
              </Form.Text>
              {selectedImage && (
                <div className="mt-2">
                  <small className="text-success">
                    ✓ Selected: {selectedImage.name} ({(selectedImage.size / 1024).toFixed(1)} KB)
                  </small>
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Active"
                checked={createForm.isActive}
                onChange={(e) => setCreateForm(prev => ({ ...prev, isActive: e.target.checked }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={createLoading}>
              {createLoading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Creating...
                </>
              ) : (
                'Create Coffee Item'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Coffee Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{selectedCoffee?.coffeeName}"?
          <br />
          <small className="text-muted">This action cannot be undone.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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
