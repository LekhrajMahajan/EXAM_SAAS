import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { CenterStatusBadge } from "./CenterStatusBadge";
import { Check, X } from "lucide-react";
import type { Room } from "../types/center.types";

interface RoomTableProps {
  rooms: Room[];
}

export const RoomTable = ({ rooms }: RoomTableProps) => {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room Number</TableHead>
            <TableHead>Floor</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>System Count</TableHead>
            <TableHead>Projector</TableHead>
            <TableHead>Camera</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map((room) => (
            <TableRow key={room.id}>
              <TableCell className="font-medium">{room.roomNumber}</TableCell>
              <TableCell>{room.floor}</TableCell>
              <TableCell>{room.capacity}</TableCell>
              <TableCell>{room.systemCount}</TableCell>
              <TableCell>
                {room.projector ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
              </TableCell>
              <TableCell>
                {room.camera ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
              </TableCell>
              <TableCell>
                <CenterStatusBadge status={room.status} />
              </TableCell>
            </TableRow>
          ))}
          {rooms.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No rooms found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
