
const { expect } = require("chai");
const { ethers } = require("hardhat");
const {mapValues} = require("hardhat/internal/util/lang");

describe("Main test", function () {

  describe("Boarding Pass", function () {

    let bp;
    let signers;
    let addresses;

    before(async function () {
      const BP = await ethers.getContractFactory("BoardingPass");
      bp = await BP.deploy();
      await bp.deployed();

      signers = await ethers.getSigners();
      addresses = mapValues(signers, signer => signer.address);
    })


    it("Should verify owner's balance of 1st pass is 0", async function () {
      expect(await bp.balanceOf(addresses[0], 1)).to.equal("0");
    });


    it("Should fail to get unexciting Printer", async function () {
      await expect(
          bp.getPrinter(0))
          .to.be.revertedWith("BoardingPass: Pass Printer doesn't exist");

      await expect(
          bp.getPrinter(1))
          .to.be.revertedWith("BoardingPass: Pass Printer doesn't exist");
    });


    it("Should fail mint unexciting Pass", async function () {
      await expect(
          bp.mint(addresses[0], 1, 1, []))
          .to.be.revertedWith("BoardingPass: can't print provided the pass with given id/amount");

      await expect(
          bp.connect(signers[1]).mint(addresses[1], 1, 1, []))
          .to.be.revertedWith("BoardingPass: can't print provided the pass with given id/amount");
    });


    it("Should create a new Printer", async function () {
      await expect(
          bp.mint(addresses[0], 1, 1, []))
          .to.be.revertedWith("BoardingPass: can't print provided the pass with given id/amount");

      await expect(
          bp.connect(signers[1]).mint(addresses[1], 1, 1, []))
          .to.be.revertedWith("BoardingPass: can't print provided the pass with given id/amount");
    });

  });

});
