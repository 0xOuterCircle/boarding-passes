const hre = require("hardhat");

async function main() {

  const supply = 500;
  const contract_at = "0x503638f43beacb9ecd18931ed532285fd793f624";
  const receiver = "";

  const BP = await hre.ethers.getContractFactory("BoardingPass");
  const bp = await BP.attach(contract_at);

  // uint256 supply
  // uint256 price
  // uint256 txLimit
  // bool publicMint
  let tx = await bp.newPrinter(supply, 0, 0, false);
  console.log("New Printer TX:", tx.hash);
  await tx.wait();

  const id = (await bp.totalPrinters()).toNumber() + 2

  tx = await bp.print(receiver, id, supply, [], {nonce: 2});
  console.log("Print TX:", tx.hash);

  const balance = (await bp.balanceOf(receiver, id)).toNumber()

  console.log(`${balance} of ${id} is printed to ${receiver}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
