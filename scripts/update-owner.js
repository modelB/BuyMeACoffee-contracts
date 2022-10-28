// scripts/update-owner.js

const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
  const balanceBigInt = await provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {
  // UPDATE TO NEW INTENDED OWNER PUBLIC KEY
  const newOwnerAddress = "0xA247e0BCEb1a503a290e39BE7310C7B2C253fd80";

  // Get the contract that has been deployed to Goerli.
  const contractAddress = "0x04EE5C0Cc779915Fa8B2D9cdaa43C96E44b2f5D1";
  const contractABI = abi.abi;

  // Get the node connection and wallet connection.
  const provider = new hre.ethers.providers.AlchemyProvider(
    "goerli",
    process.env.GOERLI_API_KEY
  );

  // Ensure that signer is the SAME address as the original contract deployer,
  // or else this script will fail with an error.
  const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Instantiate connected contract.
  const buyMeACoffee = new hre.ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  const updateTxn = await buyMeACoffee.setOwner(newOwnerAddress);
  await updateTxn.wait();
  console.log("Owner updated to:", newOwnerAddress);

  // Check ending balance.
  console.log(
    "current balance of owner: ",
    await getBalance(provider, newOwnerAddress),
    "ETH"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
