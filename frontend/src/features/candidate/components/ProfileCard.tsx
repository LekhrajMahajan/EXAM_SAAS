import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import type { CandidateProfile } from '../types';
import { User, Mail, Phone, MapPin, Briefcase, FileDigit, Image as ImageIcon } from 'lucide-react';

interface ProfileCardProps {
  profile: CandidateProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 h-32 w-full relative">
      </div>
      <CardContent className="pt-0 relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start -mt-12 mb-6">
          <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-md flex flex-shrink-0 items-center justify-center overflow-hidden">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt="Candidate" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-slate-300" />
            )}
          </div>
          <div className="mt-2 sm:mt-12 flex-1">
            <h3 className="text-2xl font-bold text-slate-900">{profile.firstName} {profile.lastName}</h3>
            <p className="text-slate-500 font-medium">{profile.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Email Address</p>
                  <p className="text-sm font-medium text-slate-900">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Phone Number</p>
                  <p className="text-sm font-medium text-slate-900">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="text-sm font-medium text-slate-900">{profile.address}, {profile.city}</p>
                  <p className="text-sm font-medium text-slate-900">{profile.state}, {profile.country} {profile.pincode}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Identity & Education</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Briefcase className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Highest Education</p>
                  <p className="text-sm font-medium text-slate-900">{profile.education}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileDigit className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Identity Proof ({profile.identityProofType})</p>
                  <p className="text-sm font-medium text-slate-900">{profile.identityProofNumber}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
               <p className="text-xs text-slate-500 mb-2">Signature</p>
               <div className="w-48 h-16 bg-slate-50 border border-slate-200 border-dashed rounded flex items-center justify-center">
                 {profile.signatureUrl ? (
                   <img src={profile.signatureUrl} alt="Signature" className="max-h-full max-w-full" />
                 ) : (
                   <ImageIcon className="w-6 h-6 text-slate-300" />
                 )}
               </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
