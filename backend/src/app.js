import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import assetRoutes from './routes/assetRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Supaya server bisa membaca body format JSON

// Routing API Jaringan Logistik
app.use('/api', assetRoutes);

// Jalankan Server
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 REST API Server Jaringan Logistik v1.0 Berjalan!`);
    console.log(`📡 Endpoint: http://localhost:${PORT}`);
    console.log(`====================================================`);
});