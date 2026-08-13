import { useState, useEffect } from "react";
import { CenterHeader } from "../components/CenterHeader";
import { CenterForm } from "../components/CenterForm";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCenter } from "../hooks/center.hooks";
import { centerApi } from "@/features/company/center/api/center.api";

export const EditCenterPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useCenter(id || '');
  const center: any = data?.data || data;

  // Fetch onboarding data for MOU filename, shifts, facilities
  const [onboarding, setOnboarding] = useState<any>(null);
  const [onboardingLoaded, setOnboardingLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      centerApi.getOnboardingStatus(id)
        .then(res => {
          setOnboarding(res?.data || res);
          setOnboardingLoaded(true);
        })
        .catch(() => {
          setOnboarding(null);
          setOnboardingLoaded(true);
        });
    } else {
      Promise.resolve().then(() => setOnboardingLoaded(true));
    }
  }, [id]);

  if (isLoading || !center || !onboardingLoaded) {
    return (
      <div className="flex justify-center items-center h-64 p-6">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const initialValues: any = {
    _id: center.id || center._id || id,
    centerName: center.centerName || center.name || '',
    centerCode: center.centerCode || center.code || '',
    branch: (() => {
      const b = center.branch || center.branchId;
      if (typeof b === 'object' && b !== null) return String(b._id || b.id || '');
      return String(b || '');
    })(),
    centerType: center.centerCategory || center.displayCenterType || center.centerType || 'Standard Center',
    state: center.state || '',
    city: center.city || '',
    address: center.address || '',
    // pincode may be stored as postalCode in some responses
    pincode: center.pincode || center.postalCode || '',
    googleMapUrl: center.googleMapUrl || center?.profileExtension?.googleMapUrl || '',
    headName: center.headName || center.managerName || '',
    headEmail: center.headEmail || center.email || '',
    headMobile: center.headMobile || center.phone || '',
    emergencyContact: center.emergencyContact || center.alternatePhone || '',
    // Infrastructure: stored directly on center OR nested under capacity
    maxCandidates: center.availableCapacity || center.capacity || 100,
    maxRooms: center.totalLabs ?? center.maxRooms ?? 10,
    maxSystems: center.totalSystems ?? center.maxSystems ?? 100,
    status: center.status === 'ACTIVE' || center.status === 'Active' ? 'Active' : 'Inactive',
    // Shifts / Pricing — prefer onboarding data which has full commercial agreement
    commercialAgreement: onboarding?.commercialAgreement || center.commercialAgreement || center.shifts || center.shiftRates || [],
    // Facilities checkboxes — prefer onboarding record
    facilities: onboarding?.facilities || center.facilities || [],
    mouFileName: onboarding?.mouFileName || center.mouFileName || '',
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to={`/company/centers`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <CenterHeader
          title="Edit Center"
          description={`Updating details for ${center.centerName || center.name || 'Center'}`}
        />
      </div>

      <CenterForm initialValues={initialValues} isEditing />
    </div>
  );
};

