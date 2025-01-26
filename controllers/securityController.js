const Stock = require('../models/stock');
const Bond = require('../models/bond');

const createStock = async (req, res) => {
  const stock = new Stock(req.body);
  try {
    const savedStock = await stock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createBond = async (req, res) => {
  const bond = new Bond(req.body);
  try {
    const savedBond = await bond.save();
    res.status(201).json(savedBond);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllSecurities = async (req, res) => {
  try {
    const securities = await Stock.find();
    res.status(200).json(securities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createStock, createBond, getAllSecurities };