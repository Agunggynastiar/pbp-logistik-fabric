import express from 'express';
import { createAsset, getAssetById } from '../controllers/assetController.js';

const router = express.Router();

// Endpoint untuk membuat asset baru: POST http://localhost:5000/api/assets
router.post('/assets', createAsset);

// Endpoint untuk mengambil asset berdasarkan ID: GET http://localhost:5000/api/assets/BRG-001
router.get('/assets/:id', getAssetById);

export default router;