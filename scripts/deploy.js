const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const ContractFactory = await hre.ethers.getContractFactory("NILTransparencyContract");
  const contract = await ContractFactory.deploy(); // ✅ This already waits

  console.log("✅ Contract deployed to:", contract.target || contract.address); // use .target if ethers v6

  saveFrontendFiles(contract, "NILTransparencyContract");
}

function saveFrontendFiles(contract, name) {
  const contractsDir = path.join(__dirname, "..", "src", "artifacts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(contractsDir, `${name}-address.json`),
    JSON.stringify({ address: contract.target || contract.address }, undefined, 2)
  );

  const artifact = hre.artifacts.readArtifactSync(name);
  fs.writeFileSync(
    path.join(contractsDir, `${name}.json`),
    JSON.stringify(artifact, null, 2)
  );
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});
