import express from 'express';
import { setRiskLevel, getRiskLevel } from '../controllers/riskController.js';

const router = express.Router();

router.post('/risk', setRiskLevel); 
router.get('/risk', getRiskLevel); 

export default router;
