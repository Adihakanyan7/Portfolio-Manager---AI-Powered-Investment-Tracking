export const setRiskLevel = (req, res) => {
    const { riskLevel } = req.body;

    if (!["low", "medium", "high"].includes(riskLevel)) {
        return res.status(400).json({ error: "Invalid risk level. Choose 'low', 'medium', or 'high'." });
    }

    global.riskLevel = riskLevel;
    console.log(`🔄 Risk level updated to: ${global.riskLevel}`);
    res.status(200).json({ message: `Risk level set to ${riskLevel}` });
};

export const getRiskLevel = (req, res) => {
    res.status(200).json({ riskLevel: global.riskLevel });
};
