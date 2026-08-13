import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useCenterInfrastructureStore, type CenterInfrastructureData } from '../store/useCenterInfrastructureStore';
import { 
  Settings, 
  Plus, 
  Server, 
  ShieldCheck, 
  Building2,
  X,
  ServerCrash
} from 'lucide-react';
import toast from 'react-hot-toast';

export const CenterInfrastructurePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isReadOnly = Boolean(id) && user?.role !== 'CENTER_MANAGER';

  const { data, isLoading, fetchInfrastructure, saveInfrastructure } = useCenterInfrastructureStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CenterInfrastructureData>({
    spaceAndFacilities: {
      totalArea: '',
      examRooms: '',
      washrooms: '',
      parkingCapacity: ''
    },
    technical: {
      serverRooms: '',
      powerBackup: '',
      internetISP: '',
      internetSpeed: ''
    },
    security: {
      cctvCameras: '',
      biometricDevices: '',
      friskingEnclosures: '',
      baggageCounter: ''
    }
  });

  useEffect(() => {
    fetchInfrastructure(id);
  }, [fetchInfrastructure, id]);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (section: keyof CenterInfrastructureData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      await saveInfrastructure(formData);
      toast.success('Infrastructure details saved successfully');
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save infrastructure details');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-[#2D3E2C] text-secondary rounded-xl p-6 shadow-xl border border-secondary/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-secondary/15 rounded-xl border border-secondary/30 text-secondary mt-1">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Center Infrastructure
            </h1>
            <p className="text-sm text-secondary/90 mt-1 max-w-2xl leading-relaxed font-medium">
              Manage your physical facilities, lab counts, and security hardware.
            </p>
          </div>
        </div>
        {!isReadOnly && (
          <Button 
            onClick={handleOpenModal}
            className="bg-secondary hover:bg-[#d0ed76] text-[#2D3E2C] font-bold flex items-center gap-2 px-6 shadow-md"
          >
            <Plus className="w-4 h-4" />
            {data ? 'Edit Infrastructure' : 'Add Infrastructure'}
          </Button>
        )}
      </div>

      {/* Main Details Card */}
      {data ? (
        <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-md shadow-xl rounded-xl overflow-hidden text-white">
          <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2">
            <ServerCrash className="w-5 h-5 text-secondary" />
            <h2 className="font-semibold text-slate-200">Infrastructure Overview</h2>
          </div>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Space & Facilities */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <Building2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-slate-300 uppercase text-sm tracking-wider">Space & Facilities</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Total Area:</span>
                    <span className="font-medium text-slate-100">{data.spaceAndFacilities?.totalArea || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Exam Rooms:</span>
                    <span className="font-medium text-slate-100">{data.spaceAndFacilities?.examRooms || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Washrooms:</span>
                    <span className="font-medium text-slate-100">{data.spaceAndFacilities?.washrooms || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-slate-400">Parking Capacity:</span>
                    <span className="font-medium text-slate-100">{data.spaceAndFacilities?.parkingCapacity || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Technical */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <Server className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h3 className="font-bold text-slate-300 uppercase text-sm tracking-wider">Technical</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-start border-b border-slate-800 pb-2 gap-4">
                    <span className="text-slate-400 whitespace-nowrap">Server Rooms:</span>
                    <span className="font-medium text-slate-100 text-right">{data.technical?.serverRooms || '-'}</span>
                  </div>
                  <div className="flex justify-between items-start border-b border-slate-800 pb-2 gap-4">
                    <span className="text-slate-400 whitespace-nowrap">Power Backup:</span>
                    <span className="font-medium text-slate-100 text-right">{data.technical?.powerBackup || '-'}</span>
                  </div>
                  <div className="flex justify-between items-start border-b border-slate-800 pb-2 gap-4">
                    <span className="text-slate-400 whitespace-nowrap">Internet ISP:</span>
                    <span className="font-medium text-slate-100 text-right">{data.technical?.internetISP || '-'}</span>
                  </div>
                  <div className="flex justify-between items-start pb-2 gap-4">
                    <span className="text-slate-400 whitespace-nowrap">Internet Speed:</span>
                    <span className="font-medium text-slate-100 text-right">{data.technical?.internetSpeed || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-slate-300 uppercase text-sm tracking-wider">Security</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">CCTV Cameras:</span>
                    <span className="font-medium text-slate-100">{data.security?.cctvCameras || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Biometric Devices:</span>
                    <span className="font-medium text-slate-100">{data.security?.biometricDevices || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-slate-400">Frisking Enclosures:</span>
                    <span className="font-medium text-slate-100">{data.security?.friskingEnclosures || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-slate-400">Baggage Counter:</span>
                    <span className="font-medium text-slate-100">{data.security?.baggageCounter || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-900/50 border-slate-800/80 backdrop-blur-md">
          <CardContent className="p-16 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800/80 border border-slate-700 rounded-full flex items-center justify-center mb-2">
              <ServerCrash className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-white">No Infrastructure Details Found</h3>
            <p className="text-slate-400 mt-2 max-w-sm leading-relaxed text-sm">
              You haven&apos;t added your center&apos;s infrastructure details yet. Click the <span className="text-secondary font-semibold">Add Infrastructure</span> button above to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-5xl mx-4 max-h-[90vh] overflow-y-auto text-slate-100">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg">
                  <ServerCrash className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Add Infrastructure Details</h2>
              </div>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* Modal Space & Facilities */}
                <div className="space-y-6 bg-slate-950/30 p-5 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Space & Facilities</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-medium">Total Area</Label>
                    <Input 
                      value={formData.spaceAndFacilities.totalArea} 
                      onChange={(e) => handleInputChange('spaceAndFacilities', 'totalArea', e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-medium">Exam Rooms</Label>
                    <Input 
                      value={formData.spaceAndFacilities.examRooms} 
                      onChange={(e) => handleInputChange('spaceAndFacilities', 'examRooms', e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-medium">Washrooms</Label>
                    <Input 
                      value={formData.spaceAndFacilities.washrooms} 
                      onChange={(e) => handleInputChange('spaceAndFacilities', 'washrooms', e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-medium">Parking Capacity</Label>
                    <Input 
                      value={formData.spaceAndFacilities.parkingCapacity} 
                      onChange={(e) => handleInputChange('spaceAndFacilities', 'parkingCapacity', e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
                    />
                  </div>
                </div>

                {/* Modal Technical */}
                <div className="space-y-6 bg-slate-950/30 p-5 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Technical</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-medium">Server Rooms</Label>
                    <Input 
                      value={formData.technical.serverRooms} 
                      onChange={(e) => handleInputChange('technical', 'serverRooms', e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-medium">Power Backup</Label>
                    <Input 
                      value={formData.technical.powerBackup} 
                      onChange={(e) => handleInputChange('technical', 'powerBackup', e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-medium">Internet ISP</Label>
                    <Input 
                      value={formData.technical.internetISP} 
                      onChange={(e) => handleInputChange('technical', 'internetISP', e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-medium">Internet Speed</Label>
                    <Input 
                      value={formData.technical.internetSpeed} 
                      onChange={(e) => handleInputChange('technical', 'internetSpeed', e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
                    />
                  </div>
                </div>

                {/* Modal Security */}
                <div className="space-y-6 bg-slate-950/30 p-5 rounded-xl border border-slate-800/50">
                  <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Security</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-medium">CCTV Cameras</Label>
                    <Input 
                      value={formData.security.cctvCameras} 
                      onChange={(e) => handleInputChange('security', 'cctvCameras', e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-medium">Biometric Devices</Label>
                    <Input 
                      value={formData.security.biometricDevices} 
                      onChange={(e) => handleInputChange('security', 'biometricDevices', e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-medium">Frisking Enclosures</Label>
                    <Input 
                      value={formData.security.friskingEnclosures} 
                      onChange={(e) => handleInputChange('security', 'friskingEnclosures', e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-slate-400 font-medium">Baggage Counter</Label>
                    <Input 
                      value={formData.security.baggageCounter} 
                      onChange={(e) => handleInputChange('security', 'baggageCounter', e.target.value)}
                      className="bg-slate-900 border-slate-700 text-white focus-visible:ring-secondary focus-visible:border-secondary" 
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-slate-800">
                <Button 
                  variant="outline" 
                  onClick={handleCloseModal}
                  className="px-6 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={isLoading}
                  className="px-6 bg-secondary hover:bg-[#d0ed76] text-[#2D3E2C] font-bold"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CenterInfrastructurePage;
