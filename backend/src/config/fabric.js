import * as grpc from '@grpc/grpc-js';
import { connect, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function getIdentity() {
    const credentials = await fs.readFile(path.resolve(process.env.USER_CERT_PATH));
    return { mspId: process.env.MSPID, credentials };
}

async function getSigner() {
    const privateKeyPem = await fs.readFile(path.resolve(process.env.USER_KEY_PATH));
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
}

async function getTlsCert() {
    return await fs.readFile(path.resolve(process.env.TLS_CERT_PATH));
}

export async function createFabricConnection() {
    const tlsCert = await getTlsCert();
    const credentials = grpc.credentials.createSsl(tlsCert);
    
    const client = new grpc.Client(process.env.PEER_ENDPOINT, credentials, {
        'grpc.ssl_target_name_override': process.env.PEER_HOST_ALIAS
    });

    const gateway = connect({
        client,
        identity: await getIdentity(),
        signer: await getSigner(),
        evaluateOptions: () => ({ deadline: Date.now() + 5000 }),
        endorseOptions: () => ({ deadline: Date.now() + 15000 }),
    });

    const network = gateway.getNetwork(process.env.CHANNEL_NAME);
    const contract = network.getContract(process.env.CHAINCODE_NAME);

    return { contract, gateway, client };
}