// src/features/home/HomePage.tsx
// Placeholder home page — replace with real content when building features.
import { motion } from 'framer-motion'
import { ShieldCheck, BookOpen, BarChart3, Zap } from 'lucide-react'

const features = [
  {
    icon: ShieldCheck,
    title: 'Anti-Cheat Protection',
    description: 'Advanced proctoring with AI-powered behavior analysis.',
  },
  {
    icon: BookOpen,
    title: 'Smart Question Bank',
    description: 'Adaptive question sets with auto-grading and analytics.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description: 'Live dashboards with detailed performance insights.',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Automated scoring with instant feedback delivery.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center px-6 py-20">
      {/* Hero */}
      <motion.div
        className="text-center max-w-3xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-sm font-medium px-4 py-1.5 rounded-full mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <ShieldCheck className="w-4 h-4" />
          Enterprise-Grade Examination Platform
        </motion.div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
          Exam<span className="text-indigo-400">Guard</span>{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Pro
          </span>
        </h1>

        <p className="text-xl text-slate-400 mb-12 leading-relaxed">
          Secure, scalable, and intelligent online examination infrastructure.
          Built for institutions that demand reliability and integrity.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <motion.button
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            Get Started
          </motion.button>
          <motion.button
            className="px-8 py-3.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-all duration-200"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            View Docs
          </motion.button>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-24 w-full max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {features.map(({ icon: Icon, title, description }) => (
          <motion.div
            key={title}
            variants={itemVariants}
            className="group bg-slate-900/60 backdrop-blur-sm border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors duration-300">
              <Icon className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Foundation Badge */}
      <motion.p
        className="mt-20 text-xs text-slate-600 font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        ⚡ Frontend foundation ready · React 19 · Vite · TypeScript · Tailwind v4
      </motion.p>
    </div>
  )
}
