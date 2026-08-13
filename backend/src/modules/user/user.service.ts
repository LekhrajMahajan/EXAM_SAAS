import bcrypt from "bcryptjs";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";
import userRepository from "./user.repository";
import {
    IUpdateProfile,
    IChangePassword,
} from "./user.types";

import { BaseService } from "../../common/base.service";

class UserService extends BaseService<any> {
    constructor() {
        super(userRepository, "User");
    }
    /*
    |--------------------------------------------------------------------------
    | Get Profile
    |--------------------------------------------------------------------------
    */
    async getProfile(userId: string) {
        const user = await userRepository.getProfile(userId);
        if (!user) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found.");
        }
        return user;
    }

    /*
    |--------------------------------------------------------------------------
    | Update Profile
    |--------------------------------------------------------------------------
    */
    async updateProfile(userId: string, payload: IUpdateProfile) {
        const user = await userRepository.updateProfile(userId, payload);
        if (!user) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found.");
        }
        return user;
    }

    /*
    |--------------------------------------------------------------------------
    | Change Password
    |--------------------------------------------------------------------------
    */
    async changePassword(userId: string, payload: IChangePassword) {
        const user = await userRepository.getProfile(userId);
        if (!user) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found.");
        }

        const passwordUser = await userRepository.getUserWithPassword?.(userId);
        if (!passwordUser) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found.");
        }

        const isPasswordValid = await bcrypt.compare(
            payload.currentPassword,
            passwordUser.password
        );

        if (!isPasswordValid) {
            throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Current password is incorrect.");
        }

        return userRepository.changePassword(userId, payload.newPassword);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Profile Image
    |--------------------------------------------------------------------------
    */
    async updateProfileImage(userId: string, profileImage: string) {
        const user = await userRepository.updateProfileImage(userId, profileImage);
        if (!user) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found.");
        }
        return user;
    }

    /*
    |--------------------------------------------------------------------------
    | Get Sessions
    |--------------------------------------------------------------------------
    */
    async getSessions(userId: string) {
        return userRepository.getSessions(userId);
    }

    /*
    |--------------------------------------------------------------------------
    | Remove Session
    |--------------------------------------------------------------------------
    */
    async removeSession(userId: string, sessionId: string) {
        return userRepository.removeSession(userId, sessionId);
    }

    /*
    |--------------------------------------------------------------------------
    | Get Devices
    |--------------------------------------------------------------------------
    */
    async getDevices(userId: string) {
        return userRepository.getDevices(userId);
    }

    /*
    |--------------------------------------------------------------------------
    | Trust Device
    |--------------------------------------------------------------------------
    */
    async trustDevice(userId: string, deviceId: string) {
        const updatedUser = await userRepository.trustDevice(userId, deviceId);
        if (!updatedUser) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Device not found.");
        }
        return updatedUser;
    }

    /*
    |--------------------------------------------------------------------------
    | Remove Device
    |--------------------------------------------------------------------------
    */
    async removeDevice(userId: string, deviceId: string) {
        return userRepository.removeDevice(userId, deviceId);
    }

    /*
    |--------------------------------------------------------------------------
    | Update Preferences
    |--------------------------------------------------------------------------
    */
    async updatePreferences(userId: string, preferences: Record<string, unknown>) {
        const user = await userRepository.updatePreferences(userId, preferences);
        if (!user) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "User not found.");
        }
        return user;
    }

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */
    async getDashboard(userId: string) {
        return userRepository.getDashboard(userId);
    }
}

export default new UserService();
