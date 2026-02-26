export const getTrades = (req, res) => {
    res.json({message: "Getting all trades...."});
};

export const createTrade = (req, res) => {
    res.status(201).json({
        message: "Trade created successfully",
        data: req.body
    });
};