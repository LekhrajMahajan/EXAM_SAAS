import mongoose, { ClientSession } from "mongoose";

import attendanceRepository from "./attendance.repository";
import admitCardService from "../admit-card/admitCard.service";
import ApiError from "../../utils/ApiError";
import { HTTP_STATUS } from "../../constants/httpStatus";

import {
    IAttendance,
    AttendanceStatus,
    VerificationStatus,
} from "./attendance.types";

import {
    AdmitCardStatus,
} from "../admit-card/admitCard.types";

import { BaseService } from "../../common/base.service";

class AttendanceService extends BaseService<IAttendance> {
    constructor() {
        super(attendanceRepository, "Attendance record");
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Admit Card
    |--------------------------------------------------------------------------
    */

    private async validateAdmitCard(
        admitCardId: string
    ) {

        const admitCard =
            await admitCardService.getById(
                admitCardId
            );

        if (
            admitCard.status ===
            AdmitCardStatus.CANCELLED
        ) {

            throw new ApiError(
                HTTP_STATUS.BAD_REQUEST,
                "Admit card is cancelled."
            );

        }

        return admitCard;

    }

    /*
    |--------------------------------------------------------------------------
    | Validate Assignment
    |--------------------------------------------------------------------------
    */

    private async validateAssignment(
        candidateAssignmentId: string
    ) {
        // Return a mock assignment
        return {
          _id: candidateAssignmentId,
          candidateId: new mongoose.Types.ObjectId(),
          examId: new mongoose.Types.ObjectId(),
          shiftId: new mongoose.Types.ObjectId(),
          examCenterId: new mongoose.Types.ObjectId(),
          examRoomId: new mongoose.Types.ObjectId(),
          seatAllocationId: new mongoose.Types.ObjectId(),
          status: "ADMIT_CARD_GENERATED"
        } as any;
    }

    /*
    |--------------------------------------------------------------------------
    | Duplicate Attendance Check
    |--------------------------------------------------------------------------
    */

    private async checkAttendanceExists(
        candidateAssignmentId: string
    ) {

        const attendance =
            await attendanceRepository.findByCandidateAssignment(
                candidateAssignmentId
            );

        if (attendance) {

            throw new ApiError(
                HTTP_STATUS.CONFLICT,
                "Attendance already exists."
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Create Attendance
    |--------------------------------------------------------------------------
    */

    async create(
        payload: Partial<IAttendance>
    ) {

        const assignment =
            await this.validateAssignment(
                payload.candidateAssignmentId!.toString()
            );

        const admitCard =
            await this.validateAdmitCard(
                payload.admitCardId!.toString()
            );

        await this.checkAttendanceExists(
            payload.candidateAssignmentId!.toString()
        );

        const session: ClientSession =
            await mongoose.startSession();

        session.startTransaction();

        try {

            const attendance =
                await attendanceRepository.create(
                    {

                        ...payload,

                        candidateId:
                            assignment.candidateId,

                        examId:
                            assignment.examId,

                        shiftId:
                            assignment.shiftId,

                        examCenterId:
                            assignment.examCenterId,

                        examRoomId:
                            assignment.examRoomId,

                        seatAllocationId:
                            assignment.seatAllocationId,

                        attendanceStatus:
                            AttendanceStatus.PENDING,

                        qrVerification:
                            VerificationStatus.PENDING,

                        biometricVerification:
                            VerificationStatus.PENDING,

                        faceVerification:
                            VerificationStatus.PENDING,

                        manualVerification:
                            VerificationStatus.PENDING,

                    },

                    session
                );

            await session.commitTransaction();

            session.endSession();

            return attendance;

        } catch (error) {

            await session.abortTransaction();

            session.endSession();

            throw error;

        }

    }

    /*
    |--------------------------------------------------------------------------
    | QR Verification
    |--------------------------------------------------------------------------
    */

    async verifyQRCode(
        admitCardNumber: string
    ) {

        const admitCard =
            await admitCardService.verify(
                admitCardNumber
            );

        return admitCard;

    }

    /*
    |--------------------------------------------------------------------------
    | QR Check-In
    |--------------------------------------------------------------------------
    */

    async qrCheckIn(
        attendanceId: string,
        payload: {
            deviceId: string;
            scannerId: string;
            latitude: number;
            longitude: number;
            ipAddress: string;
        }
    ) {
        const attendance =
            await super.getById(
                attendanceId
            );

        return attendanceRepository.checkIn(
            attendanceId,
            {

                attendanceStatus:
                    AttendanceStatus.PRESENT,

                qrVerification:
                    VerificationStatus.SUCCESS,

                checkInTime:
                    new Date(),

                verifiedAt:
                    new Date(),

                deviceId:
                    payload.deviceId,

                scannerId:
                    payload.scannerId,

                latitude:
                    payload.latitude,

                longitude:
                    payload.longitude,

                ipAddress:
                    payload.ipAddress,

            }

        );

    }

/*
|--------------------------------------------------------------------------
| Biometric Verification
|--------------------------------------------------------------------------
*/

async biometricVerification(
    attendanceId: string,
    verified: boolean
) {

    const attendance =
        await super.getById(attendanceId);

    return attendanceRepository.updateVerification(
        attendanceId,
        {

            biometricVerification: verified
                ? VerificationStatus.SUCCESS
                : VerificationStatus.FAILED,

            verifiedAt: new Date(),

        }

    );

}

/*
|--------------------------------------------------------------------------
| Face Verification
|--------------------------------------------------------------------------
*/

async faceVerification(
    attendanceId: string,
    verified: boolean
) {

    const attendance =
        await super.getById(attendanceId);

    return attendanceRepository.updateVerification(
        attendanceId,
        {

            faceVerification: verified
                ? VerificationStatus.SUCCESS
                : VerificationStatus.FAILED,

            verifiedAt: new Date(),

        }

    );

}

/*
|--------------------------------------------------------------------------
| Manual Verification
|--------------------------------------------------------------------------
*/

async manualVerification(
    attendanceId: string,
    remarks?: string
) {

    const attendance =
        await super.getById(attendanceId);

    return attendanceRepository.updateVerification(
        attendanceId,
        {

            manualVerification:
                VerificationStatus.SUCCESS,

            remarks,

            verifiedAt: new Date(),

        }

    );

}

/*
|--------------------------------------------------------------------------
| Complete Verification
|--------------------------------------------------------------------------
*/

async completeVerification(
    attendanceId: string
) {

    const attendance =
        await super.getById(attendanceId);

    const verificationPassed =

        attendance.qrVerification ===
            VerificationStatus.SUCCESS &&

        attendance.biometricVerification ===
            VerificationStatus.SUCCESS &&

        attendance.faceVerification ===
            VerificationStatus.SUCCESS;

    if (!verificationPassed) {

        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Verification is incomplete."
        );

    }

    return attendanceRepository.update(
        attendanceId,
        {

            attendanceStatus:
                AttendanceStatus.PRESENT,

            verifiedAt:
                new Date(),

        }

    );

}

/*
|--------------------------------------------------------------------------
| Check Out
|--------------------------------------------------------------------------
*/

async checkOut(
    attendanceId: string
) {

    const attendance =
        await super.getById(
            attendanceId
        );

    if (
        attendance.attendanceStatus !==
        AttendanceStatus.PRESENT
    ) {

        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Candidate is not checked in."
        );

    }

    const session =
        await mongoose.startSession();

    session.startTransaction();

    try {

        const result =
            await attendanceRepository.checkOut(
                attendanceId,
                session
            );

        await session.commitTransaction();

        session.endSession();

        return result;

    } catch (error) {

        await session.abortTransaction();

        session.endSession();

        throw error;

    }

}

/*
|--------------------------------------------------------------------------
| Late Candidate Detection
|--------------------------------------------------------------------------
*/

async markLateCandidate(
    attendanceId: string,
    remarks?: string
) {

    const attendance =
        await super.getById(
            attendanceId
        );

    return attendanceRepository.update(
        attendanceId,
        {

            attendanceStatus:
                AttendanceStatus.LATE,

            remarks,

        }

    );

}

/*
|--------------------------------------------------------------------------
| Bulk Attendance
|--------------------------------------------------------------------------
*/

async bulkCreate(
    payload: Partial<IAttendance>[]
) {

    const session =
        await mongoose.startSession();

    session.startTransaction();

    const successful: any[] = [];

    const failed: any[] = [];

    try {

        for (const item of payload) {

            try {

                await this.validateAssignment(
                    item.candidateAssignmentId!.toString()
                );

                await this.validateAdmitCard(
                    item.admitCardId!.toString()
                );

                await this.checkAttendanceExists(
                    item.candidateAssignmentId!.toString()
                );

                const attendance =
                    await attendanceRepository.create(
                        {

                            ...item,

                            attendanceStatus:
                                AttendanceStatus.PENDING,

                            qrVerification:
                                VerificationStatus.PENDING,

                            biometricVerification:
                                VerificationStatus.PENDING,

                            faceVerification:
                                VerificationStatus.PENDING,

                            manualVerification:
                                VerificationStatus.PENDING,

                        },
                        session
                    );

                successful.push(attendance);

            } catch (error: any) {

                failed.push({

                    candidateAssignmentId:
                        item.candidateAssignmentId,

                    message:
                        error.message,

                });

            }

        }

        await session.commitTransaction();

        session.endSession();

        return {

            total:
                payload.length,

            successful:
                successful.length,

            failed:
                failed.length,

            successfulRecords:
                successful,

            failedRecords:
                failed,

        };

    } catch (error) {

        await session.abortTransaction();

        session.endSession();

        throw error;

    }

}





/*
|--------------------------------------------------------------------------
| Get By Candidate
|--------------------------------------------------------------------------
*/

async getByCandidate(
    candidateId: string
) {

    return attendanceRepository.findByCandidate(
        candidateId
    );

}

/*
|--------------------------------------------------------------------------
| Get By Exam
|--------------------------------------------------------------------------
*/

async getByExam(
    examId: string
) {

    return attendanceRepository.findByExam(
        examId
    );

}

/*
|--------------------------------------------------------------------------
| Live Dashboard
|--------------------------------------------------------------------------
*/

async liveDashboard(
    examId: string
) {

    const [

        total,

        present,

        absent,

        late,

        checkedOut,

        pending,

    ] = await Promise.all([

        attendanceRepository.count(
            examId
        ),

        attendanceRepository.countByStatus(
            AttendanceStatus.PRESENT,
            examId
        ),

        attendanceRepository.countByStatus(
            AttendanceStatus.ABSENT,
            examId
        ),

        attendanceRepository.countByStatus(
            AttendanceStatus.LATE,
            examId
        ),

        attendanceRepository.countByStatus(
            AttendanceStatus.CHECKED_OUT,
            examId
        ),

        attendanceRepository.countByStatus(
            AttendanceStatus.PENDING,
            examId
        ),

    ]);

    return {

        total,

        present,

        absent,

        late,

        checkedOut,

        pending,

    };

}

/*
|--------------------------------------------------------------------------
| Attendance Statistics
|--------------------------------------------------------------------------
*/

async statistics(
    examId?: string
) {

    const total =
        await attendanceRepository.count(
            examId
        );

    const present =
        await attendanceRepository.countByStatus(
            AttendanceStatus.PRESENT,
            examId
        );

    const absent =
        await attendanceRepository.countByStatus(
            AttendanceStatus.ABSENT,
            examId
        );

    const pending =
        await attendanceRepository.countByStatus(
            AttendanceStatus.PENDING,
            examId
        );

    const late =
        await attendanceRepository.countByStatus(
            AttendanceStatus.LATE,
            examId
        );

    const disqualified =
        await attendanceRepository.countByStatus(
            AttendanceStatus.DISQUALIFIED,
            examId
        );

    const checkedOut =
        await attendanceRepository.countByStatus(
            AttendanceStatus.CHECKED_OUT,
            examId
        );

    return {

        total,

        present,

        absent,

        pending,

        late,

        disqualified,

        checkedOut,

    };

}

/*
|--------------------------------------------------------------------------
| Center Statistics
|--------------------------------------------------------------------------
*/

async centerStatistics(
    examCenterId: string
) {

    return attendanceRepository.aggregateByCenter(
        examCenterId
    );

}

/*
|--------------------------------------------------------------------------
| Room Statistics
|--------------------------------------------------------------------------
*/

async roomStatistics(
    examRoomId: string
) {

    return attendanceRepository.aggregateByRoom(
        examRoomId
    );

}

/*
|--------------------------------------------------------------------------
| Shift Statistics
|--------------------------------------------------------------------------
*/

async shiftStatistics(
    shiftId: string
) {

    return attendanceRepository.aggregateByShift(
        shiftId
    );

}

/*
|--------------------------------------------------------------------------
| QR Verification Analytics
|--------------------------------------------------------------------------
*/

async qrAnalytics(
    examId: string
) {

    return attendanceRepository.aggregateVerification(
        examId,
        "qrVerification"
    );

}

/*
|--------------------------------------------------------------------------
| Face Verification Analytics
|--------------------------------------------------------------------------
*/

async faceAnalytics(
    examId: string
) {

    return attendanceRepository.aggregateVerification(
        examId,
        "faceVerification"
    );

}

/*
|--------------------------------------------------------------------------
| Biometric Verification Analytics
|--------------------------------------------------------------------------
*/

async biometricAnalytics(
    examId: string
) {

    return attendanceRepository.aggregateVerification(
        examId,
        "biometricVerification"
    );

}

/*
|--------------------------------------------------------------------------
| Device Analytics
|--------------------------------------------------------------------------
*/

async deviceAnalytics(
    examId: string
) {

    return attendanceRepository.deviceAnalytics(
        examId
    );

}

/*
|--------------------------------------------------------------------------
| Geo Analytics
|--------------------------------------------------------------------------
*/

async geoAnalytics(
    examId: string
) {

    return attendanceRepository.geoAnalytics(
        examId
    );

}

/*
|--------------------------------------------------------------------------
| Hourly Attendance Analytics
|--------------------------------------------------------------------------
*/

async hourlyAnalytics(
    examId: string
) {

    return attendanceRepository.hourlyAnalytics(
        examId
    );

}

/*
|--------------------------------------------------------------------------
| Attendance Report
|--------------------------------------------------------------------------
*/

async attendanceReport(
    examId: string
) {

    const statistics =
        await this.statistics(examId);

    const center =
        await this.centerStatistics(
            examId
        );

    const qr =
        await this.qrAnalytics(
            examId
        );

    const biometric =
        await this.biometricAnalytics(
            examId
        );

    const face =
        await this.faceAnalytics(
            examId
        );

    return {

        statistics,

        center,

        qr,

        biometric,

        face,

    };

}



/*
|--------------------------------------------------------------------------
| Update Attendance Status
|--------------------------------------------------------------------------
*/

async updateStatus(
    id: string,
    status: AttendanceStatus
) {

    return super.update(
        id,
        {
            attendanceStatus: status,
        }
    );

}

/*
|--------------------------------------------------------------------------
| Mark Absent
|--------------------------------------------------------------------------
*/

async markAbsent(
    attendanceId: string,
    remarks?: string
) {

    const attendance =
        await super.getById(
            attendanceId
        );

    return attendanceRepository.update(
        attendanceId,
        {

            attendanceStatus:
                AttendanceStatus.ABSENT,

            remarks,

        }

    );

}

/*
|--------------------------------------------------------------------------
| Disqualify Candidate
|--------------------------------------------------------------------------
*/

async disqualifyCandidate(
    attendanceId: string,
    remarks: string
) {

    const attendance =
        await super.getById(
            attendanceId
        );

    return attendanceRepository.update(
        attendanceId,
        {

            attendanceStatus:
                AttendanceStatus.DISQUALIFIED,

            remarks,

        }

    );

}

/*
|--------------------------------------------------------------------------
| Delete Attendance
|--------------------------------------------------------------------------
*/

async delete(
    id: string,
    session?: import("mongoose").ClientSession
) {

    const attendance =
        await super.getById(id);

    const transactionSession = session || await mongoose.startSession();
    if (!session) transactionSession.startTransaction();

    try {

        const deleted =
            await attendanceRepository.softDelete(
                id,
                transactionSession
            );

        if (!deleted) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Attendance record not found.");
        }

        if (!session) {
            await transactionSession.commitTransaction();
            transactionSession.endSession();
        }

        return deleted;

    } catch (error) {
        if (!session) {
            await transactionSession.abortTransaction();
            transactionSession.endSession();
        }
        throw error;
    }
}

/*
|--------------------------------------------------------------------------
| Restore Attendance
|--------------------------------------------------------------------------
*/

async restore(
    id: string,
    session?: import("mongoose").ClientSession
) {

    const attendance =
        await attendanceRepository.findDeletedById(
            id
        );

    if (!attendance) {
        throw new ApiError(
            HTTP_STATUS.NOT_FOUND,
            "Attendance record not found."
        );
    }

    const transactionSession = session || await mongoose.startSession();
    if (!session) transactionSession.startTransaction();

    try {
        const restored =
            await attendanceRepository.restore(
                id,
                transactionSession
            );
        
        if (!restored) {
            throw new ApiError(HTTP_STATUS.NOT_FOUND, "Attendance record not found.");
        }

        if (!session) {
            await transactionSession.commitTransaction();
            transactionSession.endSession();
        }

        return restored;

    } catch (error) {
        if (!session) {
            await transactionSession.abortTransaction();
            transactionSession.endSession();
        }
        throw error;
    }
}

/*
|--------------------------------------------------------------------------
| Helper Methods
|--------------------------------------------------------------------------
*/

async exists(
    candidateAssignmentId: string
) {

    return attendanceRepository.findByCandidateAssignment(
        candidateAssignmentId
    );

}

async getByAdmitCard(
    admitCardId: string
) {

    return attendanceRepository.findByAdmitCard(
        admitCardId
    );

}

async verifyAttendance(
    attendanceId: string
) {

    const attendance =
        await super.getById(
            attendanceId
        );

    return {

        attendanceMarked:
            attendance.attendanceStatus !==
            AttendanceStatus.PENDING,

        qrVerified:
            attendance.qrVerification ===
            VerificationStatus.SUCCESS,

        faceVerified:
            attendance.faceVerification ===
            VerificationStatus.SUCCESS,

        biometricVerified:
            attendance.biometricVerification ===
            VerificationStatus.SUCCESS,

        manualVerified:
            attendance.manualVerification ===
            VerificationStatus.SUCCESS,

    };

}

}

export default new AttendanceService();
