import dotenv from 'dotenv';
import app from './app.js';

// load environment variables before anything else
dotenv.config();

// Prisma client will handle its own connection when first used

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});