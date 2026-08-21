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
  photo?: string
}

interface ExamMeta {
  _id: string
  examTitle: string
  examCode: string
  examDate: string
  startTime: string
  duration: number
  securitySettings?: {
    faceDetectionEnabled?: boolean
    faceDetectionLimit?: number
    multipleFacesEnabled?: boolean
    multipleFacesLimit?: number
    proctoringWarningEnabled?: boolean
    proctoringWarningLimit?: number
    tabSwitchingEnabled?: boolean
  }
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
  const [snapshotBase64, setSnapshotBase64] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [faceApiLoaded, setFaceApiLoaded] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
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
        
        setAgreements({
          faceMonitoring: !meta.securitySettings?.faceDetectionEnabled,
          multipleFaces: !meta.securitySettings?.multipleFacesEnabled,
          warningsLimit: !meta.securitySettings?.proctoringWarningEnabled,
          tabSwitching: !meta.securitySettings?.tabSwitchingEnabled,
          autoSubmit: false,
          noRefresh: false
        })

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

        // Load face-api models
        const MODEL_URL = 'https://cdn.jsdelivr.net/gh/vladmandic/face-api/model/'
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
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

  const takeSnapshot = () => {
    if (!videoRef.current) return

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
    }
    const capturedBase64 = canvas.toDataURL('image/jpeg')
    
    setSnapshotBase64(capturedBase64)
    
    // Stop video track
    if (videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
    setFaceCaptureStatus('Photo captured. Click "Scan & Verify" to proceed.')
  }

  const verifySnapshot = async () => {
    if (!snapshotBase64) return

    setIsScanning(true)
    setFaceCaptureStatus('Scanning face and verifying...')

    try {
      const snapshotImg = document.createElement('img')
      snapshotImg.src = snapshotBase64
      await new Promise((resolve, reject) => {
        snapshotImg.onload = resolve
        snapshotImg.onerror = reject
      })

      const liveDetections = await faceapi
        .detectAllFaces(snapshotImg, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
        .withFaceLandmarks()
        .withFaceDescriptors()

      if (liveDetections && liveDetections.length === 1) {
        if (!candidateInfo?.photo) {
          setFaceCaptureStatus('Verification failed. No profile photo found for this candidate.')
          setIsScanning(false)
          return
        }

        setFaceCaptureStatus('Verifying against profile photo...')
        
        const imgElement = document.createElement('img')
        imgElement.crossOrigin = 'anonymous'
        imgElement.src = candidateInfo.photo
        
        await new Promise((resolve, reject) => {
          imgElement.onload = resolve
          imgElement.onerror = reject
        })

        const originalDetection = await faceapi
          .detectSingleFace(imgElement, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
          .withFaceLandmarks()
          .withFaceDescriptor()

        if (!originalDetection) {
          setFaceCaptureStatus('Could not detect face in profile photo. Verification failed.')
          setIsScanning(false)
          return
        } else {
          const distance = faceapi.euclideanDistance(originalDetection.descriptor, liveDetections[0].descriptor)
          if (distance > 0.6) {
            setFaceCaptureStatus(`Verification failed. Face does not match profile photo. Please try again.`)
            setIsScanning(false)
            return
          }
        }

        setFaceCaptureStatus('Face verified successfully!')

        // Save the live baseline descriptor array to localStorage (robust for proctoring)
        localStorage.setItem(
          'baseline_face_descriptor',
          JSON.stringify(Array.from(liveDetections[0].descriptor)),
        )

        localStorage.setItem('baseline_face_image', snapshotBase64)
        setCapturedImage(snapshotBase64)

        setIsFaceCaptureMode(false)
        setSnapshotBase64(null)
        setIsScanning(false)
      } else if (liveDetections && liveDetections.length > 1) {
        setFaceCaptureStatus('Multiple faces detected! Please retake photo.')
        setIsScanning(false)
      } else {
        setFaceCaptureStatus('No face detected. Please retake photo.')
        setIsScanning(false)
      }
    } catch (e) {
      console.error("Error verifying against profile photo:", e)
      setFaceCaptureStatus('Error loading profile photo. Verification failed.')
      setIsScanning(false)
    }
  }

  // Handle Face Capture Initialization only when user is ready and no snapshot taken
  useEffect(() => {
    if (isFaceCaptureMode && !snapshotBase64) {
      // Need a small timeout to ensure videoRef is available after state change
      setTimeout(() => {
        if (videoRef.current) {
          navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
              if (videoRef.current) {
                videoRef.current.srcObject = stream
                videoRef.current.play()
                setFaceCaptureStatus('Please position your face and click "Take Photo".')
              }
            })
            .catch((err) => {
              console.error('Camera error:', err)
              setFaceCaptureStatus('Camera access denied. Please allow camera access to proceed.')
            })
        }
      }, 100)
    }
  }, [isFaceCaptureMode, snapshotBase64])

  const handleTakePhotoClick = () => {
    if (!faceApiLoaded) {
      alert('Proctoring models are still loading, please wait a moment.')
      return
    }
    setSnapshotBase64(null)
    setCapturedImage(null)
    setIsFaceCaptureMode(true)
    setIsScanning(false)
    setFaceCaptureStatus('Starting camera...')
  }

  const handleStartExamClick = () => {
    if (!capturedImage) {
      alert('Please verify your identity first.')
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
          <div className='flex items-center gap-4 text-right'>
            {candidateInfo?.photo && (
              <div className="w-16 h-16 rounded-md overflow-hidden border border-border shadow-sm flex-shrink-0">
                <img src={candidateInfo.photo} alt="Candidate Profile" className="w-full h-full object-cover" crossOrigin="anonymous" />
              </div>
            )}
            <div>
              <p className='text-sm font-medium text-muted-foreground'>Candidate</p>
              <p className='text-lg font-bold text-primary'>
                {candidateInfo?.candidateName || candidateInfo?.fullName || 'Candidate'}
              </p>
              <p className='text-xs text-muted-foreground'>{candidateInfo?.applicationNo}</p>
            </div>
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
                {examMeta?.securitySettings?.faceDetectionEnabled && (
                  <div className='flex items-start gap-3'>
                    <Checkbox 
                      id="faceMonitoring" 
                      checked={agreements.faceMonitoring}
                      onCheckedChange={(c) => setAgreements(prev => ({...prev, faceMonitoring: !!c}))}
                      className="mt-1"
                    />
                    <label htmlFor="faceMonitoring" className="cursor-pointer">
                      <strong>Face Monitoring:</strong> Your webcam will be active during the entire
                      exam. If your face is not detected for {(() => {
                        const limit = examMeta.securitySettings?.faceDetectionLimit || 15;
                        return limit >= 60 && limit % 60 === 0 ? `${limit / 60} minute${limit / 60 > 1 ? 's' : ''}` : `${limit} second${limit > 1 ? 's' : ''}`;
                      })()}, you will receive a warning.
                    </label>
                  </div>
                )}
                {examMeta?.securitySettings?.multipleFacesEnabled && (
                  <div className='flex items-start gap-3'>
                    <Checkbox 
                      id="multipleFaces" 
                      checked={agreements.multipleFaces}
                      onCheckedChange={(c) => setAgreements(prev => ({...prev, multipleFaces: !!c}))}
                      className="mt-1"
                    />
                    <label htmlFor="multipleFaces" className="cursor-pointer">
                      <strong>Multiple/Wrong Faces:</strong> If multiple faces or someone else&apos;s face is detected for {(() => {
                        const limit = examMeta.securitySettings?.multipleFacesLimit || 15;
                        return limit >= 60 && limit % 60 === 0 ? `${limit / 60} minute${limit / 60 > 1 ? 's' : ''}` : `${limit} second${limit > 1 ? 's' : ''}`;
                      })()}, you will receive a warning.
                    </label>
                  </div>
                )}
                {examMeta?.securitySettings?.proctoringWarningEnabled && (
                  <div className='flex items-start gap-3'>
                    <Checkbox 
                      id="warningsLimit" 
                      checked={agreements.warningsLimit}
                      onCheckedChange={(c) => setAgreements(prev => ({...prev, warningsLimit: !!c}))}
                      className="mt-1"
                    />
                    <label htmlFor="warningsLimit" className="cursor-pointer">
                      <strong>{examMeta.securitySettings.proctoringWarningLimit || 3} Warnings Limit:</strong> After {examMeta.securitySettings.proctoringWarningLimit || 3} proctoring warnings (no face or wrong face), the exam will <strong>auto-submit immediately</strong>.
                    </label>
                  </div>
                )}
                {examMeta?.securitySettings?.tabSwitchingEnabled && (
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
                )}
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
                      Please position your face to verify your identity against your registered profile photo.
                    </p>
                    <Button onClick={handleTakePhotoClick} className="w-full">
                      <Camera className="mr-2 h-4 w-4" /> Verify Identity
                    </Button>
                  </div>
                )}

                {isFaceCaptureMode && (
                  <div className="w-full">
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-border shadow-inner mb-3 group">
                      {!snapshotBase64 ? (
                        <>
                          <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                            muted
                          />
                          <div className="absolute inset-0 flex items-end justify-center pb-4 bg-gradient-to-t from-black/60 to-transparent">
                            <Button 
                              onClick={takeSnapshot} 
                              className="shadow-lg shadow-black/50 bg-primary hover:bg-primary/90 text-white font-bold"
                            >
                              <Camera className="mr-2 h-4 w-4" />
                              Take Photo
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <img src={snapshotBase64} alt="Snapshot" className="w-full h-full object-cover" />
                          {isScanning && (
                            <div className="absolute inset-0 z-20 bg-black/40 flex flex-col items-center justify-center backdrop-blur-[2px]">
                              <style>{`
                                @keyframes scanline {
                                  0% { top: 0%; }
                                  50% { top: 100%; }
                                  100% { top: 0%; }
                                }
                              `}</style>
                              <div className="relative w-2/3 h-2/3 border-2 border-primary/50 rounded-lg overflow-hidden flex items-center justify-center">
                                <div className="absolute left-0 right-0 h-1 bg-primary shadow-[0_0_15px_3px_hsl(var(--primary))]" style={{ animation: 'scanline 2s ease-in-out infinite' }} />
                                <Loader2 className="w-8 h-8 text-primary animate-spin opacity-50" />
                              </div>
                              <p className="mt-4 text-primary font-bold animate-pulse tracking-wide text-sm bg-black/50 px-3 py-1 rounded-full">{faceCaptureStatus}</p>
                            </div>
                          )}
                          {!isScanning && (
                            <div className="absolute inset-0 flex items-end justify-center pb-4 gap-3 bg-linear-to-t from-black/60 to-transparent">
                              <Button 
                                variant="secondary"
                                onClick={() => setSnapshotBase64(null)} 
                                className="shadow-lg shadow-black/50 font-bold"
                              >
                                Retake Photo
                              </Button>
                              <Button 
                                onClick={verifySnapshot} 
                                className="shadow-lg shadow-black/50 bg-primary hover:bg-primary/90 text-white font-bold"
                              >
                                Scan & Verify
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {!isScanning && (
                      <p className={`text-xs font-medium text-foreground/80 animate-pulse text-center`}>
                        {faceCaptureStatus}
                      </p>
                    )}
                  </div>
                )}

                {capturedImage && !isFaceCaptureMode && (
                  <div className="w-full text-center">
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-border shadow-inner mb-3">
                      <img src={capturedImage} alt="Captured Face" className="w-full h-full object-cover opacity-90" />
                    </div>
                    <p className="text-sm font-medium text-success flex items-center justify-center gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Identity Verified Successfully
                    </p>
                    <Button variant="outline" size="sm" onClick={handleTakePhotoClick} className="mt-3 w-full">
                      Retry Scan
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
