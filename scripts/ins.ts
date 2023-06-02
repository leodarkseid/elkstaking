import {ethers} from "hardhat";
import { Elk__factory, InsuranceHolder__factory } from "../typechain-types";
import { time, mine } from "@nomicfoundation/hardhat-network-helpers";


async function main() {

    const helpers = require("@nomicfoundation/hardhat-network-helpers");
    
    const signer = await ethers.getSigners();
    const tokenFactory = new Elk__factory(signer[0]);
    const token = await tokenFactory.deploy();
    const tokenTx = await token.deployTransaction.wait();
    const tokenAddress = token.address;

    console.log('Token deployed to:', tokenAddress);

    const claimAmount = 1000



    const TMFactory = new InsuranceHolder__factory(signer[0]);
    const contract = await TMFactory.deploy(tokenAddress, claimAmount);
    const contractTx = await contract.deployTransaction.wait();
    console.log('Contract deployed to:', contract.address);

    const transferTk = await token.transfer(contract.address, 20000);
    const transferTx = await transferTk.wait();

    const amountAvailable = await contract.availableAmount();
    console.log('Amount available0:', amountAvailable.toString());

    const setRecipient = await contract.setRecipient(signer[0].address);
    const setRecipientTx = await setRecipient.wait();

    const claim = await contract.claim(900);
    const claimTx = await claim.wait();

    const amountAvailable2 = await contract.availableAmount();
    console.log('Amount available1:', amountAvailable2.toString());

    const blockNumBefor = await ethers.provider.getBlockNumber();
    console.log('Block number before:', blockNumBefor.toString());

    
    const blockop = await ethers.provider.getBlock(blockNumBefor);
    console.log("Block timestamp:", blockop.timestamp);

    await helpers.time.increase(41557600);

    const updateVaultTime = await contract.updateVaultTime();
    const updateBlockTimeTx = await updateVaultTime.wait();

    const claim2 = await contract.claim(100);
    const claimTx2 = await claim2.wait();
    

    const amountAvailable3 = await contract.availableAmount();
    console.log('Amount available2:', amountAvailable3.toString());

    const blockNumBefore = await ethers.provider.getBlockNumber();
    console.log('Block number before:', blockNumBefore.toString());

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    console.log("Block timestamp:", block.timestamp);

}

main().catch((error) =>{
    console.error(error);
    process.exitCode = 1;
});