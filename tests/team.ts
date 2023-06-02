// import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { ethers } from "hardhat";
// import {expect, assert} from "chai";
// import { deployContract } from "@nomiclabs/hardhat-ethers/types";


// describe('TeamVester', function () {
//   let elk, teamVester, owner, recipient;

//   const MAX_AMOUNT_CLAIMABLE = ethers.utils.parseEther('1000');
//   const VESTING_PERIOD = 60 * 60 * 24 * 365; // 1 year
//   const WITHDRAWAL_WINDOW = 60 * 60 * 24 * 30; // 30 days
//   const AMOUNT = ethers.utils.parseEther('500');

//   before(async function () {
//     [owner, recipient] = await ethers.getSigners();

//     const Elk = await ethers.getContractFactory('Elk');
//     elk = await Elk.deploy(owner.getAddress());

//     const TeamVester = await ethers.getContractFactory('TeamVester');
//     teamVester = await TeamVester.deploy(elk.address, MAX_AMOUNT_CLAIMABLE);
//     await elk.transfer(teamVester.address, AMOUNT);
//     await teamVester.setRecipient(recipient.getAddress());
//   });

//   describe('claim', function () {
//     it('should allow recipient to claim tokens after vesting period', async function () {
//       const startingBalance = await elk.balanceOf(recipient.getAddress());

//       // Move time forward by the vesting period
//       await ethers.provider.send('evm_increaseTime', [VESTING_PERIOD]);
//       await ethers.provider.send('evm_mine', []);

//       await teamVester.connect(recipient).claim();

//       const endingBalance = await elk.balanceOf(recipient.getAddress());
//       expect(endingBalance.sub(startingBalance)).to.equal(AMOUNT);
//     });

//     it('should not allow recipient to claim tokens before vesting period', async function () {
//       await expect(teamVester.connect(recipient).claim()).to.be.revertedWith('TeamVester::claim: not yet vested');
//     });

//     it('should not allow recipient to claim tokens during withdrawal window', async function () {
//       // Move time forward by the vesting period
//       await ethers.provider.send('evm_increaseTime', [VESTING_PERIOD]);
//       await ethers.provider.send('evm_mine', []);

//       // Claim once to lock the withdrawal window
//       await teamVester.connect(recipient).claim();

//       // Move time forward by the withdrawal window
//       await ethers.provider.send('evm_increaseTime', [WITHDRAWAL_WINDOW]);
//       await ethers.provider.send('evm_mine', []);

//       await expect(teamVester.connect(recipient).claim()).to.be.revertedWith('TeamVester::claim: withdrawal window active');
//     });

//     it('should not allow recipient to claim more than the max amount claimable per year', async function () {
//       // Move time forward by the vesting period
//       await ethers.provider.send('evm_increaseTime', [VESTING_PERIOD]);
//       await ethers.provider.send('evm_mine', []);

//       // Claim once to lock the withdrawal window
//       await teamVester.connect(recipient).claim();

//       // Move time forward by the withdrawal window
//       await ethers.provider.send('evm_increaseTime', [WITHDRAWAL_WINDOW]);
//       await ethers.provider.send('evm_mine', []);

//       // Try to claim more than the max amount claimable per year
//       await expect(teamVester.connect(recipient).claim()).to.be.revertedWith('TeamVester::maxAmountClaimablePerYear: max amount claimable per year reached');
//     });
//   })};