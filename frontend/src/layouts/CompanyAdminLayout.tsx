// src/layouts/CompanyAdminLayout.tsx
import { Outlet } from 'react-router-dom'

export const CompanyAdminLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* CompanyAdmin sidebar will go here */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
