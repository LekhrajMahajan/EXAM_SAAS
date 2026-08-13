import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { BadgeCheck, CreditCard } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

interface IdentityCardProps {
  isActive: boolean;
}

export function IdentityCard({ isActive }: IdentityCardProps) {
  if (!isActive) return null;

  return (
    <Card className="border-indigo-100 shadow-sm bg-indigo-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-indigo-900">
          <CreditCard className="w-4 h-4 text-indigo-600" />
          Identity Proof Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-slate-700 leading-relaxed">
          Please request a valid original photo ID from the candidate (Aadhaar, PAN, Passport, Voter ID, or Driving License).
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="w-full bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50">
            Scan ID Barcode
          </Button>
          <Button variant="outline" className="w-full bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50">
            Capture ID Photo
          </Button>
        </div>
        <div className="flex items-center justify-center p-4 border border-dashed border-indigo-200 rounded-md bg-white text-indigo-400 text-sm font-medium">
          <BadgeCheck className="w-5 h-5 mr-2" />
          Verify details match Application
        </div>
      </CardContent>
    </Card>
  );
}
