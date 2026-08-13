import { useState, useEffect, useRef } from 'react'
import { Clock } from 'lucide-react'

interface ExamTimerProps {
  durationSeconds: number
  onTimeUp?: () => void
}

export function ExamTimer ({ durationSeconds, onTimeUp }: ExamTimerProps) {
  const safeDuration = Number.isNaN(Number(durationSeconds)) ? 0 : Number(durationSeconds)
  const [timeLeft, setTimeLeft] = useState(safeDuration)
  const endTimeRef = useRef<number>(0)
  const onTimeUpRef = useRef(onTimeUp)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    if (endTimeRef.current === 0) {
      endTimeRef.current = Date.now() + safeDuration * 1000
    }

    const timer = setInterval(() => {
      const remainingMs = endTimeRef.current - Date.now()
      const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000))

      setTimeLeft(remainingSeconds)

      if (remainingSeconds <= 0) {
        clearInterval(timer)
        if (onTimeUpRef.current) {
          onTimeUpRef.current()
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [safeDuration])

  const hours = Math.floor(timeLeft / 3600)
  const minutes = Math.floor((timeLeft % 3600) / 60)
  const seconds = timeLeft % 60

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
