import hre from "hardhat";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  await hre.run("compile");

  const CyberReportRegistry = await hre.ethers.getContractFactory("CyberReportRegistry");
  const contract = await CyberReportRegistry.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("CyberReportRegistry deployed to:", address);

  // Resolve artifact to obtain ABI
  const artifactPath = path.join(
    __dirname,
    "../artifacts/contracts/CyberReportRegistry.sol/CyberReportRegistry.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const abi = artifact.abi;

  // Write ABI and address to Next.js lib directory
  const outDir = path.join(__dirname, "../lib/abi");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, "CyberReportRegistry.json"),
    JSON.stringify({ abi }, null, 2),
    "utf8"
  );

  fs.writeFileSync(
    path.join(__dirname, "../lib/contract-address.json"),
    JSON.stringify({ CyberReportRegistry: address }, null, 2),
    "utf8"
  );

  console.log("ABI and address written to lib/abi and lib/contract-address.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
