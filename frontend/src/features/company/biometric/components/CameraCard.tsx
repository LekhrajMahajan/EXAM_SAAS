import React, { useState } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Camera, ScanFace, RefreshCcw } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CameraCardProps {
  onCapture: () => void;
  isCapturing: boolean;
}

export function CameraCard({ onCapture, isCapturing }: CameraCardProps) {
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    setCaptured(true);
    onCapture();
  };

  const handleRetake = () => {
    setCaptured(false);
  };

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden bg-slate-900 text-slate-100">
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium">Live Feed</span>
        </div>
        <Camera className="w-4 h-4 text-slate-400" />
      </div>
      <CardContent className="p-0">
        <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
          {!captured ? (
             <>
               {/* Viewfinder overlay */}
               <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="w-48 h-64 border-2 border-dashed border-indigo-500/50 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               </div>
               
               {/* Simulated camera feed */}
               <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                 <ScanFace className="w-20 h-20 text-slate-700 animate-pulse" />
               </div>
               
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                 <Button 
                   size="lg" 
                   onClick={handleCapture}
                   disabled={isCapturing}
                   className="rounded-full w-16 h-16 bg-white hover:bg-slate-200 text-slate-900 shadow-[0_0_0_4px_rgba(255,255,255,0.2)]"
                 >
                   <Camera className="w-6 h-6" />
                 </Button>
               </div>
             </>
          ) : (
            <>
              <div className="absolute inset-0 bg-indigo-900 flex items-center justify-center">
                 <ScanFace className="w-20 h-20 text-indigo-400" />
                 <div className="absolute inset-0 bg-indigo-500/20 animate-pulse mix-blend-overlay" />
                 <div className="absolute inset-y-0 w-full bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
              </div>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4">
                 <Button 
                   variant="outline" 
                   onClick={handleRetake}
                   disabled={isCapturing}
                   className="bg-slate-900/50 border-slate-700 hover:bg-slate-800"
                 >
                   <RefreshCcw className="w-4 h-4 mr-2" /> Retake
                 </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </Card>
  );
}
