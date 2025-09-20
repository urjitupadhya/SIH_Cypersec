const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting CyberReportRegistry deployment...\n");

  // Get the signers
  const [deployer] = await ethers.getSigners();
  
  console.log("📋 Deployment Details:");
  console.log("Network:", hre.network.name);
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy the contract
  console.log("🏗️  Deploying CyberReportRegistry...");
  
  const CyberReportRegistry = await ethers.getContractFactory("CyberReportRegistry");
  const cyberReportRegistry = await CyberReportRegistry.deploy(deployer.address);
  
  await cyberReportRegistry.waitForDeployment();
  const contractAddress = await cyberReportRegistry.getAddress();
  
  console.log("✅ CyberReportRegistry deployed to:", contractAddress);
  console.log("🔗 Transaction hash:", cyberReportRegistry.deploymentTransaction().hash);
  
  // Wait for a few confirmations
  console.log("\n⏳ Waiting for confirmations...");
  await cyberReportRegistry.deploymentTransaction().wait(2);
  
  // Verify initial state
  console.log("\n🔍 Verifying initial state...");
  const totalReports = await cyberReportRegistry.getTotalReports();
  const validCategories = await cyberReportRegistry.getValidCategories();
  
  console.log("Total reports:", totalReports.toString());
  console.log("Valid categories:", validCategories);
  
  // Add some initial reporters (optional)
  if (process.env.ADD_INITIAL_REPORTERS === "true") {
    console.log("\n👥 Adding initial reporters...");
    
    const initialReporters = [
      "0x742d35Cc6634C0532925a3b8D926f21e2e71476f", // Example address
      // Add more addresses as needed
    ];
    
    for (const reporter of initialReporters) {
      try {
        const tx = await cyberReportRegistry.addReporter(reporter);
        await tx.wait();
        console.log("Added reporter:", reporter);
      } catch (error) {
        console.log("Failed to add reporter:", reporter, error.message);
      }
    }
  }
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTx: cyberReportRegistry.deploymentTransaction().hash,
    deploymentTime: new Date().toISOString(),
    validCategories: validCategories,
    abi: CyberReportRegistry.interface.fragments.map(f => f.format("json"))
  };
  
  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n💾 Deployment info saved to:", deploymentFile);
  
  // Display important addresses and next steps
  console.log("\n📋 DEPLOYMENT SUMMARY");
  console.log("==========================================");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);
  console.log("Admin Address:", deployer.address);
  console.log("Block Explorer:", getBlockExplorerUrl(hre.network.name, contractAddress));
  
  console.log("\n🔧 NEXT STEPS:");
  console.log("1. Add reporter addresses using addReporter() function");
  console.log("2. Update your frontend/backend with the contract address");
  console.log("3. Test report submission functionality");
  console.log("4. Verify contract on block explorer if on testnet/mainnet");
  
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 To verify contract on block explorer, run:");
    console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} "${deployer.address}"`);
  }
}

function getBlockExplorerUrl(network, address) {
  const explorers = {
    goerli: `https://goerli.etherscan.io/address/${address}`,
    sepolia: `https://sepolia.etherscan.io/address/${address}`,
    mumbai: `https://mumbai.polygonscan.com/address/${address}`,
    polygon: `https://polygonscan.com/address/${address}`,
    hardhat: "Local network - no explorer",
    localhost: "Local network - no explorer"
  };
  
  return explorers[network] || "Unknown network";
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });