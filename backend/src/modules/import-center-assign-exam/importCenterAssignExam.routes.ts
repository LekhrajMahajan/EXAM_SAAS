import { Router } from 'express';
import {
  createImportCenterAssignExam,
  getImportCenterAssignExamById,
  getAllImportCenterAssignExams,
  sendToCompanyAdmin,
  sendToCenters,
  getAssignedExamsForCenter,
} from './importCenterAssignExam.controller';
import { authenticate } from '../../middleware/authenticate';

const router = Router();
router.use(authenticate);

// Define routes
// TODO: Add auth and RBAC middleware as per your app's standard if needed
// For now making it accessible for development and testing

router.post('/', createImportCenterAssignExam);
router.get('/assigned-exams/center/:centerId', getAssignedExamsForCenter);
router.get('/', getAllImportCenterAssignExams);
router.get('/:id', getImportCenterAssignExamById);
router.patch('/:id/send', sendToCompanyAdmin);
router.post('/:id/send-to-centers', sendToCenters);

export default router;
