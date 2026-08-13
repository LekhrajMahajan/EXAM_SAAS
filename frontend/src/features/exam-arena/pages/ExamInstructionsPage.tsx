import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/core/api/http/axios-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Loader2, AlertCircle, Clock, CheckCircle2, Camera } from 'lucide-react'
import * as faceapi from '@vladmandic/face-api'
import { useTheme } from '@/providers/theme-context'

interface CandidateInfo {
  candidateName?: string
  fullName?: string
  applicationNo?: string
  examId?: string
}

interface ExamMeta {
  _id: string
  examTitle: string
  examCode: string
  examDate: string
  startTime: string
  duration: number
}

export function ExamInstructionsPage () {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [examData, setExamData] = useState<Record<string, unknown> | null>(null)
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo | null>(null)
  const [examMeta, setExamMeta] = useState<ExamMeta | null>(null)

  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isFaceCaptureMode, setIsFaceCaptureMode] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [faceApiLoaded, setFaceApiLoaded] = useState(false)
  const [faceCaptureStatus, setFaceCaptureStatus] = useState('Loading camera...')
  const videoRef = useRef<HTMLVideoElement>(null)

  const [agreements, setAgreements] = useState({
    faceMonitoring: false,
    multipleFaces: false,
    warningsLimit: false,
    tabSwitching: false,
    autoSubmit: false,
    noRefresh: false
  });
  const allAgreed = Object.values(agreements).every(v => v === true);

  const { setTheme } = useTheme()

  // Force light theme for the exam arena and clear baseline image
  useEffect(() => {
    setTheme('light')
    localStorage.removeItem('baseline_face_image')
    localStorage.removeItem('baseline_face_descriptor')
  }, [setTheme])

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        setLoading(true)
        const candidateInfoStr = localStorage.getItem('candidate_info')
        const examMetaStr = localStorage.getItem('candidate_exam_meta')

        if (!candidateInfoStr || !examMetaStr) {
          throw new Error('No candidate or exam information found. Please login again.')
        }

        const cInfo: CandidateInfo = JSON.parse(candidateInfoStr)
        const meta: ExamMeta = JSON.parse(examMetaStr)
        setCandidateInfo(cInfo)
        setExamMeta(meta)

        const examId = meta._id
        const sessionId = localStorage.getItem('candidate_session_id')

        if (!examId) {
          throw new Error('No exam assigned to this candidate.')
        }

        // Just fetch the first question to get exam metadata
        const response = await apiClient.get('/candidate-exam/questions', {
          params: { questionNo: 1, examId, sessionId },
        })

        setExamData(response.data.data)

        // Pre-load face API models in background
        const MODEL_URL = 'https://cdn.jsdelivr.net/gh/vladmandic/face-api/model/'
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ])
        setFaceApiLoaded(true)
      } catch (err: any) {
        console.error('Failed to load exam instructions', err)
        setError(err.response?.data?.message || err.message || 'Failed to load exam details')
      } finally {
        setLoading(false)
      }
    }

    fetchExamDetails()
  }, [])

  // Countdown Timer Logic
  useEffect(() => {
    if (!examMeta || !examMeta.examDate || !examMeta.startTime) return

    const calculateRemaining = () => {
      const now = new Date()
      // Use today's date and just apply the exam start time
      // This ensures the countdown works perfectly even if the exam was created on a different day
      const examDateTime = new Date()
      const [hours, minutes] = examMeta.startTime.split(':').map(Number)
      examDateTime.setHours(hours, minutes, 0, 0)

      const diff = examDateTime.getTime() - now.getTime()
      return Math.max(0, Math.floor(diff / 1000))
    }

    // Avoid calling setState synchronously during the effect
    const timeoutId = setTimeout(() => {
      setTimeRemaining(calculateRemaining())
    }, 0)

    const intervalId = setInterval(() => {
      setTimeRemaining(calculateRemaining())
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [examMeta])

  const captureBaselineFace = async () => {
    if (!videoRef.current) return

    setFaceCaptureStatus('Analyzing face...')
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors()

    if (detections && detections.length === 1) {
      setFaceCaptureStatus('Face captured successfully!')

      // Save the baseline descriptor array to localStorage
      localStorage.setItem(
        'baseline_face_descriptor',
        JSON.stringify(Array.from(detections[0].descriptor)),
      )

      // Capture baseline image frame
      if (videoRef.current) {
        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
          const imageUrl = canvas.toDataURL('image/jpeg', 0.8)
          localStorage.setItem('baseline_face_image', imageUrl)
          setCapturedImage(imageUrl)
        }
      }

      // Stop video track
      const stream = videoRef.current.srcObject as MediaStream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      
      setIsFaceCaptureMode(false)
    } else if (detections && detections.length > 1) {
      setFaceCaptureStatus('Multiple faces detected! Please ensure only your single face is visible.')
    } else {
      setFaceCaptureStatus('No face detected. Please face the camera properly and try again.')
    }
  }

  // Handle Face Capture Initialization only when user is ready
  useEffect(() => {
    if (isFaceCaptureMode && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.play()
            setFaceCaptureStatus('Please position your face and click "Capture Now".')
          }
        })
        .catch((err) => {
          console.error('Camera error:', err)
          setFaceCaptureStatus('Camera access denied. Please allow camera access to proceed.')
        })
    }
  }, [isFaceCaptureMode])

  const handleTakePhotoClick = () => {
    if (!faceApiLoaded) {
      alert('Proctoring models are still loading, please wait a moment.')
      return
    }
    setIsFaceCaptureMode(true)
    setFaceCaptureStatus('Starting camera...')
  }

  const handleStartExamClick = () => {
    if (!capturedImage) {
      alert('Please capture your face photo first.')
      return
    }
    navigate('/exam-arena')
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}h ${m}m ${s}s`
    return `${m}m ${s}s`
  }

  useEffect(() => {
    if (timeRemaining === 0 && capturedImage && allAgreed) {
      navigate('/exam-arena')
    }
  }, [timeRemaining, capturedImage, allAgreed, navigate])

  if (loading) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <div className='flex flex-col items-center space-y-4'>
          <Loader2 className='animate-spin h-10 w-10 text-primary' />
          <p className='text-muted-foreground font-medium'>
            Loading instructions & configuring proctoring...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center p-4'>
        <Card className='w-full max-w-md border-destructive/50'>
          <CardHeader className='bg-destructive/10 border-b border-destructive/20 pb-4'>
            <CardTitle className='text-destructive flex items-center gap-2'>
              <AlertCircle className='h-5 w-5' />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className='pt-6'>
            <p className='text-foreground mb-6'>{error}</p>
            <Button
              onClick={() => navigate('/auth/candidate-login')}
              variant='outline'
              className='w-full'
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background py-4 px-4 sm:px-6 lg:px-8 flex flex-col justify-center'>
      <div className='max-w-5xl w-full mx-auto space-y-4'>
        {/* Header Section */}
        <div className='bg-card rounded-xl shadow-sm border p-4 flex flex-col md:flex-row md:items-center justify-between gap-2'>
          <div>
            <h1 className='text-xl font-bold text-foreground'>Exam Instructions</h1>
            <p className='text-muted-foreground text-sm mt-1'>
              Please read all instructions carefully before starting.
            </p>
          </div>
          <div className='text-right'>
            <p className='text-sm font-medium text-muted-foreground'>Candidate</p>
            <p className='text-lg font-bold text-primary'>
              {candidateInfo?.candidateName || candidateInfo?.fullName || 'Candidate'}
            </p>
            <p className='text-xs text-muted-foreground'>{candidateInfo?.applicationNo}</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {/* Main Instructions */}
          <div className='md:col-span-2 space-y-4'>
            <Card className="flex flex-col h-full">
              <CardHeader className='border-b bg-muted/50 py-3'>
                <CardTitle className='text-base'>Proctoring & Anti-Cheat Guidelines</CardTitle>
              </CardHeader>
              <CardContent className='pt-4 space-y-3 text-foreground/80 text-sm leading-snug flex-grow'>
                <div className='flex items-start gap-3'>
                  <Checkbox 
                    id="faceMonitoring" 
                    checked={agreements.faceMonitoring}
                    onCheckedChange={(c) => setAgreements(prev => ({...prev, faceMonitoring: !!c}))}
                    className="mt-1"
                  />
                  <label htmlFor="faceMonitoring" className="cursor-pointer">
                    <strong>Face Monitoring:</strong> Your webcam will be active during the entire
                    exam. If your face is not detected for 15 seconds, you will receive a warning.
                  </label>
                </div>
                <div className='flex items-start gap-3'>
                  <Checkbox 
                    id="multipleFaces" 
                    checked={agreements.multipleFaces}
                    onCheckedChange={(c) => setAgreements(prev => ({...prev, multipleFaces: !!c}))}
                    className="mt-1"
                  />
                  <label htmlFor="multipleFaces" className="cursor-pointer">
                    <strong>Multiple/Wrong Faces:</strong> If multiple faces or someone else&apos;s face is detected for 15 seconds, you will receive a warning.
                  </label>
                </div>
                <div className='flex items-start gap-3'>
                  <Checkbox 
                    id="warningsLimit" 
                    checked={agreements.warningsLimit}
                    onCheckedChange={(c) => setAgreements(prev => ({...prev, warningsLimit: !!c}))}
                    className="mt-1"
                  />
                  <label htmlFor="warningsLimit" className="cursor-pointer">
                    <strong>3 Warnings Limit:</strong> After 3 proctoring warnings (no face or wrong face), the exam will <strong>auto-submit immediately</strong>.
                  </label>
                </div>
                <div className='flex items-start gap-3'>
                  <Checkbox 
                    id="tabSwitching" 
                    checked={agreements.tabSwitching}
                    onCheckedChange={(c) => setAgreements(prev => ({...prev, tabSwitching: !!c}))}
                    className="mt-1"
                  />
                  <label htmlFor="tabSwitching" className="cursor-pointer">
                    <strong>Tab Switching:</strong> Switching tabs, minimizing the browser window,
                    or navigating away will result in an <strong>instant auto-submission</strong>.
                  </label>
                </div>
                <div className='flex items-start gap-3'>
                  <Checkbox 
                    id="autoSubmit" 
                    checked={agreements.autoSubmit}
                    onCheckedChange={(c) => setAgreements(prev => ({...prev, autoSubmit: !!c}))}
                    className="mt-1"
                  />
                  <label htmlFor="autoSubmit" className="cursor-pointer">
                    The exam will automatically submit when the timer reaches zero.
                  </label>
                </div>
                <div className='flex items-start gap-3'>
                  <Checkbox 
                    id="noRefresh" 
                    checked={agreements.noRefresh}
                    onCheckedChange={(c) => setAgreements(prev => ({...prev, noRefresh: !!c}))}
                    className="mt-1"
                  />
                  <label htmlFor="noRefresh" className="cursor-pointer">
                    Do not refresh the page or press the back button during the exam.
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exam Info Sidebar */}
          <div className='space-y-4 flex flex-col'>
            <Card>
              <CardHeader className='border-b bg-muted/50 py-3'>
                <CardTitle className='text-base'>Exam Details</CardTitle>
              </CardHeader>
              <CardContent className='pt-4 space-y-3'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-primary/10 rounded-lg text-primary'>
                    <Clock className='h-5 w-5' />
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground font-medium'>Start Time</p>
                    <p className='text-base font-semibold text-foreground'>
                      {examMeta?.startTime || '--'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/30 border-2 overflow-hidden shadow-sm">
              <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4 text-center">
                <CardTitle className="text-primary flex items-center justify-center gap-2 text-sm">
                  <Camera className="h-4 w-4" />
                  Identity Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex flex-col items-center gap-4">
                {!isFaceCaptureMode && !capturedImage && (
                  <div className="text-center w-full">
                    <p className="text-sm text-muted-foreground mb-4">
                      Please take a clear photo of your face. This will be used for live proctoring during the exam.
                    </p>
                    <Button onClick={handleTakePhotoClick} className="w-full">
                      <Camera className="mr-2 h-4 w-4" /> Take Photo
                    </Button>
                  </div>
                )}

                {isFaceCaptureMode && (
                  <div className="w-full">
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-border shadow-inner mb-3 group">
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        autoPlay
                        playsInline
                        muted
                      />
                      <div className="absolute inset-0 flex items-end justify-center pb-4 bg-gradient-to-t from-black/60 to-transparent">
                        <Button 
                          onClick={captureBaselineFace} 
                          className="shadow-lg shadow-black/50 bg-primary hover:bg-primary/90 text-white font-bold"
                        >
                          <Camera className="mr-2 h-4 w-4" />
                          Capture Now
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-foreground/80 animate-pulse text-center">
                      {faceCaptureStatus}
                    </p>
                  </div>
                )}

                {capturedImage && !isFaceCaptureMode && (
                  <div className="w-full text-center">
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-border shadow-inner mb-3">
                      <img src={capturedImage} alt="Captured Face" className="w-full h-full object-cover opacity-90" />
                    </div>
                    <p className="text-sm font-medium text-success flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Photo Captured Successfully
                    </p>
                    <Button variant="outline" size="sm" onClick={handleTakePhotoClick} className="mt-3 w-full">
                      Retake Photo
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              onClick={handleStartExamClick}
              disabled={(timeRemaining !== null && timeRemaining > 0) || !capturedImage || !allAgreed}
              size='lg'
              className='w-full text-base h-12 font-bold shadow-md transition-all mt-auto'
            >
              {timeRemaining !== null && timeRemaining > 0
                ? `Starts in ${formatTime(timeRemaining)}`
                : 'I am ready to begin'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
