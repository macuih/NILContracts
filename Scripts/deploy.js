// scripts/deploy.js

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Deploy the contract
  const ContractFactory = await hre.ethers.getContractFactory("NILTransparencyContract");
  const contract = await ContractFactory.deploy();
  await contract.deployed();

  console.log("✅ Contract deployed to:", contract.address);

  // Save the address and ABI to frontend
  saveFrontendFiles(contract, "NILTransparencyContract");
}

function saveFrontendFiles(contract, name) {
  const contractsDir = path.join(__dirname, "..", "src", "artifacts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract address
  fs.writeFileSync(
    path.join(contractsDir, `${name}-address.json`),
    JSON.stringify({ address: contract.address }, undefined, 2)
  );

  // Save ABI
  const artifact = hre.artifacts.readArtifactSync(name);
  fs.writeFileSync(
    path.join(contractsDir, `${name}.json`),
    JSON.stringify(artifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
