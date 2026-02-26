import prisma from '../config/prisma.js';

export const getDashboard = async (req, res) => {
  try {
    const trades = await prisma.trade.findMany({
      where: { userId: req.user.id, status: 'CLOSED' }
    });

    if (trades.length === 0) {
      return res.status(200).json({
        totalTrades: 0,
        totalPnL: 0,
        winRate: 0,
        averagePnL: 0,
        averageR: 0,
        profitFactor: 0,
        winningTrades: 0,
        losingTrades: 0,
        grossProfit: 0,
        grossLoss: 0,
      });
    }

    const totalTrades = trades.length;
    const totalPnl = trades.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
    const grossProfit = trades.reduce((sum, t) => sum + (t.pnl > 0 ? t.pnl : 0), 0);
    const grossLoss = trades.reduce((sum, t) => sum + (t.pnl < 0 ? Math.abs(t.pnl) : 0), 0);
    const wins = trades.filter(t => (t.pnl ?? 0) > 0).length;
    const closedWithR = trades.filter(t => t.rMultiple != null);

    const winRate = totalTrades ? wins / totalTrades : 0;
    const avgPnl = totalTrades ? totalPnl / totalTrades : 0;
    const avgR = closedWithR.length ? (closedWithR.reduce((s, t) => s + (t.rMultiple ?? 0), 0) / closedWithR.length) : 0;
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : (grossProfit > 0 ? Infinity : 0);

    res.status(200).json({
      totalTrades,
      totalPnl,
      avgPnl,
      winRate,
      avgR,
      profitFactor,
      grossProfit,
      grossLoss
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { getDashboard };
