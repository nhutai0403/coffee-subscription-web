import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <Outlet />
      </div>
    </div>
  )
}

