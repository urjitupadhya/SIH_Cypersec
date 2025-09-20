const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

class CyberReportService {
  constructor(networkName = "localhost") {
    this.networkName = networkName;
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = null;
    
    this.initializeProvider();
    this.loadContract();
  }
  
  initializeProvider() {
    const networkConfigs = {
      localhost: {
        url: "http://127.0.0.1:8545",
        chainId: 31337
      },
      goerli: {
        url: process.env.GOERLI_RPC_URL,
        chainId: 5
      },
      sepolia: {
        url: process.env.SEPOLIA_RPC_URL,
        chainId: 11155111
      },
      mumbai: {
        url: process.env.MUMBAI_RPC_URL,
        chainId: 80001
      },
      polygon: {
        url: process.env.POLYGON_RPC_URL,
        chainId: 137
      }
    };
    
    const config = networkConfigs[this.networkName];
    if (!config) {
      throw new Error(`Unsupported network: ${this.networkName}`);
    }
    
    this.provider = new ethers.JsonRpcProvider(config.url);
    
    // Initialize signer with private key
    if (process.env.PRIVATE_KEY) {
      this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
    } else {
      console.warn("No private key found. Read-only mode enabled.");
    }
  }
  
  loadContract() {
    try {
      // Load deployment info
      const deploymentFile = path.join(__dirname, "deployments", `${this.networkName}.json`);
      const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
      
      this.contractAddress = deploymentInfo.contractAddress;
      
      // Load contract ABI
      const artifactPath = path.join(__dirname, "artifacts", "contracts", "CyberReportRegistry.sol", "CyberReportRegistry.json");
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
      
      // Create contract instance
      this.contract = new ethers.Contract(
        this.contractAddress,
        artifact.abi,
        this.signer || this.provider
      );
      
      console.log(`Contract loaded: ${this.contractAddress} on ${this.networkName}`);
    } catch (error) {
      throw new Error(`Failed to load contract: ${error.message}`);
    }
  }
  
  /**
   * Submit a new cybersecurity report
   * @param {string} reportHash - IPFS hash or content hash
   * @param {string} category - Report category
   * @param {string} severity - Severity level
   * @param {string} targetType - Target type
   * @returns {Object} Transaction result
   */
  async submitReport(reportHash, category, severity, targetType) {
    if (!this.signer) {
      throw new Error("Signer required for write operations");
    }
    
    try {
      console.log("Submitting report...");
      console.log("Hash:", reportHash);
      console.log("Category:", category);
      console.log("Severity:", severity);
      console.log("Target Type:", targetType);
      
      const tx = await this.contract.submitReport(reportHash, category, severity, targetType);
      console.log("Transaction sent:", tx.hash);
      
      const receipt = await tx.wait();
      console.log("Transaction confirmed in block:", receipt.blockNumber);
      
      // Extract event data
      const reportSubmittedEvent = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed.name === "ReportSubmitted";
        } catch {
          return false;
        }
      });
      
      if (reportSubmittedEvent) {
        const parsed = this.contract.interface.parseLog(reportSubmittedEvent);
        return {
          success: true,
          transactionHash: tx.hash,
          reportId: parsed.args.id.toString(),
          blockNumber: receipt.blockNumber,
          gasUsed: receipt.gasUsed.toString(),
          eventData: {
            id: parsed.args.id.toString(),
            reportHash: parsed.args.reportHash,
            category: parsed.args.category,
            reporter: parsed.args.reporter,
            timestamp: parsed.args.timestamp.toString(),
            severity: parsed.args.severity
          }
        };
      }
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      };
      
    } catch (error) {
      console.error("Error submitting report:", error.message);
      throw error;
    }
  }
  
  /**
   * Get a specific report by ID
   * @param {number} reportId - Report ID
   * @returns {Object} Report data
   */
  async getReport(reportId) {
    try {
      const report = await this.contract.getReport(reportId);
      return this.formatReport(report);
    } catch (error) {
      console.error("Error fetching report:", error.message);
      throw error;
    }
  }
  
  /**
   * Get all reports for community alerts
   * @returns {Array} All reports
   */
  async getAllReports() {
    try {
      const reports = await this.contract.getAllReports();
      return reports.map(report => this.formatReport(report));
    } catch (error) {
      console.error("Error fetching all reports:", error.message);
      throw error;
    }
  }
  
  /**
   * Get recent reports
   * @param {number} count - Number of reports to fetch
   * @returns {Array} Recent reports
   */
  async getRecentReports(count = 10) {
    try {
      const reports = await this.contract.getRecentReports(count);
      return reports.map(report => this.formatReport(report));
    } catch (error) {
      console.error("Error fetching recent reports:", error.message);
      throw error;
    }
  }
  
  /**
   * Get reports by category
   * @param {string} category - Category to filter by
   * @returns {Array} Filtered reports
   */
  async getReportsByCategory(category) {
    try {
      const reports = await this.contract.getReportsByCategory(category);
      return reports.map(report => this.formatReport(report));
    } catch (error) {
      console.error("Error fetching reports by category:", error.message);
      throw error;
    }
  }
  
  /**
   * Get category statistics
   * @returns {Object} Category stats
   */
  async getCategoryStats() {
    try {
      const [categories, counts] = await this.contract.getCategoryStats();
      const stats = {};
      
      for (let i = 0; i < categories.length; i++) {
        stats[categories[i]] = counts[i].toString();
      }
      
      return stats;
    } catch (error) {
      console.error("Error fetching category stats:", error.message);
      throw error;
    }
  }
  
  /**
   * Add a reporter (admin only)
   * @param {string} reporterAddress - Address to whitelist
   * @returns {Object} Transaction result
   */
  async addReporter(reporterAddress) {
    if (!this.signer) {
      throw new Error("Signer required for write operations");
    }
    
    try {
      const tx = await this.contract.addReporter(reporterAddress);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error("Error adding reporter:", error.message);
      throw error;
    }
  }
  
  /**
   * Verify a report (admin only)
   * @param {number} reportId - Report ID to verify
   * @returns {Object} Transaction result
   */
  async verifyReport(reportId) {
    if (!this.signer) {
      throw new Error("Signer required for write operations");
    }
    
    try {
      const tx = await this.contract.verifyReport(reportId);
      const receipt = await tx.wait();
      
      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error("Error verifying report:", error.message);
      throw error;
    }
  }
  
  /**
   * Get total number of reports
   * @returns {string} Total count
   */
  async getTotalReports() {
    try {
      const total = await this.contract.getTotalReports();
      return total.toString();
    } catch (error) {
      console.error("Error fetching total reports:", error.message);
      throw error;
    }
  }
  
  /**
   * Get valid categories
   * @returns {Array} Valid categories
   */
  async getValidCategories() {
    try {
      return await this.contract.getValidCategories();
    } catch (error) {
      console.error("Error fetching valid categories:", error.message);
      throw error;
    }
  }
  
  /**
   * F  /**
   * Format report data for consistent output
   * @param {Object} report - Raw report from contract
   * @returns {Object} Formatted report
   */
// In interact.js - Update formatReport method
formatReport(report) {
  return {
    id: report.id.toString(),
    reportHash: report.reportHash,
    category: report.category,
    reporter: report.reporter,
    timestamp: new Date(Number(report.timestamp) * 1000).toISOString(),
    severity: report.severity,
    targetType: report.targetType,
    verified: report.verified ?? false,
    // Add these missing fields
    verificationTimestamp: report.verificationTimestamp ? 
      new Date(Number(report.verificationTimestamp) * 1000).toISOString() : null,
    verifier: report.verifier || null
  };
}
}

module.exports = CyberReportService;
