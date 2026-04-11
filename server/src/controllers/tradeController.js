import prisma from '../config/prisma.js';


export const getTrades = async (req, res) => {
    try {
        const trades = await prisma.trade.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json(trades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTradeById = async (req, res) => {
    try {
        // id is a UUID string, so use it directly and include the user filter
        const trade = await prisma.trade.findFirst({
            where: {
                id: req.params.id,
                userId: req.user.id,
            }
        });
        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }
        res.json(trade);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/trades - Create trade
export const createTrade = async (req, res) => {
    const {
        pair,
        direction,
        entryPrice,
        exitPrice,
        stopLoss,
        takeProfit,
        positionSize,
        riskPercent,
        strategy,
        timeframe,
        session,
        marketCondition,
        confidence,
        mistakes,
        notes,
        screenshots,
        openedAt,
        closedAt,
        status
    } = req.body;

    try {
        // Calculate PnL and R multiple if exitPrice exists
        let pnl, rMultiple;
        if (exitPrice != null && positionSize != null) {
            pnl = direction === "LONG"
                ? (exitPrice - entryPrice) * positionSize
                : (entryPrice - exitPrice) * positionSize;

            if (stopLoss != null) {
                rMultiple = pnl / Math.abs(entryPrice - stopLoss);
            }
        }

        // Extract screenshot data URLs from objects
        const screenshotUrls = Array.isArray(screenshots)
            ? screenshots.map(s => typeof s === 'string' ? s : s.data).filter(Boolean)
            : [];

        const trade = await prisma.trade.create({
            data: {
                pair,
                direction,
                entryPrice: parseFloat(entryPrice),
                exitPrice: exitPrice ? parseFloat(exitPrice) : null,
                stopLoss: stopLoss ? parseFloat(stopLoss) : null,
                takeProfit: takeProfit ? parseFloat(takeProfit) : null,
                positionSize: positionSize ? parseFloat(positionSize) : null,
                riskPercent: riskPercent ? parseFloat(riskPercent) : null,
                strategy,
                timeframe,
                session,
                marketCondition,
                confidence: confidence ? parseInt(confidence) : null,
                mistakes,
                notes,
                screenshots: screenshotUrls,
                openedAt: openedAt ? new Date(openedAt) : new Date(),
                closedAt: closedAt ? new Date(closedAt) : null,
                status,
                pnl,
                rMultiple,
                userId: req.user.id
            }
        });
        res.status(201).json(trade);
    } catch (error) {
        console.error('Trade creation error:', error);
        res.status(500).json({ 
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
};


export const updateTrade = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    try {
        const trade = await prisma.trade.findFirst({
            where: {
                id,
                userId: req.user.id,
            }
        });
        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }
        let pnl, rMultiple;
        rMultiple = trade.rMultiple;

        // recalc if any relevant numeric fields changed
        if (
            updates.exitPrice !== undefined ||
            updates.entryPrice !== undefined ||
            updates.direction !== undefined ||
            updates.stopLoss !== undefined ||
            updates.positionSize !== undefined
        ) {
            const exitPrice = updates.exitPrice !== undefined ? updates.exitPrice : trade.exitPrice;
            const entryPrice = updates.entryPrice !== undefined ? updates.entryPrice : trade.entryPrice;
            const direction = updates.direction !== undefined ? updates.direction : trade.direction;
            const stopLoss = updates.stopLoss !== undefined ? updates.stopLoss : trade.stopLoss;
            const positionSize = updates.positionSize !== undefined ? updates.positionSize : trade.positionSize;

            if (exitPrice != null && positionSize != null) {
                pnl = direction === "LONG"
                    ? (exitPrice - entryPrice) * positionSize
                    : (entryPrice - exitPrice) * positionSize;

                if (stopLoss != null) {
                    rMultiple = pnl / Math.abs(entryPrice - stopLoss);
                }
            }
        }

        const updatedTrade = await prisma.trade.update({
            where: { id },
            data: {
                ...updates,
                pnl,
                rMultiple,
                status: updates.status || trade.status
            }
        });
        res.json(updatedTrade);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }

};

// DELETE /api/trades/:id - Delete trade
export const deleteTrade = async (req, res) => {
    try {
        const trade = await prisma.trade.findFirst({
            where: {
                id: req.params.id,    
                userId: req.user.id,
            }
        });
        if (!trade) {
            return res.status(404).json({ message: 'Trade not found' });
        }
        await prisma.trade.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Trade deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}