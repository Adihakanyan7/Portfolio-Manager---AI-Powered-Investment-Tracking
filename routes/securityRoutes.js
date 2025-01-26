const express = require('express');
const {createStock, createBond, getAllSecurities} = require('../controllers/securityController');
const router = express.Router();

router.post('/create-stock', createStock);
router.post('/create-bond', createBond);
router.get('/get-all-securities', getAllSecurities);

module.exports = router;