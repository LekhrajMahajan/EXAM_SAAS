import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Image as ImageIcon, Camera } from 'lucide-react';
import { useCenterPhotoStore, type PhotoField, type CenterPhotosData } from '../store/useCenterPhotoStore';
import toast from 'react-hot-toast';
import { apiClient } from '@/core/api/http/axios-client';

export const CenterPhotosPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isReadOnly = Boolean(id) && user?.role !== 'CENTER_MANAGER';

  const { data, isLoading, fetchPhotos, updatePhoto } = useCenterPhotoStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<keyof CenterPhotosData | null>(null);

  useEffect(() => {
    fetchPhotos(id);
  }, [fetchPhotos, id]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedCategory) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', selectedCategory);
      
      const toastId = toast.loading('Uploading photo...');
      
      await apiClient.post('/centers/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      await fetchPhotos();
      toast.success('Photo uploaded successfully', { id: toastId });

    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Failed to upload photo');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedCategory(null);
    }
  };

  const triggerFileInput = (category: keyof CenterPhotosData) => {
    setSelectedCategory(category);
    fileInputRef.current?.click();
  };

  const photoCards: { category: keyof CenterPhotosData; title: string; icon: React.ReactNode }[] = [
    { category: 'frontFacade', title: 'Center Front/Facade', icon: <Camera className="w-5 h-5" /> },
    { category: 'computerLab1', title: 'Computer Lab 1', icon: <Camera className="w-5 h-5" /> },
    { category: 'serverRoom', title: 'Server Room', icon: <Camera className="w-5 h-5" /> },
    { category: 'cctvRoom', title: 'CCTV Monitoring Room', icon: <Camera className="w-5 h-5" /> },
  ];

  if (isLoading && !data) {
    return <div className="p-8 text-center text-slate-400">Loading photos...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <ImageIcon className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-200">Center Photos</h1>
            <p className="text-slate-400">Upload and manage images of your physical infrastructure.</p>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {photoCards.map(({ category, title, icon }) => {
          const photoData = data?.[category];
          const hasPhoto = photoData && photoData.url;

          return (
            <Card key={category} className={`bg-slate-900/80 border-slate-800 backdrop-blur-md shadow-xl rounded-xl overflow-hidden text-white relative group ${hasPhoto ? 'min-h-[300px]' : ''}`}>
              {hasPhoto ? (
                <>
                  <img 
                    src={photoData.url.startsWith('/') ? `http://localhost:5000${photoData.url}` : photoData.url} 
                    alt={title} 
                    className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                    onClick={() => {
                      if (!isReadOnly) triggerFileInput(category);
                    }}
                    title="Click to replace photo"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center gap-2 z-10 pointer-events-none">
                    <span className="text-slate-200">{icon}</span>
                    <h3 className="font-semibold text-slate-200">{title}</h3>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2">
                    <span className="text-slate-400">{icon}</span>
                    <h3 className="font-semibold text-slate-200">{title}</h3>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="border border-dashed border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center min-h-[220px] bg-slate-800/30">
                      <div className="text-center w-full flex flex-col items-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-slate-800 border border-slate-700 rounded-full mb-3">
                          <ImageIcon className="w-6 h-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-400 mb-6">Upload a clear photo</p>
                        {!isReadOnly && (
                          <Button 
                            variant="outline"
                            className="w-32 border-slate-700 text-slate-300 bg-slate-800 hover:bg-slate-700"
                            onClick={() => triggerFileInput(category)}
                            disabled={isLoading}
                          >
                            Upload Photo
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
