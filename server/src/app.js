import express from "express"
import cors from "cors"
import  tradeRoutes from "./routes/tradeRoutes.js"

console.log("tradeRoutes:", tradeRoutes)

const app = express()

//Middleware
app.use(cors())
app.use(express.json())


app.get("/", (req, res) => {
    res.json({message: "Trade Journal API is running!"})
});

app.use("/api/trades", tradeRoutes);

export default app;

