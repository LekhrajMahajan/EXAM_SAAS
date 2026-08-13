// src/layouts/GovernmentLayout.tsx
import { Outlet } from 'react-router-dom'

export const GovernmentLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
