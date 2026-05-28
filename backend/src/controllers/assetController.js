import { createFabricConnection } from '../config/fabric.js';

// 1. Create Asset (POST)
export const createAsset = async (req, res) => {
    try {
        const { id, nama, status, lokasi } = req.body;

        if (!id || !nama || !status || !lokasi) {
            return res.status(400).json({ message: "Semua field (id, nama, status, lokasi) wajib diisi!" });
        }

        const { contract, gateway, client } = await createFabricConnection();

        // Memanggil fungsi CreateAsset di Smart Contract Agung
        console.log(`--> Submitting CreateAsset Transaction untuk ID: ${id}`);
        await contract.submitTransaction('CreateAsset', id, nama, status, lokasi);
        console.log('--> Transaction committed successfully');

        // Selalu tutup koneksi setelah selesai
        gateway.close();
        client.close();

        res.status(201).json({
            success: true,
            message: `Asset ${id} berhasil dicatat di blockchain`,
            data: { id, nama, status, lokasi }
        });

    } catch (error) {
        console.error(`Gagal submit transaksi: ${error}`);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. Read Asset By ID (GET)
export const getAssetById = async (req, res) => {
    try {
        const { id } = req.params;
        const { contract, gateway, client } = await createFabricConnection();

        console.log(`--> Evaluating ReadAsset Transaction untuk ID: ${id}`);
        const resultBytes = await contract.evaluateTransaction('ReadAsset', id);
        
        gateway.close();
        client.close();

        // Mengubah bytes dari Fabric menjadi string JSON
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