import { Router } from "express";
import { getCenterPayments, getCompanyCenterPayments, markPaymentAsPaid, createRazorpayPaymentOrder, verifyRazorpayPayment } from "./centerPayments.controller";
import { authenticate } from "../../middleware/authenticate";
import { authorize } from "../../middleware/authorize";

const router = Router();

router.get('/debug-count', async (req, res) => {
    try {
        const CenterPayments = require('./centerPayments.model').default;
        const mongoose = require('mongoose');
        const count = await CenterPayments.countDocuments();
        
        const payments = await CenterPayments.find({ shiftId: { $exists: false } }).limit(5);
        for (let p of payments) {
            const shiftCount = await mongoose.model("Shift").countDocuments({ examId: p.examId });
            if (shiftCount === 0) {
                // Create a dummy shift
                await mongoose.model("Shift").create({
                    examId: p.examId,
                    shiftName: "Morning Shift",
                    startTime: "09:00",
                    endTime: "12:00",
                    date: new Date(),
                    centerCapacity: []
                });
            }
        }
        
        res.json({ count, msg: "Dummy shifts created if missing" });
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
