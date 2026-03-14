import express from 'express';
/* import { getTrades,
    getTradeById,
     createTrade,
     updateTrade,
     deleteTrade
 } from '../controllers/tradeController.js'; */
import { createTrade } from '../controllers/tradeController.js'
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

//router.get('/', protect, getTrades);
router.post('/', protect, createTrade);
//router.put('/:id', protect, updateTrade);
//router.delete('/:id', protect, deleteTrade);
//router.get('/:id', protect, getTradeById);

export default router;