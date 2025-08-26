import { Card, Row, Col } from 'react-bootstrap'

function LineChart({
  data,
  xLabels = [],
  fill = false,
  color = '#0d6efd',
  max: maxProp,
  yFormat = v => v,
}) {
  const max = maxProp ?? Math.max(...data)

  const margin = { top: 5, right: 5, bottom: 15, left: 25 }
  const width = 100
  const height = 80

  const svgWidth = width + margin.left + margin.right
  const svgHeight = height + margin.top + margin.bottom

  const points = data
    .map((value, index) => {
      const x =
        margin.left + (index / (data.length - 1 || 1)) * width
      const y =
        margin.top + height - (value / max) * height
      return `${x},${y}`
    })
    .join(' ')

  const path = points
    .split(' ')
    .map((p, i) => (i === 0 ? `M${p}` : `L${p}`))
    .join(' ')

  const area = `${path} L${margin.left + width},${
    margin.top + height
  } L${margin.left},${margin.top + height} Z`

  const tickCount = 4
  const ticks = Array.from({ length: tickCount }, (_, i) =>
    ((i + 1) * max) / tickCount
  )

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      preserveAspectRatio="none"
      style={{ width: '100%', height: '100%' }}
    >
      {ticks.map(t => {
        const y = margin.top + height - (t / max) * height
        return (
          <line
            key={`grid-${t}`}
            x1={margin.left}
            y1={y}
            x2={margin.left + width}
            y2={y}
            stroke="#e9ecef"
            strokeWidth="0.5"
          />
        )
      })}
      {fill && <path d={area} fill={`${color}33`} stroke="none" />}
      <path d={path} fill="none" stroke={color} strokeWidth="2" />
      <line
        x1={margin.left}
        y1={margin.top}
        x2={margin.left}
        y2={margin.top + height}
        stroke="#adb5bd"
        strokeWidth="0.5"
      />
      <line
        x1={margin.left}
        y1={margin.top + height}
        x2={margin.left + width}
        y2={margin.top + height}
        stroke="#adb5bd"
        strokeWidth="0.5"
      />
      {xLabels.length === data.length &&
        xLabels.map((label, i) => {
          const x = margin.left + (i / (data.length - 1 || 1)) * width
          return (
            <text
              key={`x-${i}`}
              x={x}
              y={svgHeight - 3}
              fontSize="5"
              textAnchor="middle"
              fill="#6c757d"
            >
              {label}
            </text>
          )
        })}
      {ticks.map(t => {
        const y = margin.top + height - (t / max) * height + 2
        return (
          <text
            key={`y-${t}`}
            x={margin.left - 3}
            y={y}
            fontSize="5"
            textAnchor="end"
            fill="#6c757d"
          >
            {yFormat(Math.round(t))}
          </text>
        )
      })}
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

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const revenueData = [
    10, 15, 13, 20, 25, 23, 30, 35, 33, 37, 39, 40,
  ]
  const subscriptionData = [
    100, 200, 150, 250, 300, 280, 320, 360, 340, 380, 400, 400,
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
            <Card.Body className="d-flex flex-column h-100">
              <Card.Title>Revenue Overview</Card.Title>
              <small className="text-muted">Monthly revenue for the past year</small>
              <div className="flex-grow-1">
                <LineChart
                  data={revenueData}
                  xLabels={months}
                  max={40}
                  fill
                  color="#6c757d"
                  yFormat={v => `$${v}k`}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card style={{ height: 300 }}>
            <Card.Body className="d-flex flex-column h-100">
              <Card.Title>Subscription Growth</Card.Title>
              <small className="text-muted">New subscriptions per month</small>
              <div className="flex-grow-1">
                <LineChart
                  data={subscriptionData}
                  xLabels={months}
                  max={400}
                  color="#0d6efd"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

