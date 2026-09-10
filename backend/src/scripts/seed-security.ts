import mongoose from "mongoose";
import AuditLog from "../modules/audit-log/auditLog.model";
import UserModel from "../modules/user/user.model";
import { UserMfa } from "../modules/security/userMfa.model";
import { SecurityEventModel } from "../modules/security/securityEvent.model";
import { EventSeverity, EventStatus } from "../modules/security/securityEvent.types";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in the environment variables");
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB for Security Seeding");

    // 1. Update Recent Audit Logs
    const recentLogs = await AuditLog.find().sort({ createdAt: -1 }).limit(20);
    const devices = ["Windows 10", "MacOS 13", "iOS 16", "Android 13"];
    const ips = ["192.168.1.1", "10.0.0.5", "172.16.0.2", "8.8.8.8", "45.33.22.11"];
    const deviceTypes = ["Desktop", "Laptop", "Mobile", "Tablet"];
    const browsers = ["Chrome 114", "Safari 16", "Firefox 112", "Edge 113"];
    
    for (let i = 0; i < recentLogs.length; i++) {
      const log = recentLogs[i];
      if (!log.ipAddress) {
        log.ipAddress = ips[i % ips.length];
        log.operatingSystem = devices[i % devices.length];
        log.deviceType = deviceTypes[i % deviceTypes.length];
        log.browser = browsers[i % browsers.length];
        await log.save();
      }
    }
    console.log(`✅ Updated ${recentLogs.length} audit logs with IP and Device data.`);

    // 2. Add Active Sessions to a User (prefer MASTER_ADMIN)
    const user = await UserModel.findOne({ role: "MASTER_ADMIN" }) || await UserModel.findOne();
    if (user) {
      if (!user.sessions || user.sessions.length === 0) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        user.sessions = [
          {
            sessionId: new mongoose.Types.ObjectId().toString(),
            refreshToken: "dummy_token_1",
            deviceType: "Desktop",
            ipAddress: "192.168.1.1",
            browser: "Chrome 114",
            operatingSystem: "Windows 10",
            loginAt: yesterday,
            lastActivityAt: new Date(),
            expiresAt: tomorrow
          },
          {
            sessionId: new mongoose.Types.ObjectId().toString(),
            refreshToken: "dummy_token_2",
            deviceType: "Mobile",
            ipAddress: "10.0.0.5",
            browser: "Safari 16",
            operatingSystem: "iOS 16",
            loginAt: new Date(),
            lastActivityAt: new Date(),
            expiresAt: tomorrow
          }
        ];
        await user.save();
        console.log("✅ Seeded active sessions for the user.");
      } else {
        console.log("☑️ User already has active sessions.");
      }
      
      // 3. Add Trusted Devices
      const userMfa = await UserMfa.findOne({ userId: user._id });
      if (!userMfa) {
        await UserMfa.create({
          userId: user._id,
          isEnabled: true,
          trustedDevicesCount: 2,
          trustedDevices: [
            {
              deviceId: new mongoose.Types.ObjectId().toString(),
              deviceType: "Desktop",
              browser: "Chrome",
              operatingSystem: "Windows 10",
              ipAddress: "192.168.1.1",
              trustedAt: new Date(),
              lastUsedAt: new Date(),
              isBlocked: false
            },
            {
              deviceId: new mongoose.Types.ObjectId().toString(),
              deviceType: "Mobile",
              browser: "Safari",
              operatingSystem: "iOS 16",
              ipAddress: "10.0.0.5",
              trustedAt: new Date(),
              lastUsedAt: new Date(),
              isBlocked: false
            }
          ]
        });
        console.log("✅ Seeded trusted devices for the user.");
      } else if (!userMfa.trustedDevices || userMfa.trustedDevices.length === 0) {
          userMfa.trustedDevicesCount = 2;
          userMfa.trustedDevices = [
            {
              deviceId: new mongoose.Types.ObjectId().toString(),
              deviceType: "Desktop",
              browser: "Chrome",
              operatingSystem: "Windows 10",
              ipAddress: "192.168.1.1",
              trustedAt: new Date(),
              lastUsedAt: new Date(),
              isBlocked: false
            },
            {
              deviceId: new mongoose.Types.ObjectId().toString(),
              deviceType: "Mobile",
              browser: "Safari",
              operatingSystem: "iOS 16",
              ipAddress: "10.0.0.5",
              trustedAt: new Date(),
              lastUsedAt: new Date(),
              isBlocked: false
            }
          ];
          await userMfa.save();
          console.log("✅ Updated trusted devices for the user.");
      } else {
          console.log("☑️ User already has trusted devices.");
      }
    } else {
      console.log("⚠️ No users found in database to attach sessions and devices.");
    }

    // 4. Create Threat Events
    const existingEvents = await SecurityEventModel.countDocuments();
    if (existingEvents === 0) {
      const events = [
        {
          eventId: "EVT-" + Date.now().toString().slice(-6),
          eventType: "MULTIPLE_FAILED_LOGINS",
          category: "Authentication",
          severity: EventSeverity.HIGH,
          status: EventStatus.OPEN,
          userId: user?._id,
          description: "Multiple failed login attempts detected",
          ipAddress: "185.15.22.1",
          location: "Moscow, Russia",
          operatingSystem: "Unknown",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          eventId: "EVT-" + (Date.now() - 1000).toString().slice(-6),
          eventType: "NEW_DEVICE_LOGIN",
          category: "Device",
          severity: EventSeverity.MEDIUM,
          status: EventStatus.RESOLVED,
          userId: user?._id,
          description: "Login from a new unrecognized device",
          ipAddress: "10.0.0.5",
          location: "New York, USA",
          operatingSystem: "macOS",
          createdAt: new Date(Date.now() - 86400000), // yesterday
          updatedAt: new Date()
        },
        {
          eventId: "EVT-" + (Date.now() - 2000).toString().slice(-6),
          eventType: "DATA_EXFILTRATION_ATTEMPT",
          category: "Data Access",
          severity: EventSeverity.CRITICAL,
          status: EventStatus.INVESTIGATING,
          userId: user?._id,
          description: "Unusual bulk download pattern detected",
          ipAddress: "45.33.22.11",
          location: "Beijing, China",
          operatingSystem: "Windows 11",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      await SecurityEventModel.insertMany(events);
      console.log("✅ Seeded Security Threat Events.");
    } else {
      console.log(`☑️ Found ${existingEvents} Security Threat Events. Skipped seeding.`);
    }

    console.log("\n🎉 Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
