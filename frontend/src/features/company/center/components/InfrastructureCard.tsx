import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Infrastructure } from "../types/center.types";

interface InfrastructureCardProps {
  data: Infrastructure;
}

export const InfrastructureCard = ({ data }: InfrastructureCardProps) => {
  const items = [
    { label: "Internet Available", value: data.internetAvailable },
    { label: "Power Backup", value: data.powerBackup },
    { label: "Generator", value: data.generator },
    { label: "UPS", value: data.ups },
    { label: "Air Conditioning", value: data.airConditioning },
    { label: "CCTV Available", value: data.cctvAvailable },
    { label: "Biometric Device", value: data.biometricDevice },
    { label: "Metal Detector", value: data.metalDetector },
    { label: "Parking", value: data.parking },
    { label: "Waiting Area", value: data.waitingArea },
    { label: "Medical Room", value: data.medicalRoom },
    { label: "Washroom", value: data.washroom },
    { label: "Drinking Water", value: data.drinkingWater },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Infrastructure Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 border rounded-md">
              {item.value ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
