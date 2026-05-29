import { createFabricConnection } from '../config/fabric.js';

// 1. Create Asset (POST) - UPDATED 6 PARAMETERS
export const createAsset = async (req, res) => {
    try {
        // Ambil 6 variabel baru dari req.body sesuai request Smart Contract
        const { id, pengirim, penerima, statusBarang, lokasiSaatIni, pemegangAset } = req.body;

        // Validasi agar tidak ada field yang kosong
        if (!id || !pengirim || !penerima || !statusBarang || !lokasiSaatIni || !pemegangAset) {
            return res.status(400).json({ 
                message: "Semua field (id, pengirim, penerima, statusBarang, lokasiSaatIni, pemegangAset) wajib diisi!" 
            });
        }

        const { contract, gateway, client } = await createFabricConnection();

        console.log(`--> Submitting CreateAsset Transaction untuk ID: ${id}`);
        
        // Urutan HARUS PERSIS seperti ini saat ditembak ke Fabric milik Agung
        await contract.submitTransaction(
            'CreateAsset', 
            id, 
            pengirim, 
            penerima, 
            statusBarang, 
            lokasiSaatIni, 
            pemegangAset
        );
        
        console.log('--> Transaction committed successfully dengan 6 parameter');

        gateway.close();
        client.close();

        res.status(201).json({
            success: true,
            message: `Asset ${id} berhasil dicatat di blockchain`,
            data: { id, pengirim, penerima, statusBarang, lokasiSaatIni, pemegangAset }
        });

    } catch (error) {
        console.error(`Gagal submit transaksi: ${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Read Asset By ID (GET) - Tetap sama
export const getAssetById = async (req, res) => {
    try {
        const { id } = req.params;
        const { contract, gateway, client } = await createFabricConnection();

        console.log(`--> Evaluating ReadAsset Transaction untuk ID: ${id}`);
        const resultBytes = await contract.evaluateTransaction('ReadAsset', id);
        
        gateway.close();
        client.close();

        const resultString = new TextDecoder().decode(resultBytes);
        const assetData = JSON.parse(resultString);

        res.status(200).json({
            success: true,
            data: assetData
        });

    } catch (error) {
        console.error(`Gagal membaca transaksi: ${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
};