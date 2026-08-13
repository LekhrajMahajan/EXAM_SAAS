import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

interface BranchDetailsCardProps {
  title: string;
  data: Record<string, string | number | boolean>;
}

export const BranchDetailsCard = ({ title, data }: BranchDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground">
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </dt>
              <dd className="text-sm font-semibold">{String(value)}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
};
