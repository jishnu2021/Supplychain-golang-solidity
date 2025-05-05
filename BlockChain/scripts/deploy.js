// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  console.log("Starting deployment of SupplyChain contract...");

  // Get the contract factory
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  
  // Deploy the contract
  const supplyChain = await SupplyChain.deploy();
  await supplyChain.deploymentTransaction().wait();

  // Get the contract address
  console.log(`SupplyChain deployed to: ${supplyChain.target}`);

  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log(`Deployed by: ${deployer.address}`);

  // Log role information
  console.log(`Deployer has been assigned the MANAGER_ROLE automatically`);
  
  // Optional: Verify contract if on a supported network
  console.log("To verify this contract on Etherscan, run:");
  console.log(`npx hardhat verify --network <network> ${supplyChain.target}`);

  return supplyChain;
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });