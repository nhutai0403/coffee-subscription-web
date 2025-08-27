import React, { useEffect, useState } from 'react';
import { subscriptionPlanService } from '../services/subscriptionPlanService';
import { Table, Container, Spinner, Alert, Badge, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const initialForm = {
  planName: '',
  description: '',
  price: '',
  durationDays: '',
  totalCups: '',
  dailyCupLimit: '',
  isActive: true,
};

const SubscriptionPlanPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState(initialForm);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await subscriptionPlanService.getAllPlans();
      setPlans(data);
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');
    try {
      const payload = {
        ...createForm,
        price: Number(createForm.price),
        durationDays: Number(createForm.durationDays),
        totalCups: Number(createForm.totalCups),
        dailyCupLimit: Number(createForm.dailyCupLimit),
      };
      await subscriptionPlanService.createPlan(payload);
      setShowCreate(false);
      setCreateForm(initialForm);
      fetchPlans();
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setCreateError(err.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await subscriptionPlanService.deletePlan(deletingPlan.planId);
      setPlans(prev => prev.filter(plan => plan.planId !== deletingPlan.planId));
      setShowDelete(false);
      setDeletingPlan(null);
    } catch (err) {
      if (err.response && [400,401,403].includes(err.response.status)) toast.error(err.message)
      else setDeleteError(err.message);
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📋 Subscription Plans</h2>
        <Button variant="primary" onClick={() => setShowCreate(true)}>
          + Add Plan
        </Button>
      </div>
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
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Duration (days)</th>
              <th>Total Cups</th>
              <th>Daily Cup Limit</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan, idx) => (
              <tr key={plan.planId}>
                <td>{idx + 1}</td>
                <td>{plan.planName}</td>
                <td>{plan.description}</td>
                <td>{typeof plan.price === 'number' ? plan.price.toLocaleString() : 0} đ</td>
                <td>{plan.durationDays}</td>
                <td>{plan.totalCups}</td>
                <td>{plan.dailyCupLimit}</td>
                <td>
                  {plan.isActive ? (
                    <Badge bg="success">Active</Badge>
                  ) : (
                    <Badge bg="secondary">Inactive</Badge>
                  )}
                </td>
                <td>
                  <Button as={Link} to={`/subscription-plans/${plan.planId}`} size="sm" variant="info" className="me-2">
                    Xem chi tiết
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setDeletingPlan(plan);
                      setDeleteError(''); 
                      setShowDelete(true);
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
          <Modal.Title>Add Subscription Plan</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateSubmit}>
          <Modal.Body>
            {createError && <Alert variant="danger">{createError}</Alert>}
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control name="planName" value={createForm.planName} onChange={handleCreateChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" value={createForm.description} onChange={handleCreateChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control name="price" type="number" value={createForm.price} onChange={handleCreateChange} required min={0} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Duration (days)</Form.Label>
              <Form.Control name="durationDays" type="number" value={createForm.durationDays} onChange={handleCreateChange} required min={1} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Total Cups</Form.Label>
              <Form.Control name="totalCups" type="number" value={createForm.totalCups} onChange={handleCreateChange} required min={1} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Daily Cup Limit</Form.Label>
              <Form.Control name="dailyCupLimit" type="number" value={createForm.dailyCupLimit} onChange={handleCreateChange} required min={1} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Check type="checkbox" label="Active" name="isActive" checked={createForm.isActive} onChange={handleCreateChange} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreate(false)} disabled={createLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Subscription Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && <Alert variant="danger">{deleteError}</Alert>}
          {deletingPlan
            ? <>Are you sure you want to delete plan {deletingPlan.planId}?</>
            : <>No plan selected.</>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={!deletingPlan}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SubscriptionPlanPage;
