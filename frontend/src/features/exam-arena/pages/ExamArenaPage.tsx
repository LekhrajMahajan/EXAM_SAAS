import React, { useEffect, useState, useMemo, useRef } from 'react'
import { ExamLayout } from '../components/layout/ExamLayout'
import { QuestionPalette } from '../components/QuestionPalette'
import { QuestionCard } from '../components/QuestionCard'
import { apiClient } from '@/core/api/http/axios-client'
import { Loader2, AlertTriangle } from 'lucide-react'
import type { ExamQuestion, QuestionStatus } from '../types'
import { useProctoring } from '../hooks/useProctoring'
import { ProctoringOverlay } from '../components/ProctoringOverlay'
import { ProctoringVideoCard } from '../components/ProctoringVideoCard'
import { useNavigate } from 'react-router-dom'

export function ExamArenaPage () {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentQuestionData, setCurrentQuestionData] = useState<any>(null)
  const [currentQuestionNo, setCurrentQuestionNo] = useState(1)
  const navigate = useNavigate()

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [statuses, setStatuses] = useState<Record<string, string>>({})
  const [paletteList, setPaletteList] = useState<any[]>([])
  const [currentSubject, setCurrentSubject] = useState<string>('')
  const [remainingTime, setRemainingTime] = useState<number>(0)
  const [timeLoaded, setTimeLoaded] = useState(false)
  const [dynamicExamName, setDynamicExamName] = useState<string>('')

  // Proctoring Integration
  const [baselineDescriptor] = useState<Float32Array | null>(() => {
    const descStr = localStorage.getItem('baseline_face_descriptor')
    return descStr ? new Float32Array(JSON.parse(descStr)) : null
  })

  const [baselineImage] = useState<string | null>(() => localStorage.getItem('baseline_face_image'))

  const candidateInfoStr = localStorage.getItem('candidate_info')
  const candidateInfo = candidateInfoStr
    ? JSON.parse(candidateInfoStr)
    : { candidateName: 'Student', rollNumber: 'N/A' }

  const examMetaStr =
    localStorage.getItem('candidate_exam_meta') || localStorage.getItem('exam_meta')
  const examMeta = examMetaStr
    ? JSON.parse(examMetaStr)
    : { examTitle: 'Practice Exam', durationMinutes: 120 }

  const submitExamToServer = async (submitType: string, reason?: string) => {
    try {
      const examId = candidateInfo?.examId || localStorage.getItem('candidate_exam_id')
      const sessionId = localStorage.getItem('candidate_session_id') || 'temp_session'

      const payload = {
        sessionId,
        examId,
        candidateId: candidateInfo._id || 'candidate_placeholder',
        submitType,
        submitReason: reason,
        answers,
        statuses,
      }

      const endpoint =
        submitType === 'MANUAL' ? '/candidate-exam/submit' : '/candidate-exam/auto-submit'
      await apiClient.post(endpoint, payload)
    } catch (e) {
      console.error('Failed to submit exam to server:', e)
    }
  }

  const [submissionStatus, setSubmissionStatus] = useState<{
    submitted: boolean
    type: 'MANUAL' | 'AUTO'
    reason?: string
  }>({ submitted: false, type: 'MANUAL' })

  const isSubmitting = useRef(false)

  const handleAutoSubmit = async (reason?: string) => {
    if (isSubmitting.current || submissionStatus.submitted) return
    isSubmitting.current = true
    console.log('Exam Auto Submitted!', reason)
    setLoading(true)
    await submitExamToServer('AUTO', reason || 'TIME_EXPIRED_OR_VIOLATION')
    setLoading(false)
    setSubmissionStatus({
      submitted: true,
      type: 'AUTO',
      reason: reason || 'TIME_EXPIRED_OR_VIOLATION',
    })
  }

  const handleManualSubmit = async () => {
    if (isSubmitting.current || submissionStatus.submitted) return
    if (window.confirm('Are you sure you want to submit your exam?')) {
      isSubmitting.current = true
      setLoading(true)
      await submitExamToServer('MANUAL')
      setLoading(false)
      setSubmissionStatus({ submitted: true, type: 'MANUAL' })
    }
  }

  const { state: proctoringState, videoRef } = useProctoring(baselineDescriptor, handleAutoSubmit)

  useEffect(() => {
    const fetchQuestion = async (qNo: number) => {
      try {
        setLoading(true)
        setError(null)
        const examId = candidateInfo?.examId || localStorage.getItem('candidate_exam_id')
        const sessionId = localStorage.getItem('candidate_session_id') || 'temp_session'

        const response = await apiClient.get('/candidate-exam/questions', {
          params: { questionNo: qNo, examId, sessionId },
        })

        const resData = response.data.data
        setCurrentQuestionData(resData.currentQuestion)

        if ((resData.examTitle || resData.examName) && !dynamicExamName) {
          setDynamicExamName(resData.examTitle || resData.examName)
        }

        if (resData.paletteList && paletteList.length === 0) {
          setPaletteList(resData.paletteList)
          const sections = [...new Set(resData.paletteList.map((p: any) => p.section))]
          if (sections.length > 0 && !currentSubject) {
            setCurrentSubject(sections[0] as string)
          }
        }

        if (resData.remainingTime !== undefined && !timeLoaded) {
          setRemainingTime(resData.remainingTime)
          setTimeLoaded(true)
        }

        setStatuses((prev) => {
          if (!prev[String(resData.currentQuestion._id)]) {
            return { ...prev, [String(resData.currentQuestion._id)]: 'Not Answered' }
          }
          return prev
        })
      } catch (err: any) {
        console.error('Failed to load question', err)
        setError(err.response?.data?.message || 'Failed to load question')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestion(currentQuestionNo)
  }, [currentQuestionNo])

  const handleNext = () => {
    const nextQNo = currentQuestionNo + 1
    setCurrentQuestionNo(nextQNo)
    const nextQ = paletteList.find((p) => p.questionNumber === nextQNo)
    if (nextQ && nextQ.section !== currentSubject) {
      setCurrentSubject(nextQ.section)
    }
  }

  const handlePrevious = () => {
    const prevQNo = currentQuestionNo - 1
    setCurrentQuestionNo(prevQNo)
    const prevQ = paletteList.find((p) => p.questionNumber === prevQNo)
    if (prevQ && prevQ.section !== currentSubject) {
      setCurrentSubject(prevQ.section)
    }
  }

  const handleOptionSelect = (optionId: string) => {
    if (currentQuestionData) {
      setAnswers((prev) => ({ ...prev, [String(currentQuestionData._id)]: optionId }))
      setStatuses((prev) => ({ ...prev, [String(currentQuestionData._id)]: 'Answered' }))
    }
  }

  const displayQuestionsList = useMemo(() => {
    return paletteList
      .filter((p) => p.section === currentSubject)
      .map((p) => ({
        id: String(p.questionNumber),
        questionNumber: p.questionNumber,
        type: p.questionType,
        text: '',
        status: (statuses[String(p.id)] as QuestionStatus) || 'Not Visited',
      }))
  }, [paletteList, currentSubject, statuses])

  const headerProps = {
    examName:
      dynamicExamName ||
      candidateInfo.examName ||
      examMeta.examTitle ||
      examMeta.examName ||
      'Practice Exam',
    candidateName: candidateInfo.candidateName || candidateInfo.candidateFullName,
    rollNumber: candidateInfo.applicationNo || candidateInfo.rollNumber || 'N/A',
    durationSeconds: timeLoaded
      ? remainingTime
      : (examMeta.durationMinutes || examMeta.duration || 120) * 60,
    onSubmit: handleManualSubmit,
    onTimeUp: () => handleAutoSubmit('TIME_EXPIRED'),
  }

  const isCurrentSectionViewed = useMemo(() => {
    const sectionQs = paletteList.filter((p) => p.section === currentSubject)
    return sectionQs.every(
      (q) => statuses[String(q.id)] && statuses[String(q.id)] !== 'Not Visited',
    )
  }, [paletteList, currentSubject, statuses])

  if (error) {
    return (
      <ExamLayout headerProps={headerProps}>
        <div className='flex-1 flex items-center justify-center bg-background p-4'>
          <div className='text-center p-8 bg-card rounded-lg shadow-sm'>
            <h2 className='text-xl font-bold text-destructive mb-2'>Error</h2>
            <p className='text-muted-foreground'>{error}</p>
          </div>
        </div>
      </ExamLayout>
    )
  }

  const isSubmitted = submissionStatus.submitted || proctoringState.isAutoSubmitted
  if (isSubmitted) {
    const isAuto = submissionStatus.submitted 
      ? submissionStatus.type === 'AUTO' 
      : proctoringState.isAutoSubmitted
    const rawReason = submissionStatus.submitted 
      ? (submissionStatus.reason || '') 
      : (proctoringState.reason || '')

    let displayMessage = 'Your exam has been successfully submitted.'
    let displayTitle = 'Exam Submitted'
    let isWarning = false

    if (isAuto) {
      isWarning = true
      displayTitle = 'Exam Auto-Submitted'
      if (rawReason === 'TIME_EXPIRED' || rawReason === 'TIME_EXPIRED_OR_VIOLATION') {
        displayMessage = 'Your exam was auto-submitted because the time has expired.'
      } else {
        displayMessage = `Your exam was auto-submitted due to a warning: ${rawReason}`
      }
    }

    return (
      <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4'>
        <div
          className={`bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-4 ${
            isWarning ? 'border-destructive' : 'border-green-500'
          }`}
        >
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
              isWarning ? 'bg-destructive/10' : 'bg-green-100'
            }`}
          >
            {isWarning ? (
              <AlertTriangle className='h-8 w-8 text-destructive' />
            ) : (
              <div className='h-8 w-8 text-green-600 font-bold text-2xl'>✓</div>
            )}
          </div>
          <h1 className='text-2xl font-bold text-slate-800 mb-2'>{displayTitle}</h1>
          <p className='text-slate-600 mb-8'>{displayMessage}</p>
          <button
            onClick={() => {
              localStorage.removeItem('candidate_exam_token')
              navigate('/auth/candidate-login')
            }}
            className='w-full bg-slate-900 text-white font-medium py-3 rounded-lg hover:bg-slate-800 transition-colors'
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  const uniqueSections = [...new Set(paletteList.map((p) => p.section))]

  return (
    <ExamLayout headerProps={headerProps}>
      <ProctoringOverlay proctoringState={proctoringState} />

      <div className='flex-1 overflow-y-auto bg-white p-4 sm:p-6 lg:p-8 flex flex-col'>
        {loading && !currentQuestionData ? (
          <div className='flex-1 flex items-center justify-center'>
            <Loader2 className='animate-spin text-slate-800 h-8 w-8' />
          </div>
        ) : (
          currentQuestionData && (
            <div className='w-full flex-1 flex flex-col'>
              <div className='flex items-center gap-2 overflow-x-auto pb-4'>
                {uniqueSections.map((sec) => (
                  <button
                    key={sec as string}
                    onClick={() => {
                      if (currentSubject === sec) return
                      if (!isCurrentSectionViewed) {
                        alert('Please view all questions in the current section before switching.')
                        return
                      }
                      setCurrentSubject(sec as string)
                      const firstQ = paletteList.find((p) => p.section === sec)
                      if (firstQ) setCurrentQuestionNo(firstQ.questionNumber)
                    }}
                    className={`px-6 py-2 rounded-md text-base font-bold whitespace-nowrap shadow-sm ${
                      currentSubject === sec
                        ? 'bg-primary text-white'
                        : 'bg-slate-200 text-slate-800'
                    } ${
                      !isCurrentSectionViewed && currentSubject !== sec
                        ? 'opacity-50 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {sec as string}
                  </button>
                ))}
              </div>

              <QuestionCard
                question={{
                  id: String(currentQuestionData._id),
                  questionNumber: currentQuestionData.questionNumber,
                  type: currentQuestionData.questionType,
                  text: currentQuestionData.questionText,
                  options: currentQuestionData.options,
                  status:
                    (statuses[String(currentQuestionData._id)] as QuestionStatus) || 'Not Answered',
                }}
                selectedOption={answers[String(currentQuestionData._id)]}
                onSelect={handleOptionSelect}
              />

              <div className='mt-auto flex justify-between items-center gap-4 pt-6 px-4'>
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionNo <= 1 || loading}
                  className='px-6 py-3 bg-slate-900 text-white rounded font-bold hover:bg-slate-800 disabled:opacity-50'
                >
                  &lt; Previous
                </button>
                <div className='flex gap-4'>
                  <button
                    onClick={() => {
                      if (currentQuestionData) {
                        setStatuses((prev) => ({
                          ...prev,
                          [String(currentQuestionData._id)]:
                            prev[String(currentQuestionData._id)] === 'Answered'
                              ? 'Answered'
                              : 'Not Answered',
                        }))
                      }
                      if (currentQuestionNo < paletteList.length) handleNext()
                    }}
                    disabled={loading}
                    className='px-6 py-3 bg-white border border-slate-300 text-slate-800 rounded font-bold hover:bg-slate-50 disabled:opacity-50'
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => {
                      if (currentQuestionNo < paletteList.length) handleNext()
                    }}
                    disabled={
                      !currentQuestionData || !answers[String(currentQuestionData._id)] || loading
                    }
                    className='px-6 py-3 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2'
                  >
                    Save & Next
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <div className='w-80 bg-slate-100 flex-shrink-0 flex-col hidden xl:flex h-full overflow-y-auto'>
        <div className='p-4 flex-1 flex flex-col space-y-4'>
          <ProctoringVideoCard
            title='Live Proctoring'
            videoRef={videoRef}
            statusMessage={proctoringState.statusMessage}
            baselineImage={baselineImage}
          />
          <div className='flex-1 bg-slate-400 p-4 rounded-md'>
            <h3 className='text-center font-bold text-slate-800 mb-4'>
              {currentSubject} Questions
            </h3>
            <QuestionPalette
              questions={displayQuestionsList}
              currentQuestionId={String(currentQuestionNo)}
              onQuestionSelect={(id) => setCurrentQuestionNo(Number(id))}
            />
          </div>
        </div>
      </div>
    </ExamLayout>
  )
}
