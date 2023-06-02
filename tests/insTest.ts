import { ethers } from "hardhat";
import { Elk, Elk__factory, InsuranceHolder, InsuranceHolder__factory } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Signer, ContractInterface } from "ethers";

describe("Contract Deployment and Functionality", function () {
  let token: Elk;
  let contract: InsuranceHolder;
  let signer: Signer;
  let signer1: Signer;

  before(async function () {
    const helpers = require("@nomicfoundation/hardhat-network-helpers");

    const signers = await ethers.getSigners();
    signer = signers[0];
    signer1 = signers[1];

    const tokenFactory = new Elk__factory(signer);
    token = await tokenFactory.deploy();
    await token.deployTransaction.wait();
    const tokenAddress = token.address;

    const TMFactory = new InsuranceHolder__factory(signer);
    contract = await TMFactory.deploy(tokenAddress, 1000);
    await contract.deployTransaction.wait();

    //other necessary script for the test to be passed
    await token.transfer(contract.address, 20000);
    await contract.setRecipient(signer1.address);
    expect(1).to.equal(1);
    


  });

  it("should deploy the token and contract", async function () {
    expect(token.address).to.not.equal(undefined);
    expect(contract.address).to.not.equal(undefined);
  });

  it("should transfer tokens to the contract", async function () {
    const contractBalance1 = await token.balanceOf(contract.address);
    expect(contractBalance1.toString()).to.equal("20000");
  });

  it("should set the recipient", async function () {
    const recipient = await contract.recipient();
    expect(recipient).to.equal(signer1.address);
  });

  it("should claim tokens", async function () {
    const claim1 = await contract.connect(signer1).claim(900);
    await claim1.wait();
    const signerBalance1 = await token.balanceOf(signer1.address);
    const contractBalance = await token.balanceOf(contract.address);
    expect(signerBalance1.toString()).to.equal("900");
    expect(contractBalance.toString()).to.equal("19100");
  });

  it("should claim all tokens", async function () {
    const claimAll = await contract.connect(signer1).claimAll();
    await claimAll.wait();
    const signerBalance1 = await token.balanceOf(signer1.address);
    const contractBalance = await token.balanceOf(contract.address);
    expect(signerBalance1.toString()).to.equal("1000");
    expect(contractBalance.toString()).to.equal("19000");
  });

  it("should burn some tokens", async function () {
    const burn = await contract.connect(signer1).burn(100);
    await burn.wait();
    const contractBalance = await token.balanceOf(contract.address);
    const burnedTokens = await contract.burnedTokens();
    const trueBalance = await contract.withdrawableBalance()
    expect(contractBalance.toString()).to.equal("19000");
    expect(burnedTokens.toString()).to.equal("100");
    expect(trueBalance.toString()).to.equal("18900");
  });

  it("should increase time", async function () {
    await time.increase(70000000);
    const updateVaultTime = await contract.connect(signer1).updateVaultTime();
    await updateVaultTime.wait();
    const getVaultYear = await contract.getVaultYear();
    expect(getVaultYear.toString()).to.equal("2025");
  });

  it("should claim tokens again after increasing time", async function () {
    const claimAll = await contract.connect(signer1).claimAll();
    await claimAll.wait();
    const amountAvailable1 = await contract.availableAmount();
    const signerBalance1 = await token.balanceOf(signer1.address);
    const contractBalance1 = await token.balanceOf(contract.address);
    await time.increase(31557600);
    await contract.connect(signer1).updateVaultTime();
    const claim2 = await contract.connect(signer1).claim(50);
    await claim2.wait();
    const amountAvailable2 = await contract.availableAmount();
    const signerBalance2 = await token.balanceOf(signer1.address);
    const contractBalance2 = await token.balanceOf(contract.address);

    expect(amountAvailable1.toString()).to.equal("0");
    expect(signerBalance1.toString()).to.equal("2000");
    expect(contractBalance1.toString()).to.equal("18000");
    expect(amountAvailable2.toString()).to.equal("950");
    expect(signerBalance2.toString()).to.equal("2050");
    expect(contractBalance2.toString()).to.equal("17950");
  });

  it("Burnt token shouldn't be available for withdrawal", async function () {
    const burn = await contract.connect(signer1).burn(100);
    await burn.wait();
    const contractBalance2 = await token.balanceOf(contract.address);
    const burnedTokens = await contract.burnedTokens();
    const trueBalance = await contract.withdrawableBalance()
    const signerBalance1 = await token.balanceOf(signer1.address);
    const availableAmount1 = await contract.availableAmount();
    const claim = await contract.connect(signer1).claim(900);
    await claim.wait();
    const signerBalance2 = await token.balanceOf(signer1.address);
    const availableAmount2 = await contract.availableAmount();
    expect(contractBalance2.toString()).to.equal("17950");
    expect(burnedTokens.toString()).to.equal("200");
    expect(trueBalance.toString()).to.equal("17750");
    expect(signerBalance1.toString()).to.equal("2050");
    expect(signerBalance2.toString()).to.equal("2950");
    expect(availableAmount1.toString()).to.equal("950");
    expect(availableAmount2.toString()).to.equal("50");
  });
});
