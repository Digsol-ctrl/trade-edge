import express from "express"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

//Middleware
app.use(cors())
app.use(express.json())

// Test route
app.get("/", (req, res) => {
    res.json({message: "Trade Journal API is running!"})
})

app.get("/ten", (req, res) => {
    res.json({message: "ten route is working!"})
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});

