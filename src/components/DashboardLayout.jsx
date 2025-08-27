import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="p-4" style={{ marginLeft: 280 }}>
        <Outlet />
      </div>
    </div>
  )
}

