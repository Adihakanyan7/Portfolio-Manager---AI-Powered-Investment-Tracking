import Security from '../models/security.js';
import Stock from '../models/stock.js';
import Bond from '../models/bond.js';

export const createStock = async (req, res) => {
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

export const createBond = async (req, res) => {
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

export const getAllSecurities = async (req, res) => {
  try {
    const securities = await Security.find();
    res.status(200).json(securities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateStockByName = async (req, res) => {
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

export const updateBondByName = async (req, res) => {
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


export const deleteSecurityByName = async (name) => {
  try {
    // Find and delete the stock by name
    const deletedStock = await Security.findOneAndDelete({ name });

    // If the stock doesn't exist, simply return without doing anything
    if (!deletedStock) {
      return;
    }

    // Successfully deleted; no response or further action needed
    //console.log(`Stock '${name}' deleted successfully`);
    return;
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error deleting stock:', error.message);
  }
};


