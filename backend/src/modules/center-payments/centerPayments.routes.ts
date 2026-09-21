import { Router } from "express";
import { getCenterPayments, getCompanyCenterPayments, markPaymentAsPaid, createRazorpayPaymentOrder, verifyRazorpayPayment } from "./centerPayments.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

const router = Router();

router.get('/debug-count', async (req, res) => {
    try {
        const CenterPayments = require('./centerPayments.model').default;
        const allPayments = await CenterPayments.find({}).lean();
        res.json({ allPayments });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Debug: show what companyId is in the token and whether payments match
router.get('/debug-auth', async (req: any, res: any) => {
    try {
        const mongoose = require('mongoose');
        const jwt = require('jsonwebtoken');
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');
        let decoded: any = {};
        try { decoded = jwt.decode(token); } catch (_) {}
        
        const companyIdFromToken = decoded?.companyId;
        const userIdFromToken = decoded?.userId;
        
        const CenterPayments = require('./centerPayments.model').default;
        
        // Try querying with the token's companyId
        let byCompanyId: any[] = [];
        if (companyIdFromToken) {
            byCompanyId = await CenterPayments.find({ companyId: new mongoose.Types.ObjectId(companyIdFromToken) }).lean();
        }
        
        // Also try by userId in case companyId is actually userId
        let byUserId: any[] = [];
        if (userIdFromToken) {
            byUserId = await CenterPayments.find({ companyId: new mongoose.Types.ObjectId(userIdFromToken) }).lean();
        }
        
        const allPayments = await CenterPayments.find({}).select('companyId').lean();
        
        res.json({ 
            tokenCompanyId: companyIdFromToken,
            tokenUserId: userIdFromToken,
            byCompanyIdCount: byCompanyId.length,
            byUserIdCount: byUserId.length,
            allPaymentsCompanyIds: allPayments.map((p: any) => p.companyId?.toString())
        });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// One-time utility: generate payments for all ended exams that have a centerId but no payment yet
router.get('/generate-missing', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const Exam = mongoose.model('Exam');
        const CenterPayments = require('./centerPayments.model').default;
        
        const endedExams = await Exam.find({ 
            status: { $in: ['PENDING_RESULT_GENERATE', 'RESULT_GENERATED'] },
            centerId: { $exists: true, $ne: null }
        }).lean();
        
        await CenterPayments.deleteMany({});
        
        let created = 0;
        const centerPaymentsService = require('./centerPayments.service').default;
        for (const exam of endedExams) {
            const existing = await CenterPayments.findOne({ examId: exam._id, centerId: exam.centerId });
            if (!existing) {
                await centerPaymentsService.generatePaymentsForExam(exam._id, exam.companyId);
                created++;
            }
        }
        res.json({ message: `Attempted to generate ${created} missing payments for ${endedExams.length} ended exams.` });
    } catch (e) {
        res.status(500).json({ error: String(e) });
    }
});

// Apply authentication middleware
router.use(authenticate);

// Route for Company Admin to get all center payments
router.get("/company", authorize("COMPANY_ADMIN", "Company Admin"), getCompanyCenterPayments);

// Route for Center Manager to get their payments
router.get("/", authorize("CENTER_MANAGER", "Center Manager", "COMPANY_ADMIN", "Company Admin"), getCenterPayments);

// Route for Company Admin to mark payment as paid manually
router.patch("/:id/pay", authorize("COMPANY_ADMIN", "Company Admin"), markPaymentAsPaid);

// Routes for Razorpay Integration
router.post("/:id/razorpay-order", authorize("COMPANY_ADMIN", "Company Admin"), createRazorpayPaymentOrder);
router.post("/:id/verify-razorpay", authorize("COMPANY_ADMIN", "Company Admin"), verifyRazorpayPayment);

export default router;
