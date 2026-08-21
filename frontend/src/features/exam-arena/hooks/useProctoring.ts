import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

export interface ProctoringState {
  fdWarnings: number;
  mfWarnings: number;
  maxWarnings: number;
  reason: string | null;
  isAutoSubmitted: boolean;
  statusMessage: string;
  isWarningActive: boolean;
  activeWarningType: 'FACE_DETECTION' | 'MULTIPLE_FACES' | null;
}

export interface SecuritySettings {
  faceDetectionEnabled?: boolean;
  faceDetectionLimit?: number;
  multipleFacesEnabled?: boolean;
  multipleFacesLimit?: number;
  proctoringWarningEnabled?: boolean;
  proctoringWarningLimit?: number;
  tabSwitchingEnabled?: boolean;
}

export function useProctoring(
  baselineDescriptor: Float32Array | null,
  settings: SecuritySettings,
  onAutoSubmit: (reason?: string) => void
) {
  const maxWarnings = settings.proctoringWarningEnabled ? (settings.proctoringWarningLimit ?? 3) : Infinity;

  const [state, setState] = useState<ProctoringState>({
    fdWarnings: 0,
    mfWarnings: 0,
    maxWarnings,
    reason: null,
    isAutoSubmitted: false,
    statusMessage: 'Initializing camera...',
    isWarningActive: false,
    activeWarningType: null
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const noFaceTimer = useRef<number>(0);
  const multipleFaceTimer = useRef<number>(0);
  const wrongFaceTimer = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);

  // 1. Tab Switching Detection
  useEffect(() => {
    const triggerTabSwitchWarning = () => {
      if (settings.tabSwitchingEnabled && !state.isAutoSubmitted) {
        const reason = 'Exam auto-submitted due to tab switching or minimizing window.';
        setState(prev => ({
          ...prev,
          isAutoSubmitted: true,
          reason: reason
        }));
        onAutoSubmit(reason);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) triggerTabSwitchWarning();
    };

    const handleBlur = () => {
      triggerTabSwitchWarning();
    };

    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isAutoSubmitted, settings.tabSwitchingEnabled]);

  // 2. Face Detection Logic
  useEffect(() => {
    let isMounted = true;
    
    const initializeFaceApi = async () => {
      try {
        setState(prev => ({ ...prev, statusMessage: 'Starting camera...' }));
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Must play video explicitly in some browsers
          await videoRef.current.play().catch(e => console.warn("Video play error", e));
        }

        if (!isMounted) return;

        setState(prev => ({ ...prev, statusMessage: 'Loading face detection models...' }));
        // Load models from CDN to avoid downloading locally
        const MODEL_URL = 'https://cdn.jsdelivr.net/gh/vladmandic/face-api/model/';
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);

        if (!isMounted) return;

        setState(prev => ({ ...prev, statusMessage: 'Proctoring Active' }));
        startDetectionLoop();
      } catch (err) {
        console.error("Camera or Face API error:", err);
        setState(prev => ({ ...prev, statusMessage: 'Failed to access camera or load models' }));
      }
    };

    const startDetectionLoop = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      
      intervalRef.current = setInterval(async () => {
        if (!videoRef.current || !baselineDescriptor || state.isAutoSubmitted) return;
        
        const video = videoRef.current;
        if (video.paused || video.ended) return;

        const fdEnabled = settings.faceDetectionEnabled ?? false;
        const fdLimit = settings.faceDetectionLimit || 15;
        const mfEnabled = settings.multipleFacesEnabled ?? false;
        const mfLimit = settings.multipleFacesLimit || 15;

        if (!fdEnabled && !mfEnabled) return;

        try {
          // Using SsdMobilenetv1 for much higher accuracy in detecting multiple faces and background faces
          const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
            .withFaceLandmarks()
            .withFaceDescriptors();

          const now = Date.now();
          if (lastFrameTime.current === 0) lastFrameTime.current = now;
          const delta = Math.min(now - lastFrameTime.current, 2000); // cap at 2s max delta if tab was asleep
          lastFrameTime.current = now;

          if (detections.length === 0) {
            multipleFaceTimer.current = Math.max(0, multipleFaceTimer.current - delta);
            wrongFaceTimer.current = Math.max(0, wrongFaceTimer.current - delta);
            if (fdEnabled) {
              noFaceTimer.current += delta;
              if (noFaceTimer.current >= fdLimit * 1000) {
                handleWarning('No face detected. Please face the camera properly.', 'Exam auto-submitted due to no face detected for an extended period.', 'FACE_DETECTION');
                noFaceTimer.current = 0;
              }
            }
          } else if (detections.length > 1) {
            noFaceTimer.current = Math.max(0, noFaceTimer.current - delta);
            wrongFaceTimer.current = Math.max(0, wrongFaceTimer.current - delta);
            if (mfEnabled) {
              multipleFaceTimer.current += delta;
              if (multipleFaceTimer.current >= mfLimit * 1000) {
                handleWarning('Multiple faces detected. Ensure nobody else is in the frame.', 'Exam auto-submitted due to multiple faces detected.', 'MULTIPLE_FACES');
                multipleFaceTimer.current = 0;
              }
            }
          } else {
            noFaceTimer.current = Math.max(0, noFaceTimer.current - delta);
            multipleFaceTimer.current = Math.max(0, multipleFaceTimer.current - delta);
            if (mfEnabled) {
              const distance = faceapi.euclideanDistance(detections[0].descriptor, baselineDescriptor);
              // Set threshold strictly at 0.45 so even similar looking different faces are caught
              if (distance > 0.45) {
                wrongFaceTimer.current += delta;
                if (wrongFaceTimer.current >= mfLimit * 1000) {
                  handleWarning('Unrecognized face warning', 'Exam auto-submitted due to unrecognized face.', 'FACE_DETECTION');
                  wrongFaceTimer.current = 0;
                }
              } else {
                wrongFaceTimer.current = Math.max(0, wrongFaceTimer.current - delta);
                // Face matches, clear any active warnings
                setState(prev => {
                  if (prev.isWarningActive || prev.statusMessage !== 'Proctoring Active') {
                    return { ...prev, isWarningActive: false, activeWarningType: null, statusMessage: 'Proctoring Active' };
                  }
                  return prev;
                });
              }
            } else {
              // Face detected, and mfEnabled is false (no mismatch check), clear warnings
              setState(prev => {
                if (prev.isWarningActive || prev.statusMessage !== 'Proctoring Active') {
                  return { ...prev, isWarningActive: false, activeWarningType: null, statusMessage: 'Proctoring Active' };
                }
                return prev;
              });
            }
          }
        } catch (error) {
          console.error("Detection error", error);
        }
      }, 1000); // Check every 1 second for higher accuracy
    };

    const handleWarning = (msg: string, autoSubmitReason: string, type: 'FACE_DETECTION' | 'MULTIPLE_FACES') => {
      setState(prev => {
        const newFdWarnings = type === 'FACE_DETECTION' ? prev.fdWarnings + 1 : prev.fdWarnings;
        const newMfWarnings = type === 'MULTIPLE_FACES' ? prev.mfWarnings + 1 : prev.mfWarnings;
        
        const currentWarnings = type === 'FACE_DETECTION' ? newFdWarnings : newMfWarnings;
        const maxWarns = settings.proctoringWarningEnabled ? (settings.proctoringWarningLimit ?? 3) : Infinity;
        
        // Auto-submit only when currentWarnings strictly exceeds maxWarnings
        if (settings.proctoringWarningEnabled && currentWarnings > maxWarns) {
          if (!prev.isAutoSubmitted) {
            setTimeout(() => onAutoSubmit(autoSubmitReason), 0);
            return {
              ...prev,
              fdWarnings: newFdWarnings,
              mfWarnings: newMfWarnings,
              maxWarnings: maxWarns,
              isAutoSubmitted: true,
              reason: autoSubmitReason,
              isWarningActive: true,
              activeWarningType: type
            };
          }
        }
        
        // Removed the 3-second auto-clear setTimeout so the warning stays on screen
        // until the candidate corrects the issue and the face is detected normally again.

        return {
          ...prev,
          fdWarnings: newFdWarnings,
          mfWarnings: newMfWarnings,
          maxWarnings: maxWarns,
          statusMessage: msg,
          isWarningActive: true,
          activeWarningType: type
        };
      });
    };

    if (baselineDescriptor) {
      initializeFaceApi();
    }

    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baselineDescriptor, state.isAutoSubmitted, settings]);

  return { state, videoRef };
}
