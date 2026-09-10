import { useState, useEffect, useRef } from 'react'
import { Clock } from 'lucide-react'

interface ExamTimerProps {
  durationSeconds: number
  onTimeUp?: () => void
}

export function ExamTimer ({ durationSeconds, onTimeUp }: ExamTimerProps) {
  const safeDuration = Number.isNaN(Number(durationSeconds)) ? 0 : Number(durationSeconds)

  const hours = Math.floor(safeDuration / 3600)
  const minutes = Math.floor((safeDuration % 3600) / 60)
  const seconds = safeDuration % 60

  const displayTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

  return (
    <div className='flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-lg px-3 md:px-4 py-1.5'>
      <Clock className='w-4 h-4 text-amber-400' />
      <span className='font-mono text-sm md:text-base font-bold text-white tracking-wider'>
        {displayTime}
      </span>
    </div>
  )
}
