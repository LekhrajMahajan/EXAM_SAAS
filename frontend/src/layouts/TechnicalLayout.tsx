// src/layouts/TechnicalLayout.tsx
import { Outlet } from 'react-router-dom'

export const TechnicalLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
