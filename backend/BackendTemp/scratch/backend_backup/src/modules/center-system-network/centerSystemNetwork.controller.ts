import { Request, Response } from "express";
import net from "net";
import { exec } from "child_process";
import os from "os";
import { CenterSystemNetwork } from "./centerSystemNetwork.model";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { HTTP_STATUS } from "../../constants/httpStatus";

const checkPort = (port: number, host: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(1000); 
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

export const checkIpLiveStatus = asyncHandler(async (req: Request, res: Response) => {
  const { ip } = req.query;
  
  if (!ip || typeof ip !== 'string') {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, { success: false, message: "IP address is required" });
  }

  // Basic IP validation regex
  const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  if (!ipRegex.test(ip)) {
    return sendResponse(res, HTTP_STATUS.BAD_REQUEST, { success: false, message: "Invalid IP address format" });
  }

  const startTime = Date.now();
  let latency: number | null = null;
  const openPorts: number[] = [];

  const checkPing = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const isWindows = os.platform() === "win32";
      const cmd = isWindows ? `ping -n 1 -w 1000 ${ip}` : `ping -c 1 -W 1 ${ip}`;

      exec(cmd, (error) => {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  };

  let isOnline = await checkPing();
  if (isOnline) {
    latency = Date.now() - startTime;
  }

  // Check ports to update openPorts dynamically and act as fallback for ping
  const portsToCheck = [21, 22, 23, 25, 53, 80, 110, 111, 135, 139, 143, 443, 445, 993, 995, 1723, 3306, 3389, 5900, 8080];
  const tcpStart = Date.now();
  const results = await Promise.all(portsToCheck.map(port => checkPort(port, ip as string).then(isOpen => ({ port, isOpen }))));
  let tcpLatency: number | null = null;

  for (const result of results) {
    if (result.isOpen) {
      openPorts.push(result.port);
      if (tcpLatency === null) {
        tcpLatency = Date.now() - tcpStart;
      }
    }
  }

  if (openPorts.length > 0 && !isOnline) {
    isOnline = true;
    latency = tcpLatency;
  }

  return sendResponse(res, HTTP_STATUS.OK, {
    success: true,
    message: "Network status checked successfully",
    data: {
      ip,
      status: isOnline ? "ONLINE" : "OFFLINE",
      latency,
      openPorts,
      checkedAt: new Date().toISOString()
    }
  });
});
