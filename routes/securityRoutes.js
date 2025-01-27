const express = require('express');
const {createStock, createBond, getAllSecurities, updateStockByName, updateBondByName, deleteStockByName, deleteBondByName, calculateRisk} = require('../controllers/securityController');
const router = express.Router();

router.get('/get-all-securities', getAllSecurities);
router.get('/calculate-risk/:name', calculateRisk);


router.post('/create-stock', createStock);
router.post('/create-bond', createBond);

router.put('/update-stock-by-name', updateStockByName);
router.put('/update-bond-by-name', updateBondByName);

router.delete('/delete-stock-by-name', deleteStockByName);
router.delete('/delete-bond-by-name', deleteBondByName);



module.exports = router;