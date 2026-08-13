import { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';

export interface ProctoringState {
  warnings: number;
  reason: string | null;
  isAutoSubmitted: boolean;
  statusMessage: string;
  isWarningActive: boolean;
}

export function useProctoring(baselineDescriptor: Float32Array | null, onAutoSubmit: (reason?: string) => void) {
  const [state, setState] = useState<ProctoringState>({
    warnings: 0,
    reason: null,
    isAutoSubmitted: false,
    statusMessage: 'Initializing camera...',
    isWarningActive: false
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const MAX_WARNINGS = 4;
  const noFaceTimer = useRef(0);
  const multipleFaceTimer = useRef(0);
  const wrongFaceTimer = useRef(0);

  // 1. Tab Switching Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !state.isAutoSubmitted) {
        const reason = 'Exam auto-submitted due to tab switching or minimizing window.';
        setState(prev => ({
          ...prev,
          isAutoSubmitted: true,
          reason: reason
        }));
        onAutoSubmit(reason);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isAutoSubmitted]);

  // 2. Face Detection Logic
  useEffect(() => {
    let isMounted = true;
    
    const initializeFaceApi = async () => {
      try {
        setState(prev => ({ ...prev, statusMessage: 'Loading face detection models...' }));
        // Load models from CDN to avoid downloading locally
        const MODEL_URL = 'https://cdn.jsdelivr.net/gh/vladmandic/face-api/model/';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);

        if (!isMounted) return;

        setState(prev => ({ ...prev, statusMessage: 'Starting camera...' }));
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Must play video explicitly in some browsers
          await videoRef.current.play().catch(e => console.warn("Video play error", e));
        }

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

        try {
          // Lowered scoreThreshold slightly to catch faces in the background better
          const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.25 }))
            .withFaceLandmarks()
            .withFaceDescriptors();

          if (detections.length === 0) {
            noFaceTimer.current += 3;
            multipleFaceTimer.current = 0;
            wrongFaceTimer.current = 0;
            if (noFaceTimer.current >= 9) {
              handleWarning('No face detected. Please face the camera properly.', 'Exam auto-submitted due to no face detected for an extended period.');
              noFaceTimer.current = 0;
            }
          } else if (detections.length > 1) {
            multipleFaceTimer.current += 3;
            noFaceTimer.current = 0;
            wrongFaceTimer.current = 0;
            if (multipleFaceTimer.current >= 6) {
              handleWarning('Multiple faces detected. Ensure nobody else is in the frame.', 'Exam auto-submitted due to multiple faces detected.');
              multipleFaceTimer.current = 0;
            }
          } else {
            noFaceTimer.current = 0;
            multipleFaceTimer.current = 0;
            const distance = faceapi.euclideanDistance(detections[0].descriptor, baselineDescriptor);
            if (distance > 0.55) {
              wrongFaceTimer.current += 3;
              if (wrongFaceTimer.current >= 9) {
                handleWarning('Unrecognized face detected. Please verify your identity.', 'Exam auto-submitted due to unrecognized face.');
                wrongFaceTimer.current = 0;
              }
            } else {
              wrongFaceTimer.current = 0;
            }
          }
        } catch (error) {
          console.error("Detection error", error);
        }
      }, 3000); // Check every 3 seconds
    };

    const handleWarning = (msg: string, autoSubmitReason: string) => {
      setState(prev => {
        const newWarnings = prev.warnings + 1;
        if (newWarnings >= MAX_WARNINGS) {
          if (!prev.isAutoSubmitted) {
            setTimeout(() => onAutoSubmit(autoSubmitReason), 0);
            return {
              ...prev,
              warnings: newWarnings,
              isAutoSubmitted: true,
              reason: autoSubmitReason,
              isWarningActive: true
            };
          }
        }
        
        setTimeout(() => {
          setState(s => ({ ...s, isWarningActive: false }));
        }, 3000);

        return {
          ...prev,
          warnings: newWarnings,
          statusMessage: msg,
          isWarningActive: true
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
  }, [baselineDescriptor, state.isAutoSubmitted]);

  return { state, videoRef };
}
