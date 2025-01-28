import express from 'express';
import { createStock, createBond, getAllSecurities, updateStockByName, updateBondByName, deleteSecurityByName} from '../controllers/securityController.js';
const router = express.Router();

router.get('/get-all-securities', getAllSecurities);


router.post('/create-stock', createStock);
router.post('/create-bond', createBond);

router.put('/update-stock-by-name', updateStockByName);
router.put('/update-bond-by-name', updateBondByName);

router.delete('/delete-security-by-name', deleteSecurityByName);




export default router;