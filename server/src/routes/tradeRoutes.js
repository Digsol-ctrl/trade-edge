import express from 'express';
import { getTrades, createTrade, } from '../controllers/tradeController.js';

const router = express.Router();

router.get('/', getTrades);
router.post('/', createTrade);

export default router;