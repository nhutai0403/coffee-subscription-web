import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { subscriptionPlanService } from '../services/subscriptionPlanService';
import { Container, Spinner, Alert, Badge, Button, Table, Modal, Form } from 'react-bootstrap';

const SubscriptionPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchPlan();
    // eslint-disable-next-line
  }, [id]);

  const fetchPlan = async () => {
    try {
      setLoading(true);
      const data = await subscriptionPlanService.getPlanById(id);
      setPlan(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditOpen = () => {
    setEditForm({
      planName: plan.planName,
      description: plan.description,
      price: plan.price,
      durationDays: plan.durationDays,
      totalCups: plan.totalCups,
      dailyCupLimit: plan.dailyCupLimit,
    });
    setShowEdit(true);
    setEditError('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const payload = {
        ...editForm,
        price: Number(editForm.price),
        durationDays: Number(editForm.durationDays),
        totalCups: Number(editForm.totalCups),
        dailyCupLimit: Number(editForm.dailyCupLimit),
      };
      await subscriptionPlanService.updatePlan(plan.planId, payload);
      setShowEdit(false);
      fetchPlan();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await subscriptionPlanService.deletePlan(plan.planId);
      setShowDelete(false);
      navigate('/subscription-plans');
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Container className="mt-4 text-center"><Spinner animation="border" /></Container>;
  }
  if (error) {
    return <Container className="mt-4"><Alert variant="danger">{error}</Alert></Container>;
  }
  if (!plan) return null;

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Plan Detail: {plan.planName}</h2>
        <div>
          <Button as={Link} to="/subscription-plans" variant="secondary" className="me-2">Back to List</Button>
          <Button variant="warning" onClick={handleEditOpen} className="me-2">Edit</Button>
          <Button variant="danger" onClick={() => setShowDelete(true)}>Delete</Button>
        </div>
      </div>
      <Table bordered>
        <tbody>
          <tr><th>ID</th><td>{plan.planId}</td></tr>
          <tr><th>Name</th><td>{plan.planName}</td></tr>
          <tr><th>Description</th><td>{plan.description}</td></tr>
          <tr><th>Price</th><td>{plan.price.toLocaleString()} đ</td></tr>
          <tr><th>Duration (days)</th><td>{plan.durationDays}</td></tr>
          <tr><th>Total Cups</th><td>{plan.totalCups}</td></tr>
          <tr><th>Daily Cup Limit</th><td>{plan.dailyCupLimit}</td></tr>
          <tr><th>Status</th><td>{plan.isActive ? <Badge bg="success">Active</Badge> : <Badge bg="secondary">Inactive</Badge>}</td></tr>
        </tbody>
      </Table>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Subscription Plan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deleteError && <Alert variant="danger">{deleteError}</Alert>}
          Are you sure you want to delete plan <b>{plan.planName}</b>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleteLoading}>
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Subscription Plan</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            {editError && <Alert variant="danger">{editError}</Alert>}
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control name="planName" value={editForm?.planName || ''} onChange={handleEditChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Description</Form.Label>
              <Form.Control name="description" value={editForm?.description || ''} onChange={handleEditChange} required />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control name="price" type="number" value={editForm?.price || 0} onChange={handleEditChange} required min={0} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Duration (days)</Form.Label>
              <Form.Control name="durationDays" type="number" value={editForm?.durationDays || 0} onChange={handleEditChange} required min={1} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Total Cups</Form.Label>
              <Form.Control name="totalCups" type="number" value={editForm?.totalCups || 0} onChange={handleEditChange} required min={1} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Daily Cup Limit</Form.Label>
              <Form.Control name="dailyCupLimit" type="number" value={editForm?.dailyCupLimit || 0} onChange={handleEditChange} required min={1} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)} disabled={editLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={editLoading}>
              {editLoading ? 'Saving...' : 'Save'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default SubscriptionPlanDetail;
