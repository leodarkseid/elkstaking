import {ethers, Signer } from "ethers";
import {  } from "hardhat";
import { Marketplace__factory, TestSHIT__factory } from "../typechain-types";
import { marketplaceSol } from "../typechain-types/contracts";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
    const provider = new ethers.providers.InfuraProvider(
        "sepolia",
        process.env.INFURA_API_KEY
        );
    const privateKey = process.env.PRIVATE_KEY;
    if(!privateKey || privateKey.length <= 0)
        throw new Error("Missing private key");
    const wallet = new ethers.Wallet(privateKey);
    const signer = wallet.connect(provider);
    const balance = await signer.getBalance();
    console.log(`Wallet balance: ${balance} Wei`);

    // Set up MarketplaceV2 contract factory
    const MpFactory = new Marketplace__factory(signer);

    // Deploy the contract
    const contract = await MpFactory.deploy();

    // Wait for the contract to be mined
    const contractTx = await contract.deployTransaction.wait();

    // Log contract address and transaction hash
    console.log('Contract deployed to:', contract.address);
    console.log('Transaction hash:', contract.deployTransaction.hash);
    console.log('Transaction hash:', contractTx.blockHash);
    console.log('Transaction hash:', contractTx.gasUsed);


    

}


main().catch((error) =>{
    console.error(error);
    process.exitCode = 1;
});