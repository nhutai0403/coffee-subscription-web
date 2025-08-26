import { Card, Row, Col } from 'react-bootstrap'

export default function Dashboard() {
  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <p>Welcome to your coffee subscription management dashboard</p>
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <Card.Text>$0</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Active Users</Card.Title>
              <Card.Text>0</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Subscriptions</Card.Title>
              <Card.Text>0</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Conversion Rate</Card.Title>
              <Card.Text>0%</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

