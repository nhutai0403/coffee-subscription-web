import { Card, Row, Col } from 'react-bootstrap'

function LineChart({ data, fill = false, color = '#0d6efd' }) {
  const max = Math.max(...data)
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (value / max) * 100
      return `${x},${y}`
    })
    .join(' ')

  const path = points
    .split(' ')
    .map((p, i) => (i === 0 ? `M${p}` : `L${p}`))
    .join(' ')

  const area = `${path} L100,100 L0,100 Z`

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      {fill && <path d={area} fill={`${color}33`} stroke="none" />}
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  )
}

export default function Dashboard() {
  const stats = [
    { title: 'Total Revenue', value: '$45,231', change: '+25.3% from last month' },
    { title: 'Active Users', value: '2,350', change: '+25.3% from last month' },
    { title: 'Subscriptions', value: '1,234', change: '+25.3% from last month' },
    { title: 'Conversion Rate', value: '3.2%', change: '+25.3% from last month' },
  ]

  const revenueData = [30, 40, 35, 50, 65, 60, 70, 80, 75, 85, 90, 95]
  const subscriptionData = [5, 10, 8, 12, 15, 14, 16, 18, 17, 19, 20, 22]

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <p>Welcome to your coffee subscription management dashboard</p>
      <Row className="g-4 mb-4">
        {stats.map(stat => (
          <Col md={3} key={stat.title}>
            <Card>
              <Card.Body>
                <Card.Title>{stat.title}</Card.Title>
                <h3 className="mb-1">{stat.value}</h3>
                <small className="text-success">{stat.change}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="g-4">
        <Col md={8}>
          <Card style={{ height: 300 }}>
            <Card.Body className="d-flex flex-column h-100">
              <Card.Title>Revenue Overview</Card.Title>
              <div className="flex-grow-1">
                <LineChart data={revenueData} fill color="#6c757d" />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ height: 300 }}>
            <Card.Body className="d-flex flex-column h-100">
              <Card.Title>Subscription Growth</Card.Title>
              <div className="flex-grow-1">
                <LineChart data={subscriptionData} color="#0d6efd" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

