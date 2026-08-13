// src/shared/components/NotFoundPage.tsx
// Generic 404 page for unknown routes or error boundaries.
import { motion } from 'framer-motion'
import { Link, useRouteError } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'

export const NotFoundPage = () => {
  const error = useRouteError() as any

  return (
    <div className='min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center px-6'>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <AlertCircle className='w-16 h-16 text-indigo-400 mx-auto mb-6' />
        <h1 className='text-7xl font-bold text-white mb-4'>404</h1>
        <p className='text-xl text-slate-400 mb-4'>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        {error && (
          <div className='bg-red-500/10 text-red-400 p-4 rounded mb-8 text-left max-w-xl overflow-auto'>
            <p className='font-bold'>Error Details:</p>
            <pre className='text-sm whitespace-pre-wrap'>
              {error.statusText || error.message}
              {'\n'}
              {error.stack}
            </pre>
          </div>
        )}
        {!error && <div className='mb-8' />}
        <Link
          to='/'
          className='inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors duration-200'
        >
          <Home className='w-4 h-4' />
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
