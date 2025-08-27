import { Container, Row, Col, Card } from 'react-bootstrap'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from 'recharts'
import { useState, useEffect } from 'react'
import { userService } from '../services/userService'
import { userSubscriptionService } from '../services/userSubscriptionService'

const revenueData = [
  { month: 'Jan', revenue: 10000 },
  { month: 'Feb', revenue: 15000 },
  { month: 'Mar', revenue: 13000 },
  { month: 'Apr', revenue: 20000 },
  { month: 'May', revenue: 25000 },
  { month: 'Jun', revenue: 23000 },
  { month: 'Jul', revenue: 30000 },
  { month: 'Aug', revenue: 35000 },
  { month: 'Sep', revenue: 33000 },
  { month: 'Oct', revenue: 37000 },
  { month: 'Nov', revenue: 39000 },
  { month: 'Dec', revenue: 40000 },
]

const subscriptionData = [
  { month: 'Jan', subscribers: 100 },
  { month: 'Feb', subscribers: 200 },
  { month: 'Mar', subscribers: 150 },
  { month: 'Apr', subscribers: 250 },
  { month: 'May', subscribers: 300 },
  { month: 'Jun', subscribers: 280 },
  { month: 'Jul', subscribers: 320 },
  { month: 'Aug', subscribers: 360 },
  { month: 'Sep', subscribers: 340 },
  { month: 'Oct', subscribers: 380 },
  { month: 'Nov', subscribers: 400 },
  { month: 'Dec', subscribers: 420 },
]

export default function Dashboard() {
  const [users, setUsers] = useState([])
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [usersData, subscriptionsData] = await Promise.all([
          userService.searchUsers('', false, 0, 100), // Get all active users
          userSubscriptionService.getSubscriptions()
        ])
        
        setUsers(usersData.pageData || [])
        setSubscriptions(subscriptionsData || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Calculate real statistics
  const activeUsers = users.filter(user => user.isActive).length
  const activeSubscriptions = subscriptions.filter(sub => sub.isActive).length

  const stats = [
    {
      title: 'Active Users',
      value: loading ? 'Loading...' : activeUsers.toLocaleString(),
    },
    {
      title: 'Active Subscriptions',
      value: loading ? 'Loading...' : activeSubscriptions.toLocaleString(),
    },
  ]

  return (
    <Container fluid className="py-3">
      <div className="mb-4">
        <h2 className="mb-1">Dashboard</h2>
        <p className="text-muted mb-0">Welcome to your coffee subscription management dashboard</p>
      </div>
      <Row className="g-4 mb-4">
        {stats.map(({ title, value, change }) => (
          <Col sm={6} lg={3} key={title}>
            <Card className="h-100 bg-white rounded-3">
              <Card.Body>
                <Card.Title className="text-muted">{title}</Card.Title>
                <h3 className="mb-0">{value}</h3>
                <div className="small text-success">{change}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="g-4">
        <Col md={8}>
          <Card className="h-100 bg-white rounded-3">
            <Card.Body className="d-flex flex-column h-100">
              <Card.Title>Revenue Overview</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                Monthly revenue for the past year
              </Card.Subtitle>
              <div
                style={{ height: 320, background: '#fff', overflow: 'hidden' }}
                className="flex-grow-1"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      ticks={[10000, 20000, 30000, 40000]}
                      tickFormatter={v => `$${v / 1000}k`}
                    />
                    <Tooltip formatter={v => `$${v / 1000}k`} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#6c757d"
                      fill="#6c757d"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 bg-white rounded-3">
            <Card.Body className="d-flex flex-column h-100">
              <Card.Title>Subscription Growth</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                New subscriptions per month
              </Card.Subtitle>
              <div
                style={{ height: 320, background: '#fff', overflow: 'hidden' }}
                className="flex-grow-1"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={subscriptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="subscribers"
                      stroke="#0d6efd"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
