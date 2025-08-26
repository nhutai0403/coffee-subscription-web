import { Card, Row, Col } from 'react-bootstrap'
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
} from 'victory'

export default function Dashboard() {
  const stats = [
    { title: 'Total Revenue', value: '$45,231', change: '+25.3% from last month' },
    { title: 'Active Users', value: '2,350', change: '+25.3% from last month' },
    { title: 'Subscriptions', value: '1,234', change: '+25.3% from last month' },
    { title: 'Conversion Rate', value: '3.2%', change: '+25.3% from last month' },
  ]

  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 15000 },
    { month: 'Mar', revenue: 18000 },
    { month: 'Apr', revenue: 22000 },
    { month: 'May', revenue: 25000 },
    { month: 'Jun', revenue: 28000 },
    { month: 'Jul', revenue: 32000 },
    { month: 'Aug', revenue: 35000 },
    { month: 'Sep', revenue: 38000 },
    { month: 'Oct', revenue: 42000 },
    { month: 'Nov', revenue: 45000 },
    { month: 'Dec', revenue: 48000 },
  ]

  const subscriptionData = [
    { month: 'Jan', subscriptions: 120 },
    { month: 'Feb', subscriptions: 150 },
    { month: 'Mar', subscriptions: 180 },
    { month: 'Apr', subscriptions: 220 },
    { month: 'May', subscriptions: 250 },
    { month: 'Jun', subscriptions: 280 },
    { month: 'Jul', subscriptions: 320 },
    { month: 'Aug', subscriptions: 350 },
    { month: 'Sep', subscriptions: 380 },
    { month: 'Oct', subscriptions: 420 },
    { month: 'Nov', subscriptions: 450 },
    { month: 'Dec', subscriptions: 480 },
  ]

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
            <Card.Body className="h-100 d-flex flex-column">
              <Card.Title>Revenue Overview</Card.Title>
              <div className="flex-grow-1">
                <VictoryChart
                  theme={VictoryTheme.material}
                  height={220}
                  padding={{ left: 60, top: 20, right: 20, bottom: 50 }}
                  domainPadding={{ x: 20 }}
                  style={{ parent: { width: '100%', height: '100%' } }}
                >
                  <VictoryAxis dependentAxis tickFormat={(x) => `$${x / 1000}k`} />
                  <VictoryAxis />
                  <VictoryArea
                    data={revenueData}
                    x="month"
                    y="revenue"
                    style={{
                      data: {
                        fill: '#6c757d33',
                        stroke: '#6c757d',
                        strokeWidth: 2,
                      },
                    }}
                    animate={{ duration: 1000, onLoad: { duration: 500 } }}
                  />
                  <VictoryLine
                    data={revenueData}
                    x="month"
                    y="revenue"
                    style={{ data: { stroke: '#6c757d', strokeWidth: 3 } }}
                    labelComponent={<VictoryTooltip />}
                  />
                </VictoryChart>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ height: 300 }}>
            <Card.Body className="h-100 d-flex flex-column">
              <Card.Title>Subscription Growth</Card.Title>
              <div className="flex-grow-1">
                <VictoryChart
                  theme={VictoryTheme.material}
                  height={220}
                  padding={{ left: 60, top: 20, right: 20, bottom: 50 }}
                  domainPadding={{ x: 20 }}
                  style={{ parent: { width: '100%', height: '100%' } }}
                >
                  <VictoryAxis dependentAxis />
                  <VictoryAxis />
                  <VictoryLine
                    data={subscriptionData}
                    x="month"
                    y="subscriptions"
                    style={{ data: { stroke: '#0d6efd', strokeWidth: 3 } }}
                    animate={{ duration: 1000, onLoad: { duration: 500 } }}
                    labelComponent={<VictoryTooltip />}
                  />
                </VictoryChart>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

