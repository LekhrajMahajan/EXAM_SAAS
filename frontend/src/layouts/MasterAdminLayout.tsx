// src/layouts/MasterAdminLayout.tsx
import { Outlet } from 'react-router-dom'

export const MasterAdminLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* MasterAdmin sidebar will go here */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
