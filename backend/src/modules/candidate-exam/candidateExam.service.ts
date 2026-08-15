import ApiError from "../../utils/ApiError";
import HTTP_STATUS from "http-status";
import mongoose from "mongoose";
import { generateAccessToken } from "../../utils/jwt"; // checking if this exists
import fs from "fs";
import path from "path";
import liveMonitoringService from "../live-monitoring/liveMonitoring.service";

// I'll just build a basic service

/*
|--------------------------------------------------------------------------
| Candidate Exam Service
|--------------------------------------------------------------------------
*/

class CandidateExamService {

  /*
  |--------------------------------------------------------------------------
  | Disconnect Candidate Session
  |--------------------------------------------------------------------------
  | Marks the candidate's login session as LOGGED_OUT after exam submission.
  */

  private async disconnectCandidateSession(candidateId: string, examId: string) {
    try {
      const CandidateLogin = mongoose.models.candidatelogin || mongoose.models.CandidateLogin;
      if (CandidateLogin) {
        await CandidateLogin.updateMany(
          {
            candidateId,
            examId,
            status: 'ACTIVE',
          },
          {
            $set: {
              status: 'LOGGED_OUT',
              logoutAt: new Date(),
            },
          }
        );
        console.log(`[SESSION DISCONNECT] Candidate ${candidateId} disconnected from exam ${examId}`);
      }
    } catch (err: any) {
      console.error(`[SESSION DISCONNECT ERROR] ${err.message}`);
    }
  }
  async login(payload: any) {
    const { applicationNo, dateOfBirth } = payload;
    
    // Generate variations of the date format since it might be stored differently in ImportCandidate
    let dobVariations = [dateOfBirth];
    if (dateOfBirth && typeof dateOfBirth === 'string' && dateOfBirth.includes('-')) {
      const parts = dateOfBirth.split('-');
      if (parts.length === 3 && parts[0].length === 4) {
        const [yyyy, mm, dd] = parts;
        dobVariations.push(`${dd}/${mm}/${yyyy}`);
        dobVariations.push(`${dd}-${mm}-${yyyy}`);
      }
    }
    
    // 1. Find Candidate
    const ImportCandidate = mongoose.models.importcandidate;
    const Candidate = mongoose.models.Candidate;
    
    // ImportCandidate has dateOfBirth field (String)
    let candidate: any = await ImportCandidate.findOne({ 
      applicationNo, 
      dateOfBirth: { $in: dobVariations } 
    });
    let isImported = true;
    
    if (!candidate) {
      // Candidate has dob field (Date/String depending on how it was saved, but we can query by dob)
      // Since payload dateOfBirth might be a string like "2000-01-01", we should try to match it.
      // Assuming Candidate dob can be queried with string if Mongoose casts it, or we might need to parse.
      candidate = await Candidate.findOne({ applicationNo, dob: dateOfBirth });
      isImported = false;
    }
    
    if (!candidate) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Invalid Application Number or Date of Birth.");
    }
    
    if (!candidate.isLoginEnabled) {
      // Fallback: Check if candidate is marked as PRESENT in Attendance, in case isLoginEnabled wasn't synced
      const Attendance = mongoose.models.Attendance || mongoose.models.attendance;
      let isActuallyVerified = false;
      
      if (Attendance) {
        const attendance = await Attendance.findOne({
          candidateId: candidate._id,
          attendanceStatus: "PRESENT"
        });
        
        if (attendance) {
          isActuallyVerified = true;
          // Self-heal: enable login for future
          candidate.isLoginEnabled = true;
          await candidate.save().catch((err: any) => console.error("Failed to self-heal isLoginEnabled:", err));
        }
      }
      
      if (!isActuallyVerified) {
        throw new ApiError(HTTP_STATUS.FORBIDDEN, "Your login credentials are not enabled yet. Please complete verification with the Entry Checker.");
      }
    }
    
    // 2. Check Exam
    const examId = candidate.examId;
    if (!examId) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "No exam assigned to this candidate.");
    }
    
    const Exam = mongoose.models.Exam;
    const exam = await Exam.findById(examId);
    if (!exam) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Assigned exam not found.");
    }
    
    if (!exam.finalPaperId) {
      throw new ApiError(HTTP_STATUS.FORBIDDEN, "The final paper for this exam has not been set by the Paper Setter yet.");
    }
    
    // 3. Time Check
    let loginWindowStart: Date | null = null;
    let examEnd: Date | null = null;
    
    if (exam.examDate && exam.startTime) {
      const [hours, minutes] = exam.startTime.split(':').map(Number);
      if (!isNaN(hours) && !isNaN(minutes)) {
        // Force evaluation in IST to avoid server timezone offset issues
        const istDateString = new Date(exam.examDate).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        const isoString = `${istDateString}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+05:30`;
        const dateObj = new Date(isoString);
        
        // Login window starts 15 minutes before
        loginWindowStart = new Date(dateObj.getTime() - 15 * 60000);
        // Exam ends at start time + duration
        examEnd = new Date(dateObj.getTime() + (exam.duration || 120) * 60000);
      }
    }
    
    if (loginWindowStart && examEnd) {
      const now = new Date();
      if (now < loginWindowStart) {
        const timeStr = loginWindowStart.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
        throw new ApiError(HTTP_STATUS.FORBIDDEN, `Login will be enabled 15 minutes before the exam starts. You can login at ${timeStr}.`);
      }
      
      if (now >= examEnd) {
        const endStr = examEnd.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true });
        throw new ApiError(HTTP_STATUS.FORBIDDEN, `This exam has expired. It ended at ${endStr}.`);
      }
    }
    
    // 4. Generate Token
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      { 
        id: candidate._id, 
        applicationNo: candidate.applicationNo,
        role: 'candidate',
        isImported
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "12h" }
    );
    
    // 5. Save Login Record
    const CandidateLogin = mongoose.models.candidatelogin || mongoose.models.CandidateLogin;
    const sessionId = new mongoose.Types.ObjectId().toString(); // Use a new ObjectId as sessionId for tracking
    
    if (CandidateLogin) {
      await CandidateLogin.create({
        _id: sessionId,
        candidateId: candidate._id,
        applicationNo: candidate.applicationNo,
        examId: exam._id,
        token: token,
        ipAddress: payload.ipAddress,
        deviceInfo: payload.browser,
      });
    } else {
      console.warn("CandidateLogin model not found. Skipping login record creation.");
    }
    
    return {
      candidate: {
        _id: candidate._id,
        candidateName: candidate.candidateFullName || candidate.fullName,
        applicationNo: candidate.applicationNo,
      },
      exam: {
        _id: exam._id,
        examTitle: exam.examTitle || candidate.examName,
        examCode: exam.examCode || payload.examCode,
        examDate: exam.examDate,
        startTime: exam.startTime,
        duration: exam.duration
      },
      sessionToken: token,
      sessionId: sessionId,
      nextStep: "INSTRUCTIONS"
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Face Verification
  |--------------------------------------------------------------------------
  */

  async faceVerification(payload: any) {
    const CandidateLogin = mongoose.models.candidatelogin || mongoose.models.CandidateLogin;
    
    if (CandidateLogin && payload.referenceFaceDescriptor) {
      await CandidateLogin.findByIdAndUpdate(
        payload.sessionId,
        { $set: { referenceFaceDescriptor: payload.referenceFaceDescriptor } }
      );
    }

    // In a full implementation, you would:
    // - Verify livenessScore against threshold
    // - Check if face matches reference image
    // - Record verification status

    return {
      sessionId: payload.sessionId,
      candidateId: payload.candidateId,
      faceMatched: true,
      confidenceScore: 99.18,
      livenessPassed: true,
      verificationStatus: "VERIFIED",
      verifiedAt: new Date().toISOString(),
      nextStep: "DEVICE_REGISTRATION"
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Device Registration
  |--------------------------------------------------------------------------
  */

  async deviceRegistration(payload: any) {
    // In a full implementation, you would:
    // - Verify fingerprint
    // - Update session with device info
    // - Check if device meets requirements (e.g. webcam, mic)

    return {
      sessionId: payload.sessionId,
      candidateId: payload.candidateId,
      deviceRegistered: true,
      deviceTrusted: true,
      fingerprintMatched: true,
      registeredAt: new Date().toISOString(),
      nextStep: "GEO_VERIFICATION"
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Geo Verification
  |--------------------------------------------------------------------------
  */

  async geoVerification(payload: any) {
    // In a full implementation, you would:
    // - Verify location against allowed boundaries
    // - Check VPN or Mock location usage
    // - Calculate distance from center

    return {
      sessionId: payload.sessionId,
      candidateId: payload.candidateId,
      geoVerified: true,
      distanceFromCenter: 6.8,
      allowedRadius: 50,
      verificationStatus: "VERIFIED",
      verifiedAt: new Date().toISOString(),
      nextStep: "START_EXAM"
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Start Exam
  |--------------------------------------------------------------------------
  */

  async startExam(payload: any) {
    // In a full implementation, you would:
    // - Verify that the exam shift is currently active
    // - Generate an ExamSubmission or CandidateAnswer session
    // - Initialize the timer

    return {
      sessionId: payload.sessionId,
      examId: payload.examId,
      candidateId: payload.candidateId,
      examStatus: "RUNNING",
      remainingTime: 5400,
      firstQuestionId: "6890abcd1234567890abcdef",
      currentQuestionNumber: 1,
      heartbeatEnabled: true,
      autoSaveEnabled: true,
      liveMonitoring: true,
      webcamMonitoring: true,
      tabMonitoring: true,
      screenMonitoring: true,
      fullscreenEnabled: true,
      startedAt: payload.startTime || new Date().toISOString()
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Get Questions
  |--------------------------------------------------------------------------
  */

  async getQuestions(query: any) {
    const { examId, sessionId } = query;
    const questionNo = query.questionNo ? parseInt(query.questionNo) : 1;
    
    if (!examId) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "Exam ID is required.");
    }

    const Exam = mongoose.models.Exam || mongoose.model("Exam");
    const PaperQuestion = mongoose.models.PaperQuestion || mongoose.model("PaperQuestion");

    const exam = await Exam.findById(examId).lean();
    if (!exam) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Exam not found.");
    }
    
    if (!exam.finalPaperId) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, "No paper selected for this exam.");
    }

    // Calculate strict remaining time based on examDate, startTime, and duration
    let actualRemainingTime = (exam.duration || 120) * 60;
    if (exam.examDate && exam.startTime) {
      const now = new Date();
      const [hours, minutes] = (exam.startTime as string).split(':').map(Number);
      
      // Calculate start and end properly in IST
      const istDateString = new Date(exam.examDate).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
      const isoString = `${istDateString}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+05:30`;
      const examStart = new Date(isoString);
      const examEnd = new Date(examStart.getTime() + ((exam.duration || 120) * 60000));
      
      const diffSeconds = Math.floor((examEnd.getTime() - now.getTime()) / 1000);
      actualRemainingTime = Math.max(0, diffSeconds);
    }

    const allPaperQuestions = await PaperQuestion.find({ paperId: exam.finalPaperId, isDeleted: { $ne: true } })
      .populate("questionId")
      .sort({ displayOrder: 1, questionOrder: 1 })
      .lean();
      
    if (!allPaperQuestions || allPaperQuestions.length === 0) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "No questions found in the selected paper.");
    }

    // --- SHUFFLING LOGIC (Seeded by candidateId) ---
    const candidateIdStr = query.candidateId || "default";
    let seed = candidateIdStr.split('').reduce((a: number, b: string) => a + b.charCodeAt(0), 0);
    
    function seededRandom() {
      let x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    }
    
    function shuffleArray(array: any[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Group by section
    const groupedBySection: Record<string, any[]> = {};
    for (const pq of allPaperQuestions) {
       const section = pq.sectionCode || pq.sectionName || "Default";
       if (!groupedBySection[section]) groupedBySection[section] = [];
       groupedBySection[section].push(pq);
    }
    
    // Shuffle sections
    const sectionKeys = Object.keys(groupedBySection);
    shuffleArray(sectionKeys);
    
    // Shuffle questions within each section and reconstruct the list
    const shuffledPaperQuestions = [];
    for (const sec of sectionKeys) {
       shuffleArray(groupedBySection[sec]);
       shuffledPaperQuestions.push(...groupedBySection[sec]);
    }
    // ------------------------------------------------

    const totalQuestions = shuffledPaperQuestions.length;
    const safeQuestionNo = Math.min(Math.max(1, questionNo), totalQuestions);
    const targetPaperQuestion = shuffledPaperQuestions[safeQuestionNo - 1];
    const actualQuestion: any = targetPaperQuestion.questionId;
    
    if (!actualQuestion) {
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Question reference missing.");
    }

    const safeOptions = (actualQuestion.options || []).map((opt: any) => ({
      id: opt.optionId || opt._id?.toString(),
      text: opt.optionText || opt.optionLabel,
      image: opt.image
    }));
    
    const paletteList = shuffledPaperQuestions.map((pq: any, i: number) => ({
      id: pq._id,
      questionNumber: i + 1,
      section: pq.sectionCode || pq.sectionName || "Default",
      questionType: pq.questionId?.questionType || "MCQ"
    }));

    return {
      sessionId: sessionId || "session_placeholder",
      examId: examId,
      examName: exam.examTitle || "Practice Exam",
      candidateId: query.candidateId || "candidate_placeholder",
      remainingTime: actualRemainingTime,
      currentQuestion: {
        _id: targetPaperQuestion._id,
        questionNumber: safeQuestionNo,
        section: targetPaperQuestion.sectionCode || targetPaperQuestion.sectionName || "Default",
        questionType: actualQuestion.questionType,
        difficulty: actualQuestion.difficulty,
        marks: targetPaperQuestion.marks,
        negativeMarks: targetPaperQuestion.negativeMarks,
        questionText: actualQuestion.question,
        options: safeOptions,
        attachments: actualQuestion.attachments,
        selectedOption: null,
        answerStatus: "NOT_VISITED",
        markForReview: false
      },
      navigation: {
        current: safeQuestionNo,
        totalQuestions: totalQuestions,
        previousAvailable: safeQuestionNo > 1,
        nextAvailable: safeQuestionNo < totalQuestions
      },
      paletteList,
      questionPalette: {
        answered: 0,
        notAnswered: 0,
        notVisited: totalQuestions,
        markedForReview: 0,
        answeredAndMarked: 0
      }
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Save Answer
  |--------------------------------------------------------------------------
  */

  async saveAnswer(payload: any) {
    // In a full implementation, you would:
    // - Save or update CandidateAnswer in database
    // - Calculate question palette metrics
    // - Track audit trails (autoSaved vs manual)

    return {
      sessionId: payload.sessionId,
      questionId: payload.questionId,
      questionNumber: payload.questionNumber,
      selectedOption: payload.selectedOption,
      answerStatus: payload.answerStatus,
      savedAt: payload.savedAt || new Date().toISOString(),
      autoSaved: payload.autoSaved || false,
      questionPalette: {
        answered: payload.answerStatus === "ANSWERED" ? 1 : 0,
        notAnswered: 0,
        notVisited: 39,
        markedForReview: 0,
        answeredAndMarked: 0
      }
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Mark For Review
  |--------------------------------------------------------------------------
  */

  async markForReview(payload: any) {
    let answerStatus = payload.selectedOption ? "ANSWERED_AND_MARKED_FOR_REVIEW" : "MARKED_FOR_REVIEW";
    
    return {
      sessionId: payload.sessionId,
      questionId: payload.questionId,
      questionNumber: payload.questionNumber,
      markForReview: payload.markForReview,
      selectedOption: payload.selectedOption || null,
      answerStatus: answerStatus,
      reviewedAt: payload.reviewedAt || new Date().toISOString(),
      questionPalette: {
        answered: 0,
        notAnswered: 0,
        notVisited: 39,
        markedForReview: payload.selectedOption ? 0 : 1,
        answeredAndMarked: payload.selectedOption ? 1 : 0
      }
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Clear Response
  |--------------------------------------------------------------------------
  */

  async clearResponse(payload: any) {
    return {
      sessionId: payload.sessionId,
      questionId: payload.questionId,
      questionNumber: payload.questionNumber,
      selectedOption: null,
      answerStatus: "NOT_ANSWERED",
      markForReview: payload.clearReviewFlag === true ? false : (payload.markForReview || false),
      clearedAt: payload.clearedAt || new Date().toISOString(),
      questionPalette: {
        answered: 0,
        notAnswered: 1,
        notVisited: 39,
        markedForReview: 0,
        answeredAndMarked: 0
      }
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Save & Next
  |--------------------------------------------------------------------------
  */

  async saveNext(payload: any) {
    const nextQuestionNumber = payload.currentQuestionNumber + 1;
    
    return {
      savedQuestion: {
        questionId: payload.currentQuestionId,
        questionNumber: payload.currentQuestionNumber,
        selectedOption: payload.selectedOption || null,
        answerStatus: payload.selectedOption ? "ANSWERED" : "NOT_ANSWERED"
      },
      nextQuestion: {
        _id: "6890abcd1234567890abcdf0",
        questionNumber: nextQuestionNumber,
        section: "Java",
        questionType: "MCQ",
        marks: 2,
        negativeMarks: 0.5,
        questionText: "Which collection allows duplicate elements?",
        options: [
          { id: "A", text: "HashSet" },
          { id: "B", text: "TreeSet" },
          { id: "C", text: "LinkedHashSet" },
          { id: "D", text: "ArrayList" }
        ],
        selectedOption: null,
        answerStatus: "NOT_VISITED"
      },
      remainingTime: 5180,
      questionPalette: {
        answered: payload.selectedOption ? 1 : 0,
        notAnswered: payload.selectedOption ? 0 : 1,
        notVisited: 38, // Simulating progress
        markedForReview: 0,
        answeredAndMarked: 0
      }
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Previous Question
  |--------------------------------------------------------------------------
  */

  async previousQuestion(query: any) {
    const currentQuestionNumber = query.currentQuestionNumber ? parseInt(query.currentQuestionNumber) : 2;
    const prevQuestionNumber = currentQuestionNumber - 1 > 0 ? currentQuestionNumber - 1 : 1;
    
    return {
      sessionId: query.sessionId || "6899abcd1234567890abcdef",
      currentQuestionNumber: prevQuestionNumber,
      remainingTime: 5148,
      question: {
        _id: "6890abcd1234567890abcdef",
        questionNumber: prevQuestionNumber,
        section: "Java",
        questionType: "MCQ",
        marks: 2,
        negativeMarks: 0.5,
        questionText: "Which keyword is used to inherit a class in Java?",
        options: [
          { id: "A", text: "implements" },
          { id: "B", text: "inherits" },
          { id: "C", text: "extends" },
          { id: "D", text: "super" }
        ],
        selectedOption: "C",
        answerStatus: "ANSWERED",
        markForReview: false
      },
      navigation: {
        previousAvailable: prevQuestionNumber > 1,
        nextAvailable: true
      },
      questionPalette: {
        answered: 1,
        notAnswered: 0,
        notVisited: 38,
        markedForReview: 0,
        answeredAndMarked: 0
      }
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Submit Exam
  |--------------------------------------------------------------------------
  */

  async submitExam(payload: any) {
    const ImportCandidate = mongoose.models.importcandidate || mongoose.models.ImportCandidate;
    const Exam = mongoose.models.Exam || mongoose.models.exam;
    
    // Attempt to fetch extra details
    const candidate = await ImportCandidate?.findById(payload.candidateId).lean();
    const exam = await Exam?.findById(payload.examId).lean();
    
    // Fetch paper questions for detailed storage
    const PaperQuestion = mongoose.models.PaperQuestion || mongoose.model("PaperQuestion");
    let detailedQuestions: any[] = [];
    const activePaperId = exam?.finalPaperId || exam?.paperId;
    if (activePaperId) {
      const paperQuestions = await PaperQuestion.find({ paperId: activePaperId }).populate("questionId").lean();
      detailedQuestions = paperQuestions.map((q: any) => {
        const qIdStr = q._id.toString();
        const actualQ = q.questionId || {};
        return {
          questionId: qIdStr,
          questionText: actualQ.question || q.questionText,
          options: actualQ.options || q.options,
          correctAnswer: actualQ.correctAnswer || actualQ.correctOption || q.correctAnswer || q.correctOption,
          candidateAnswer: payload.answers ? payload.answers[qIdStr] || null : null,
          status: payload.statuses ? payload.statuses[qIdStr] || "NOT_VISITED" : "NOT_VISITED",
          marks: q.marks,
          negativeMarks: q.negativeMarks
        };
      });
    }

    const CandidateExamAnswer = mongoose.models.CandidateExamAnswer || mongoose.model("CandidateExamAnswer", new mongoose.Schema({}, { strict: false, collection: 'candidateexamanswer' }));
    
    if (payload.answers && payload.statuses) {
      try {
        await CandidateExamAnswer.create({
          _id: new mongoose.Types.ObjectId(),
          submissionId: new mongoose.Types.ObjectId(),
          questionId: new mongoose.Types.ObjectId(),
          candidateId: payload.candidateId,
          applicationNo: candidate?.applicationNo || 'N/A',
          candidateName: candidate?.candidateFullName || candidate?.fullName || 'N/A',
          examId: payload.examId,
          examName: exam?.examTitle || 'Practice Exam',
          answers: payload.answers,
          statuses: payload.statuses,
          results: detailedQuestions,
          submitType: payload.submitType || "MANUAL",
          submitReason: payload.submitReason || "CANDIDATE_SUBMITTED",
          submittedAt: payload.submittedAt || new Date().toISOString(),
        });
        fs.appendFileSync(path.join(process.cwd(), 'submit_log.txt'), `[MANUAL SUBMIT] Saved successfully for candidate ${payload.candidateId}\n`);
      } catch (err: any) {
        fs.appendFileSync(path.join(process.cwd(), 'submit_log.txt'), `[MANUAL SUBMIT ERROR] ${err.message}\n`);
      }
    } else {
        fs.appendFileSync(path.join(process.cwd(), 'submit_log.txt'), `[MANUAL SUBMIT FAILED] Missing answers or statuses. Payload: ${JSON.stringify(payload)}\n`);
    }

    // Disconnect candidate session after submission
    await this.disconnectCandidateSession(payload.candidateId, payload.examId);

    return {
      sessionId: payload.sessionId,
      examId: payload.examId,
      candidateId: payload.candidateId,
      examStatus: "SUBMITTED",
      submittedAt: payload.submittedAt || new Date().toISOString(),
      submitType: payload.submitType || "MANUAL",
      monitoringStopped: true,
      heartbeatStopped: true,
      sessionLocked: true,
      sessionDisconnected: true,
      resultStatus: "PROCESSING"
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Auto Submit Exam
  |--------------------------------------------------------------------------
  */

  async autoSubmitExam(payload: any) {
    const ImportCandidate = mongoose.models.importcandidate || mongoose.models.ImportCandidate;
    const Exam = mongoose.models.Exam || mongoose.models.exam;
    
    // Attempt to fetch extra details
    const candidate = await ImportCandidate?.findById(payload.candidateId).lean();
    const exam = await Exam?.findById(payload.examId).lean();
    
    // Fetch paper questions for detailed storage
    const PaperQuestion = mongoose.models.PaperQuestion || mongoose.model("PaperQuestion");
    let detailedQuestions: any[] = [];
    const activePaperId = exam?.finalPaperId || exam?.paperId;
    if (activePaperId) {
      const paperQuestions = await PaperQuestion.find({ paperId: activePaperId }).populate("questionId").lean();
      detailedQuestions = paperQuestions.map((q: any) => {
        const qIdStr = q._id.toString();
        const actualQ = q.questionId || {};
        return {
          questionId: qIdStr,
          questionText: actualQ.question || q.questionText,
          options: actualQ.options || q.options,
          correctAnswer: actualQ.correctAnswer || actualQ.correctOption || q.correctAnswer || q.correctOption,
          candidateAnswer: payload.answers ? payload.answers[qIdStr] || null : null,
          status: payload.statuses ? payload.statuses[qIdStr] || "NOT_VISITED" : "NOT_VISITED",
          marks: q.marks,
          negativeMarks: q.negativeMarks
        };
      });
    }
    
    const CandidateExamAnswer = mongoose.models.CandidateExamAnswer || mongoose.model("CandidateExamAnswer", new mongoose.Schema({}, { strict: false, collection: 'candidateexamanswer' }));
    
    if (payload.answers && payload.statuses) {
      try {
        await CandidateExamAnswer.create({
          _id: new mongoose.Types.ObjectId(),
          submissionId: new mongoose.Types.ObjectId(),
          questionId: new mongoose.Types.ObjectId(),
          candidateId: payload.candidateId,
          applicationNo: candidate?.applicationNo || 'N/A',
          candidateName: candidate?.candidateFullName || candidate?.fullName || 'N/A',
          examId: payload.examId,
          examName: exam?.examTitle || 'Practice Exam',
          answers: payload.answers,
          statuses: payload.statuses,
          results: detailedQuestions,
          submitType: "AUTO",
          submitReason: payload.submitReason || "TIME_EXPIRED",
          submittedAt: payload.submittedAt || new Date().toISOString(),
        });
        fs.appendFileSync(path.join(process.cwd(), 'submit_log.txt'), `[AUTO SUBMIT] Saved successfully for candidate ${payload.candidateId}\n`);
      } catch (err: any) {
        fs.appendFileSync(path.join(process.cwd(), 'submit_log.txt'), `[AUTO SUBMIT ERROR] ${err.message}\n`);
      }
    } else {
        fs.appendFileSync(path.join(process.cwd(), 'submit_log.txt'), `[AUTO SUBMIT FAILED] Missing answers or statuses. Payload: ${JSON.stringify(payload)}\n`);
    }

    // Disconnect candidate session after auto-submission
    await this.disconnectCandidateSession(payload.candidateId, payload.examId);

    return {
      sessionId: payload.sessionId,
      examId: payload.examId,
      candidateId: payload.candidateId,
      examStatus: "AUTO_SUBMITTED",
      submitReason: payload.submitReason || "TIME_EXPIRED",
      triggeredBy: payload.triggeredBy || "SYSTEM",
      submittedAt: payload.submittedAt || new Date().toISOString(),
      sessionLocked: true,
      sessionDisconnected: true,
      monitoringStopped: true,
      heartbeatStopped: true,
      resultStatus: "PROCESSING"
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Result Preview
  |--------------------------------------------------------------------------
  */

  async resultPreview(query: any) {
    return {
      sessionId: query.sessionId || "6899abcd1234567890abcdef",
      candidate: {
        _id: query.candidateId || "6887abcd1234567890abc001",
        candidateName: "Rahul Sharma",
        enrollmentNo: "EX20260001"
      },
      exam: {
        _id: query.examId || "6888abcd1234567890abcdef",
        examTitle: "Java Full Stack Recruitment Exam",
        examCode: "EXAM-JAVA-001"
      },
      score: {
        totalMarks: 80,
        obtainedMarks: 68,
        correctAnswers: 34,
        wrongAnswers: 4,
        unanswered: 2,
        percentage: 85
      },
      result: {
        status: "PASS",
        rank: 12,
        grade: "A"
      },
      published: false,
      generatedAt: new Date().toISOString()
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Violation Logs
  |--------------------------------------------------------------------------
  */

  async violationLogs(query: any) {
    return {
      sessionId: query.sessionId || "6899abcd1234567890abcdef",
      candidateId: query.candidateId || "6887abcd1234567890abc001",
      examId: query.examId || "6888abcd1234567890abcdef",
      totalViolations: 4,
      autoSubmitted: false,
      violations: [
        {
          _id: "6899log001",
          violationType: "TAB_SWITCH",
          severity: "MEDIUM",
          count: 2,
          description: "Candidate switched browser tab.",
          actionTaken: "Warning",
          capturedAt: "2026-08-15T09:42:18.000Z"
        },
        {
          _id: "6899log002",
          violationType: "FACE_NOT_VISIBLE",
          severity: "HIGH",
          count: 1,
          description: "Face not detected for 15 seconds.",
          actionTaken: "Alert Sent",
          capturedAt: "2026-08-15T10:05:42.000Z"
        },
        {
          _id: "6899log003",
          violationType: "FULLSCREEN_EXIT",
          severity: "MEDIUM",
          count: 1,
          description: "Candidate exited fullscreen.",
          actionTaken: "Fullscreen Restored",
          capturedAt: "2026-08-15T10:18:55.000Z"
        }
      ]
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Log Violation
  |--------------------------------------------------------------------------
  */

  async logViolation(payload: any) {
    const { sessionId, violationType } = payload;
    
    const LiveMonitoring = mongoose.models.livemonitoring || mongoose.models.LiveMonitoring;
    let autoSubmitTriggered = false;
    
    if (LiveMonitoring) {
      const monitoring = await LiveMonitoring.findOne({ sessionId: sessionId, isDeleted: false });
      
      if (monitoring) {
        const id = monitoring._id.toString();
        
        if (violationType === 'FACE_NOT_DETECTED') {
          await liveMonitoringService.faceNotDetected(id);
          const updated = await LiveMonitoring.findById(id);
          if (updated && updated.faceNotDetectedCount >= 5) {
            autoSubmitTriggered = true;
          }
        } else if (violationType === 'MULTIPLE_FACES') {
          await liveMonitoringService.multipleFacesDetected(id);
          const updated = await LiveMonitoring.findById(id);
          if (updated && updated.multipleFacesCount >= 4) {
            autoSubmitTriggered = true;
          }
        } else if (violationType === 'UNREGISTERED_FACE') {
          await liveMonitoringService.unregisteredFaceDetected(id);
        }
        
        if (autoSubmitTriggered) {
          // Trigger auto submit
          await this.autoSubmitExam({
            sessionId: sessionId,
            candidateId: monitoring.candidateId,
            examId: monitoring.examId,
            submitReason: violationType + '_LIMIT_REACHED',
            triggeredBy: 'SYSTEM'
          });
        }
      }
    }

    return {
      sessionId: payload.sessionId,
      violationType: payload.violationType,
      loggedAt: new Date().toISOString(),
      autoSubmitTriggered: autoSubmitTriggered
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Session Heartbeat
  |--------------------------------------------------------------------------
  */

  async sessionHeartbeat(payload: any) {
    return {
      sessionId: payload.sessionId,
      status: "ACTIVE",
      lastHeartbeat: payload.heartbeatAt || new Date().toISOString(),
      remainingTime: payload.remainingTime || 4500,
      serverTime: new Date().toISOString(),
      nextHeartbeatIn: 20,
      warnings: []
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Reconnect Session
  |--------------------------------------------------------------------------
  */

  async reconnectSession(payload: any) {
    return {
      sessionId: payload.sessionId,
      examStatus: "RUNNING",
      currentQuestionNumber: 18,
      remainingTime: 2715,
      lastSavedQuestion: 18,
      heartbeatResumed: true,
      monitoringResumed: true,
      fullscreenRequired: true,
      reconnectedAt: payload.reconnectedAt || new Date().toISOString(),
      warnings: []
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Exam Summary
  |--------------------------------------------------------------------------
  */

  async examSummary(query: any) {
    return {
      sessionId: query.sessionId || "6899abcd1234567890abcdef",
      candidate: {
        _id: query.candidateId || "6887abcd1234567890abc001",
        candidateName: "Rahul Sharma",
        enrollmentNo: "EX20260001"
      },
      exam: {
        _id: query.examId || "6888abcd1234567890abcdef",
        examTitle: "Java Full Stack Recruitment Exam",
        examCode: "EXAM-JAVA-001"
      },
      timeSummary: {
        duration: 90,
        timeUsed: 86,
        timeRemaining: 4
      },
      questionSummary: {
        totalQuestions: 40,
        answered: 38,
        notAnswered: 2,
        markedForReview: 1,
        answeredAndMarked: 3
      },
      sectionSummary: [
        {
          section: "Java",
          answered: 18,
          total: 20
        },
        {
          section: "Spring Boot",
          answered: 20,
          total: 20
        }
      ],
      securitySummary: {
        totalViolations: 4,
        tabSwitches: 2,
        fullscreenExit: 1,
        faceWarnings: 1
      },
      submission: {
        submitType: "MANUAL",
        submittedAt: "2026-08-15T10:58:46.000Z",
        status: "SUBMITTED"
      }
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Final Result
  |--------------------------------------------------------------------------
  */

  async finalResult(query: any) {
    return {
      candidate: {
        _id: query.candidateId || "6887abcd1234567890abc001",
        candidateName: "Rahul Sharma",
        enrollmentNo: "EX20260001",
        email: "rahul.sharma@example.com"
      },
      exam: {
        _id: query.examId || "6888abcd1234567890abcdef",
        examTitle: "Java Full Stack Recruitment Exam",
        examCode: "EXAM-JAVA-001",
        examDate: "2026-08-15"
      },
      score: {
        totalMarks: 80,
        obtainedMarks: 68,
        correctAnswers: 34,
        wrongAnswers: 4,
        unanswered: 2,
        percentage: 85
      },
      sectionWisePerformance: [
        {
          section: "Java",
          obtainedMarks: 36,
          totalMarks: 40,
          percentage: 90
        },
        {
          section: "Spring Boot",
          obtainedMarks: 32,
          totalMarks: 40,
          percentage: 80
        }
      ],
      result: {
        status: "PASS",
        grade: "A",
        rank: 12,
        percentile: 98.45,
        meritStatus: true
      },
      publishedBy: {
        _id: "6880employee1234567890abc",
        name: "Exam Manager"
      },
      publishedAt: "2026-08-15T12:15:00.000Z",
      certificateAvailable: true,
      resultPdf: "/results/EX20260001.pdf"
    };
  }
}

export const candidateExamService = new CandidateExamService();
