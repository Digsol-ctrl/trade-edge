import cors from 'cors';

app.use(cors({
  origin: 'trade-edge-tau.vercel.app', // your Vercel URL
  credentials: true,
}));