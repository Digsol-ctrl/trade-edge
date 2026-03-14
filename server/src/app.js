import express from "express"
import cors from "cors"
import  tradeRoutes from "./routes/tradeRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import dashBoardRoutes from "./routes/dashboardRoutes.js";

const app = express()

app.get("/", (req, res) => {
    res.json({message: "Trade Journal API is running!"})
});

//Middleware
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/dashboard", dashBoardRoutes);

export default app;

