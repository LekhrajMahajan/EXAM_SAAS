// src/layouts/RootLayout.tsx
// Root layout shell — wraps all routes with global UI chrome.
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

export const RootLayout = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Global navigation will go here */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      {/* Global footer will go here */}
    </div>
  )
}
