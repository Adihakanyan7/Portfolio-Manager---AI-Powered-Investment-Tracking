import fetch from 'node-fetch';
import Security from '../models/security.js';
import { deleteSecurityByName } from '../controllers/securityController.js';
const calculatePortfolioRisk = async (newShares = 0, newIndustryRisk = 0, newVariance = 0, newPrice = 0) => {
    try {
        const securities = await Security.find();

        let numerator = 0;
        let denominator = 0;

        securities.forEach(security => {
            const S_industry = security.S_industry;
            const T_i = security.variance > 1.5 ? 2 : 1;
            const R_i = S_industry * T_i;
            const v_i = security.shares * security.currentPrice;

            numerator += v_i * R_i;
            denominator += v_i;
        });

        // הוספת הנתונים החדשים
        const T_new = newVariance > 1.5 ? 2 : 1;
        const R_new = newIndustryRisk * T_new;
        const v_new = newShares * newPrice;

        numerator += v_new * R_new;
        denominator += v_new;

        const R_portfolio = denominator === 0 ? 0 : numerator / denominator;

        return R_portfolio < global.riskThreshold.min
            ? global.riskThreshold.min + 0.1
            : R_portfolio > global.riskThreshold.max
            ? global.riskThreshold.max
            : R_portfolio;
    } catch (error) {
        console.error("Error calculating portfolio risk:", error);
        throw new Error(error.message);
    }
};


export const createTransaction = async (req, res) => {
    try {
        const { stockName, quantity } = req.body;
        const numQuantity = Number(quantity);

        if (isNaN(numQuantity) || numQuantity === 0) {
            return res.status(400).json({ error: "Quantity must be a valid non-zero number." });
        }

        const existingStock = await Security.findOne({ name: stockName.toLowerCase() });
        console.log("Existing stock:", existingStock);

        // 🟢 אם זו מכירה
        if (numQuantity < 0) {
            if (!existingStock) {
                return res.status(404).json({ error: "Stock not found. Cannot sell." });
            }

            if (existingStock.shares < Math.abs(numQuantity)) {
                return res.status(400).json({ error: "Not enough shares to sell." });
            }

            existingStock.shares += numQuantity; // עדכון מספר המניות לאחר המכירה

            if (existingStock.shares === 0) {
                deleteSecurityByName(existingStock.name); // מחיקת המניה ממסד הנתונים אם אין מניות
                return res.status(200).json({
                    message: `Sold ${Math.abs(numQuantity)} shares of ${stockName.toLowerCase()}. Stock removed from portfolio.`,
                });
            }

            await existingStock.save();

            return res.status(200).json({
                message: `Sold ${Math.abs(numQuantity)} shares of ${stockName.toLowerCase()}.`,
                updatedStock: existingStock,
            });
        }

        if (existingStock) {

            existingStock.shares += numQuantity;

            const portfolioRisk = await calculatePortfolioRisk(numQuantity, existingStock.S_industry, existingStock.variance, existingStock.currentPrice);
            if (portfolioRisk > global.riskThreshold.max || portfolioRisk < global.riskThreshold.min) {
                return res.status(400).json({
                    error: `Transaction denied: Portfolio risk would be ${portfolioRisk}, outside acceptable range.`,
                    portfolioRisk
                });
            }

            await existingStock.save();
            return res.status(200).json({
                message: `Added ${numQuantity} shares to stock ${stockName.toLowerCase()}.`,
                updatedStock: existingStock,
            });
        } else {
            const response = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "mistral",
                    prompt: `Give me the following information about ${stockName.toLowerCase()} stock in JSON format:
                    - Name (string - ONLY the stock name, no spaces or special characters)
                    - Level of risk (low, medium, high)
                    - Variance (integer, only 1 or 2, where: variance < 1.5 → 1, variance ≥ 1.5 → 2)
                    - Type (string, only "stock" or "bond")
                    - S_industry (integer, map based on sector risk levels: 3 for high-risk, 2 for medium-risk, 1 for low-risk)
                    - Dividend (float, numeric only)
                    - Current price (float, numeric only)`
                }),
            });

            const rawChunks = await response.text();
            const jsonLines = rawChunks.split("\n").filter(line => line.trim() !== "");
            const fullJsonString = jsonLines.map(line => JSON.parse(line).response).join("");
            const stockData = JSON.parse(fullJsonString);

            if (!stockData) {
                return res.status(500).json({ error: "Failed to fetch stock data from Ollama" });
            }
            const portfolioRisk = await calculatePortfolioRisk(numQuantity, stockData.S_industry, stockData.variance);

            if (portfolioRisk > global.riskThreshold.max || portfolioRisk < global.riskThreshold.min) {
                return res.status(400).json({
                    error: `Transaction denied: Portfolio risk would be ${portfolioRisk}, outside acceptable range.`,
                    portfolioRisk
                });
            }

            const newStock = new Security({
                name: stockName.toLowerCase(),
                shares: numQuantity,
                variance: stockData.Variance,
                type: stockData.Type.toLowerCase(),
                S_industry: stockData.S_industry,
                dividend: stockData.Dividend,
                currentPrice: stockData["Current price"],
            });
    
            await newStock.save();
            console.log("New stock saved:", newStock);
            
            return res.status(201).json({
                message: `Stock ${stockName} created and ${numQuantity} shares added.`,
                newStock,
            });
    
        }


        


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
