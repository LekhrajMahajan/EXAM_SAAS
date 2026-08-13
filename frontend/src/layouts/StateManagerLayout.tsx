// src/layouts/StateManagerLayout.tsx
import { Outlet } from 'react-router-dom'

export const StateManagerLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
