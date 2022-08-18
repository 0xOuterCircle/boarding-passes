const hre = require("hardhat");
const fs = require("fs");

async function main() {

  const BP = await hre.ethers.getContractFactory("BoardingPass");
  const bp = await BP.deploy("");
  await bp.deployed();

  const addresses = {
    BoardingPass: bp.address
  }
  console.log("Boarding Pass is deployed at:", bp.address);

  fs.writeFileSync(`./addresses.json`, JSON.stringify(addresses, null, 4));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
