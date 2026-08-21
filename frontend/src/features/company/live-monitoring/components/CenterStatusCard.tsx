import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { LiveCenter } from '../types';
import { ConnectionBadge } from './ConnectionBadge';
import { Users, Server, HardDrive, ShieldAlert } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Progress } from '@/shared/components/ui/progress';

interface CenterStatusCardProps {
  center: LiveCenter;
}

export function CenterStatusCard({ center }: CenterStatusCardProps) {
  return (
    <Card className="border-border shadow-sm bg-card">
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg text-foreground">{center.name}</CardTitle>
          <p className="text-xs text-muted-foreground mt-1">Center ID: {center.id}</p>
        </div>
        <ConnectionBadge status={center.status} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted/50 p-3 rounded-lg border border-border flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded">
               <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Candidates</p>
              <p className="font-bold text-foreground">{center.activeCandidates}</p>
            </div>
          </div>
          <div className="bg-muted/50 p-3 rounded-lg border border-border flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded">
               <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="font-bold text-foreground">{center.completedCandidates}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-muted-foreground flex items-center gap-1">
                 <Server className="w-3 h-3" /> Network Health
              </span>
              <span className={center.networkHealth < 80 ? "text-destructive font-bold" : "text-primary font-bold"}>
                {center.networkHealth}%
              </span>
            </div>
            <Progress value={center.networkHealth} className="h-1.5" />
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-muted-foreground flex items-center gap-1">
                 <HardDrive className="w-3 h-3" /> Device Health
              </span>
              <span className={center.deviceHealth < 80 ? "text-destructive font-bold" : "text-primary font-bold"}>
                {center.deviceHealth}%
              </span>
            </div>
            <Progress value={center.deviceHealth} className="h-1.5" />
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
           <Button variant="outline" className="w-full h-8 text-xs bg-card">View Center Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}
