package main

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract menyediakan fungsi-fungsi untuk mengelola aset logistik
type SmartContract struct {
	contractapi.Contract
}

// Asset merepresentasikan struktur data barang logistik ekspor-impor
type Asset struct {
	ID             string `json:"ID"`
	Pengirim       string `json:"pengirim"`
	Penerima       string `json:"penerima"`
	StatusBarang   string `json:"statusBarang"` // Contoh: "Pemeriksaan Bea Cukai", "Pemuatan", "Transit", "Selesai"
	LokasiSaatIni  string `json:"lokasiSaatIni"`
	PemegangAset   string `json:"pemegangAset"`  // Organisasi yang bertanggung jawab saat ini (BeaCukai / Logistik)
}

// CreateAsset membuat data barang logistik baru di ledger
func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, id string, pengirim string, penerima string, statusBarang string, lokasiSaatIni string, pemegangAset string) error {
	exists, err := s.AssetExists(ctx, id)
	if err != nil {
		return err
	}
	if exists {
		return fmt.Errorf("aset logistik dengan ID %s sudah ada", id)
	}

	asset := Asset{
		ID:             id,
		Pengirim:       pengirim,
		Penerima:       penerima,
		StatusBarang:   statusBarang,
		LokasiSaatIni:  lokasiSaatIni,
		PemegangAset:   pemegangAset,
	}

	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, assetJSON)
}

// ReadAsset mengambil data barang logistik berdasarkan ID
func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, id string) (*Asset, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return nil, fmt.Errorf("gagal membaca dari world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("aset logistik dengan ID %s tidak ditemukan", id)
	}

	var asset Asset
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}

// UpdateAssetStatus memperbarui lokasi dan status barang logistik
func (s *SmartContract) UpdateAssetStatus(ctx contractapi.TransactionContextInterface, id string, statusBarang string, lokasiSaatIni string) error {
	asset, err := s.ReadAsset(ctx, id)
	if err != nil {
		return err
	}

	asset.StatusBarang = statusBarang
	asset.LokasiSaatIni = lokasiSaatIni

	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, assetJSON)
}

// TransferAsset mengubah hak pertanggungjawaban/pemegang aset logistik
func (s *SmartContract) TransferAsset(ctx contractapi.TransactionContextInterface, id string, pemegangBaru string) error {
	asset, err := s.ReadAsset(ctx, id)
	if err != nil {
		return err
	}

	asset.PemegangAset = pemegangBaru

	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, assetJSON)
}

// GetAssetHistory melacak seluruh riwayat perjalanan barang logistik (Audit Trail)
func (s *SmartContract) GetAssetHistory(ctx contractapi.TransactionContextInterface, id string) ([]string, error) {
	log.Printf("Mengambil riwayat untuk aset: %s", id)

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(id)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var records []string
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var asset Asset
		if len(response.Value) > 0 {
			err = json.Unmarshal(response.Value, &asset)
			if err != nil {
				return nil, err
			}
		} else {
			asset = Asset{ID: id}
		}

		timestamp := response.Timestamp.AsTime()
		record := fmt.Sprintf("TxId: %s | Waktu: %s | Status: %s | Lokasi: %s | Pemegang: %s", response.TxId, timestamp.String(), asset.StatusBarang, asset.LokasiSaatIni, asset.PemegangAset)
		records = append(records, record)
	}

	return records, nil
}

// AssetExists memeriksa apakah barang dengan ID tertentu sudah terdaftar
func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, id string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(id)
	if err != nil {
		return false, fmt.Errorf("gagal membaca data: %v", err)
	}
	return assetJSON != nil, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		log.Panicf("Error saat membuat logistik chaincode: %v", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panicf("Error saat menjalankan logistik chaincode: %v", err)
	}
}