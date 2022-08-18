
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { mapValues } = require("hardhat/internal/util/lang");

describe("Main test", function () {

  describe("Boarding Pass", function () {

    let bp;
    let signers;
    let addresses;

    before(async function () {
      const BP = await ethers.getContractFactory("BoardingPass");
      bp = await BP.deploy("");
      await bp.deployed();

      signers = await ethers.getSigners();
      addresses = mapValues(signers, signer => signer.address);
    })


    it("Should verify owner's balance of 1st Pass is 0", async function () {
      expect(await bp.balanceOf(addresses[0], 1)).to.equal("0");
    });

    it("Should setup contract", async function () {
      await (await bp.transferOwnership(addresses[1], {nonce: 1})).wait()
      expect(await bp.owner()).to.equal(addresses[1])

      await (await bp.connect(signers[1]).transferOwnership(addresses[0])).wait()
      expect(await bp.owner()).to.equal(addresses[0])

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
          bp.print(addresses[0], 1, 1, []))
          .to.be.revertedWith("BoardingPass: can't print provided the pass with given id/amount");

      await expect(
          bp.connect(signers[1]).print(addresses[1], 1, 1, []))
          .to.be.revertedWith("BoardingPass: can't print provided the pass with given id/amount");
    });


    it("Should create a new Printer", async function () {
      await expect(
          bp.print(addresses[0], 1, 1, []))
          .to.be.revertedWith("BoardingPass: can't print provided the pass with given id/amount");

      await expect(
          bp.connect(signers[1]).print(addresses[1], 1, 1, []))
          .to.be.revertedWith("BoardingPass: can't print provided the pass with given id/amount");

      await expect(
          bp.connect(signers[1]).newPrinter(1000, "1000", 3, false))
          .to.be.revertedWith("Ownable: caller is not the owner");

      await(await bp.newPrinter(1000, "1000", 3, false)).wait();

    });

    it("Validate minting", async function () {
      await expect(
          bp.connect(signers[1]).print(addresses[1], 1, 1, []))
          .to.be.revertedWith("BoardingPass: not enough Eth to print passes");

      await expect(
          bp.connect(signers[1]).print(addresses[1], 1, 4, [], {value: "4000"}))
          .to.be.revertedWith("BoardingPass: available amount exceeds the tx limit");

      await expect(
          bp.connect(signers[1]).print(addresses[1], 1, 1, [], {value: "1000"}))
          .to.be.revertedWith("BoardingPass: msg.sender should be the owner to perform the action");

      await (await bp.print(addresses[0], 1, 1000, [])).wait();

      expect(await bp.balanceOf(addresses[0], 1)).to.be.equal("1000");
    });

    it("Update URI", async function () {

      await expect(
          bp.connect(signers[1]).setURI("no way"))
          .to.be.revertedWith("Ownable: caller is not the owner");

      expect(await bp.uri(1)).to.be.equal("");

      await (await bp.setURI("Test URI")).wait();

      expect(await bp.uri(1)).to.be.equal("Test URI");
    });

  });

});
