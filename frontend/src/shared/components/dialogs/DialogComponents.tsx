import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export type DialogType = 'info' | 'success' | 'warning' | 'error' | 'delete' | 'confirm';

interface GenericDialogProps {
  isOpen: boolean;
  type?: DialogType;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export function GenericDialog({ 
  isOpen, 
  type = 'info', 
  title, 
  message, 
  confirmLabel = 'Confirm', 
  cancelLabel = 'Cancel', 
  onConfirm, 
  onCancel,
  isProcessing
}: GenericDialogProps) {
  if (!isOpen) return null;

  const config = {
    info: { icon: Info, color: 'text-info', bg: 'bg-info/10', btn: 'bg-info text-white hover:opacity-90' },
    success: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', btn: 'bg-success text-white hover:opacity-90' },
    warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', btn: 'bg-warning text-white hover:opacity-90' },
    error: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', btn: 'bg-destructive text-white hover:opacity-90' },
    delete: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', btn: 'bg-destructive text-white hover:opacity-90' },
    confirm: { icon: Info, color: 'text-primary', bg: 'bg-primary/10', btn: 'bg-primary text-primary-foreground hover:bg-primary/90' },
  }[type];

  const Icon = config.icon;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-50 backdrop-blur-sm" onClick={!isProcessing ? onCancel : undefined} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-xl shadow-2xl z-50 p-6 border border-border">
        <div className="flex flex-col items-center text-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${config.bg} ${config.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-card-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-6">{message}</p>
          <div className="flex w-full gap-3">
            <Button variant="outline" className="flex-1 bg-background hover:bg-muted text-card-foreground" onClick={onCancel} disabled={isProcessing}>
              {cancelLabel}
            </Button>
            <Button className={`flex-1 text-white ${config.btn}`} onClick={onConfirm} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
