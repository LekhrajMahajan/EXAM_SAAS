interface ImportProgressProps {
  progress: number;
  label: string;
}

export function ImportProgress({ progress, label }: ImportProgressProps) {
  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }} 
        />
      </div>
    </div>
  );
}
