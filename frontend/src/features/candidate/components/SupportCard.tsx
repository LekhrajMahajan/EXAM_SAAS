import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/components/ui/card';
import { HelpCircle, Mail, Phone } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export function SupportCard() {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Need Assistance?</CardTitle>
        <CardDescription>Our support team is here to help you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
               <Phone className="w-5 h-5 text-indigo-600" />
             </div>
             <div>
               <p className="text-xs font-medium text-slate-500 uppercase">Toll Free</p>
               <p className="font-bold text-slate-900">1800-123-4567</p>
             </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
               <Mail className="w-5 h-5 text-indigo-600" />
             </div>
             <div>
               <p className="text-xs font-medium text-slate-500 uppercase">Email Support</p>
               <p className="font-bold text-slate-900">support@examportal.com</p>
             </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-slate-100 flex justify-center">
          <Button className="w-full sm:w-auto">
            <HelpCircle className="w-4 h-4 mr-2" />
            Raise a Ticket
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
