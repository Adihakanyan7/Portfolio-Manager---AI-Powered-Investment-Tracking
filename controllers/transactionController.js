import fetch from 'node-fetch';
import Security from '../models/security.js';

const isValidRisk = (stockRisk) => {
    const riskMapping = { low: 1, medium: 2, high: 3 };
    return stockRisk <= riskMapping[global.riskLevel];
};

export const createTransaction = async (req, res) => {
    try {
        const { stockName, quantity } = req.body;
        const numQuantity = Number(quantity);

        if (isNaN(numQuantity) || numQuantity === 0) {
            return res.status(400).json({ error: "Quantity must be a non-zero valid number." });
        }

        const existingStock = await Security.findOne({ name: stockName });

        // 🟢 אם מוכרים מניה (מספר שלילי)
        if (numQuantity < 0) {
            if (!existingStock) {
                return res.status(404).json({ error: "Stock not found. Cannot sell." });
            }
            
            if (!isValidRisk(existingStock.S_industry)) {
                return res.status(400).json({ error: "Stock risk level is too high for your portfolio." });
            }
            if (existingStock.shares < Math.abs(numQuantity)) {
                return res.status(400).json({ error: "Not enough shares to sell." });
            }

            existingStock.shares += numQuantity; // מכירה = מספר שלילי
            await existingStock.save();
            return res.status(200).json({
                message: `Sold ${Math.abs(numQuantity)} shares of ${stockName}.`,
                updatedStock: existingStock,
            });
        }

        // 🟢 אם קונים מניה (מספר חיובי)
        if (existingStock) {
            if (!isValidRisk(existingStock.S_industry)) {
                return res.status(400).json({ error: "Stock risk level is too high for your portfolio." });
            }
            existingStock.shares += numQuantity;
            await existingStock.save();
            return res.status(200).json({
                message: `Added ${numQuantity} shares to stock ${stockName}.`,
                updatedStock: existingStock,
            });
        }

        // 🟢 אם המניה לא קיימת – מבקשים מידע מ-Ollama
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "mistral",
                prompt: `Give me the following information about ${stockName} stock in JSON format:
                - Name (string)
                - Level of risk (low, medium, high)
                - Variance (float, numeric only)
                - Percentage (float, numeric only, no text)
                - Type (string, only "stock" or "bond")
                - S_industry (integer, map based on sector risk levels: 3 for high-risk, 2 for medium-risk, 1 for low-risk)
                - Dividend (float, numeric only)
                - Current price (float, numeric only)`
            }),
        });

        const rawChunks = await response.text();
        const jsonLines = rawChunks.split("\n").filter(line => line.trim() !== "");
        const fullJsonString = jsonLines.map(line => JSON.parse(line).response).join("");
        const data = JSON.parse(fullJsonString);

        if (!data) {
            return res.status(500).json({ error: "Failed to fetch stock data from Ollama" });
        }

        if (!isValidRisk(data.S_industry)) {
            return res.status(400).json({ error: "Stock risk level is too high for your portfolio." });
        }

        const newStock = new Security({
            name: data.Name,
            shares: numQuantity,
            variance: data.Variance,
            type: data.Type,
            S_industry: data.S_industry,
            dividend: data.Dividend,
            currentPrice: data["Current price"],
        });

        await newStock.save();

        return res.status(201).json({
            message: `Stock ${stockName} created and ${numQuantity} shares added.`,
            newStock,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
