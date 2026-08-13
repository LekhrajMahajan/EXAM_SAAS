import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { CenterStatusBadge } from "./CenterStatusBadge";
import type { Device } from "../types/center.types";

interface DeviceTableProps {
  devices: Device[];
}

export const DeviceTable = ({ devices }: DeviceTableProps) => {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Make</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Serial Number</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell className="font-medium">{device.type}</TableCell>
              <TableCell>{device.make}</TableCell>
              <TableCell>{device.model}</TableCell>
              <TableCell>{device.serialNumber}</TableCell>
              <TableCell>
                <CenterStatusBadge status={device.status} />
              </TableCell>
            </TableRow>
          ))}
          {devices.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No devices found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
