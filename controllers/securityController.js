const Security = require('../models/security');
const Stock = require('../models/stock');
const Bond = require('../models/bond');

const createStock = async (req, res) => {
  const stock = new Stock(req.body);
  try {
    const savedStock = await stock.save();
    res.status(201).json(savedStock);
  } catch (error) {
    if (error.code === 11000) {
      res.status(401).json({ error: 'Stock with this name already exists' });
    } else {
      res.status(402).json({ error: error.message });
    }
  }
};

const createBond = async (req, res) => {
  const bond = new Bond(req.body);
  try {
    const savedBond = await bond.save();
    res.status(201).json(savedBond);
  } catch (error) {
    if (error.code === 11000) {
      res.status(401).json({ error: 'Bond with this name already exists' });
    } else {
      res.status(402).json({ error: error.message });
    }
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

const updateStockByName = async (req, res) => {
  try {
    const { name, shares } = req.body;

    const updataStock = await Stock.findOneAndUpdate(
      { name: name },
      { shares: shares },
      { new: true, runValidators: true }
    );
    if (!updataStock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.status(200).json(updataStock);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const updateBondByName = async (req, res) => {
  try {
    const { name, shares } = req.body;


    const updatedBond = await Bond.findOneAndUpdate(
      { name },
      { shares },
      { new: true, runValidators: true }
    );

    if (!updatedBond) {
      return res.status(404).json({ error: 'Bond not found' });
    }

    res.status(200).json(updatedBond);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const deleteStockByName = async (req, res) => {
  try {
    const { name } = req.body;

    const deletedStock = await Stock.findOneAndDelete({ name });

    if (!deletedStock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.status(200).json({ message: `Stock '${name}' deleted successfully` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteBondByName = async (req, res) => {
  try {
    const { name } = req.body;

    const deletedBond = await Bond.findOneAndDelete({ name });

    if (!deletedBond) {
      return res.status(404).json({ error: 'Bond not found' });
    }

    res.status(200).json({ message: `Bond '${name}' deleted successfully` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const calculateRisk = async (req, res) => {
  try {
    const { name } = req.params;

    const security = await Security.findOne({ name });
    if (!security) {
      return res.status(404).json({ error: 'Security not found' });
    }

    const risk = security.calculateRisk();

    res.status(200).json({ name: security.name, risk });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = { createStock, createBond, getAllSecurities, updateStockByName, updateBondByName, deleteStockByName, deleteBondByName, calculateRisk };