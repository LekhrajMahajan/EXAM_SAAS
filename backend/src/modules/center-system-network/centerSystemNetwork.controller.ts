import { Request, Response } from "express";
import net from "net";
import { CenterSystemNetwork } from "./centerSystemNetwork.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

const checkPort = (port: number, host: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(2000); 
    socket.on("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.on("error", () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
};

export const scanIp = asyncHandler(async (req: Request, res: Response) => {
  const { ipAddress } = req.body;
  const createdBy = (req as any).user?.userId;
  const centerId = (req as any).user?.centerId;
  
  if (!createdBy) {
    return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, { success: false, message: "Unauthorized" });
  }

  // A more comprehensive port list for basic network scanning
  const portsToCheck = [21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 445, 993, 995, 1723, 3306, 3389, 5900, 8080];
  const openPorts: number[] = [];
  
  let latency: number | null = null;
  const startTime = Date.now();
  let isOnline = false;

  const results = await Promise.all(portsToCheck.map(port => checkPort(port, ipAddress).then(isOpen => ({ port, isOpen }))));

  for (const result of results) {
    if (result.isOpen) {
      openPorts.push(result.port);
      if (!isOnline) {
        isOnline = true;
        // Approximation of latency based on TCP handshake time
        latency = Date.now() - startTime;
      }
    }
  }

  const status = isOnline ? "ONLINE" : "OFFLINE";

  const newScan = await CenterSystemNetwork.create({
    ipAddress,
    status,
    latency,
    openPorts,
    createdBy,
    center: centerId
  });

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    data: newScan,
    message: "IP scanned successfully"
  });
});

export const getScans = asyncHandler(async (req: Request, res: Response) => {
  let centerId = (req as any).user?.centerId;
  
  if ((req as any).user?.role === "COMPANY_ADMIN" && req.query.centerId) {
    centerId = req.query.centerId as string;
  }

  if (!centerId) {
    return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, { success: false, message: "Unauthorized" });
  }

  // Filter by centerId
  const scans = await CenterSystemNetwork.find({ center: centerId }).sort({ createdAt: -1 }).limit(100);
  
  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Scans retrieved successfully",
    data: scans,
  });
});
