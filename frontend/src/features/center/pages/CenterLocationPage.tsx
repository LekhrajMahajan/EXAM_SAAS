import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Map, MapPin, Navigation } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCenterLocationStore } from '../store/useCenterLocationStore';

export const CenterLocationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const isReadOnly = Boolean(id) && user?.role !== 'CENTER_MANAGER';

  const { data, isLoading, isSaving, fetchLocation, updateLocation } = useCenterLocationStore();

  const [latitude, setLatitude] = useState<string | number>(data?.latitude || '');
  const [longitude, setLongitude] = useState<string | number>(data?.longitude || '');
  const [googleMapUrl, setGoogleMapUrl] = useState<string>(data?.googleMapUrl || '');
  const [prevData, setPrevData] = useState(data);

  if (data !== prevData) {
    setPrevData(data);
    if (data) {
      setLatitude(data.latitude);
      setLongitude(data.longitude);
      setGoogleMapUrl(data.googleMapUrl);
    }
  }

  useEffect(() => {
    fetchLocation(id);
  }, [fetchLocation, id]);

  const handleSave = async () => {
    const toastId = toast.loading('Saving location information...');
    const result = await updateLocation({
      latitude,
      longitude,
      googleMapUrl,
    });

    if (result.success) {
      toast.success(result.message || 'Location saved successfully', { id: toastId });
    } else {
      toast.error(result.message || 'Failed to save location', { id: toastId });
    }
  };

  const extractSrcFromIframe = (iframeHtml: string) => {
    const match = iframeHtml.match(/src="([^"]+)"/);
    if (match && match[1]) {
      setGoogleMapUrl(match[1]);
    } else {
      setGoogleMapUrl(iframeHtml); // fallback to just setting it directly if it's already a URL
    }
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      toast.loading('Detecting location...', { id: 'geo' });
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setLatitude(lat);
          setLongitude(lng);
          setGoogleMapUrl(`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=15&output=embed`);
          toast.success('Location detected', { id: 'geo' });
        },
        (_error) => {
          toast.error('Could not detect location. Please enable location services.', { id: 'geo' });
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  if (isLoading && !data) {
    return <div className="p-8 text-center text-slate-400">Loading location data...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <Map className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-200">Google Maps Integration</h1>
            <p className="text-slate-400">Pinpoint your center&apos;s exact location to help candidates navigate easily.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-md shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-400" />
              <h2 className="font-semibold text-slate-200 text-lg">Coordinates</h2>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="googleMapUrl" className="text-slate-300">Google Maps Embed URL</Label>
                <Input
                  id="googleMapUrl"
                  placeholder="Paste iframe code or embed URL here"
                  className="bg-slate-950 border-slate-800 text-slate-200"
                  value={googleMapUrl}
                  onChange={(e) => extractSrcFromIframe(e.target.value)}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Go to Google Maps &gt; Share &gt; Embed a map &gt; Copy HTML
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-slate-300">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    placeholder="e.g. 23.215665"
                    className="bg-slate-950 border-slate-800 text-slate-200"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-slate-300">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    placeholder="e.g. 72.648213"
                    className="bg-slate-950 border-slate-800 text-slate-200"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    onPaste={(e) => {
                      const pastedText = e.clipboardData.getData('text');
                      if (pastedText.includes('<iframe')) {
                        e.preventDefault();
                        extractSrcFromIframe(pastedText);
                      }
                    }}
                    disabled={isReadOnly}
                  />
                </div>
              </div>

                <div className="grid grid-cols-2 gap-4">
                  {!isReadOnly && (
                    <Button 
                      variant="outline" 
                      className="w-full flex items-center justify-center gap-2 border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10 hover:text-blue-300 transition-colors"
                      onClick={handleUseCurrentLocation}
                    >
                      <Navigation className="w-4 h-4" />
                      Detect Location
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    className={`${isReadOnly ? 'col-span-2' : 'w-full'} flex items-center justify-center gap-2 border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors`}
                    onClick={() => {
                      if(latitude && longitude) {
                        setGoogleMapUrl(`https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&output=embed`);
                        toast.success('Map preview updated');
                      } else {
                        toast.error('Please enter both latitude and longitude');
                      }
                    }}
                  >
                    <Map className="w-4 h-4" />
                    Preview Map
                  </Button>
                </div>

              {!isReadOnly && (
                <div className="pt-4 border-t border-slate-800">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save Maps Info'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Map Preview */}
        <div className="lg:col-span-7">
          <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-md shadow-xl h-full min-h-[400px] overflow-hidden flex flex-col">
            {googleMapUrl ? (
              <iframe
                src={googleMapUrl}
                width="100%"
                height="100%"
                className="w-full h-full min-h-[400px] border-0 contrast-[1.1]"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Preview"
              ></iframe>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <Map className="w-8 h-8 text-slate-600" />
                </div>
                <p>No map URL provided.</p>
                <p className="text-sm mt-2 max-w-sm text-center">
                  Paste a Google Maps embed URL on the left to preview the map here.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
