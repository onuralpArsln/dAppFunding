import * as StellarSdk from 'stellar-sdk';
import { isConnected, isAllowed, getPublicKey, signTransaction } from '@stellar/freighter-api';

const contractId = 'CB3B4RDIGJTTI5V5IXI7HZ7URZSWW2ENGB7O77LDJA6USNUZRBKL66OX';
const networkPassphrase = StellarSdk.Networks.TESTNET;
const rpcUrl = 'https://soroban-testnet.stellar.org';

const server = new StellarSdk.SorobanRpc.Server(rpcUrl);

async function getAccount(publicKey) {
    return await server.getAccount(publicKey);
}

export async function callContract(method, ...params) {
    if (!(await isConnected()) || !(await isAllowed())) {
        throw new Error('Freighter wallet is not connected or not allowed');
    }

    const publicKey = await getPublicKey();
    const account = await getAccount(publicKey);

    const contract = new StellarSdk.Contract(contractId);
    const tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase,
    })
        .addOperation(contract.call(method, ...params))
        .setTimeout(30)
        .build();

    const signedTx = await signTransaction(tx.toXDR(), { network: networkPassphrase });
    const txResult = await server.sendTransaction(StellarSdk.TransactionBuilder.fromXDR(signedTx, networkPassphrase));

    return txResult;
}

export async function createProject(creator, goal, duration) {
    const result = await callContract('create_project', creator, goal, duration);
    return result.project_id;
}

export async function fundProject(projectId, funder, amount) {
    await callContract('fund_project', projectId, funder, amount);
}

export async function getProject(projectId) {
    const result = await callContract('get_project', projectId);
    return result;
}

export async function finalizeProject(projectId) {
    await callContract('finalize_project', projectId);
}