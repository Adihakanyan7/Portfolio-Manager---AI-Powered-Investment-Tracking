import Security from '../models/security.js';

export const setRiskLevel = (req, res) => {
    const { riskLevel } = req.body;

    if (!["low", "medium", "high"].includes(riskLevel)) {
        return res.status(400).json({ error: "Invalid risk level. Choose 'low', 'medium', or 'high'." });
    }
    switch (riskLevel) {
        case 'low':
            global.riskThreshold = { min: 0.1, max: 2.5 }; // סיכון נמוך
        case 'medium':
            global.riskThreshold =  { min: 2.51, max: 4.5 }; // סיכון בינוני
        case 'high':
            global.riskThreshold = { min: 4.51, max: 6 }; // סיכון גבוה
        default:
            global.riskThreshold = { min: 2.51, max: 4.5 }; // ברירת מחדל: בינוני
    }

    global.riskLevel = riskLevel;
    console.log(`🔄 Risk level updated to: ${global.riskLevel}`);
    res.status(200).json({ message: `Risk level set to ${riskLevel}` });
};

export const getRiskLevel = (req, res) => {
    res.status(200).json({ riskLevel: global.riskLevel });
};

