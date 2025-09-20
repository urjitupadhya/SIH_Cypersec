// lib/CyberReportService.ts
import { ethers } from 'ethers';
import registry from '@/lib/abi/CyberReportRegistry.json';
import addresses from '@/lib/contract-address.json';

// Allow TypeScript to recognize injected EIP-1193 providers like MetaMask on window
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Use compiled ABI produced by Hardhat deploy script
const CYBER_REPORT_ABI = (registry as any).abi;

export interface CyberReport {
  id: number;
  reporter: string;
  reportHash: string;
  category: string;
  severity: string;
  targetType: string;
  timestamp: number;
  verified: boolean;
}

export default class CyberReportService {
  private provider: ethers.Provider | null = null;
  private contract: any | null = null;
  public signer: ethers.Signer | null = null;
  private contractAddress: string;

  constructor(network: string = 'localhost') {
    // Default contract address - should be updated after deployment
    const addrFromFile = (addresses as any)?.CyberReportRegistry;
    this.contractAddress = addrFromFile || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    this.initProvider(network);
  }

  private initProvider(network: string) {
    try {
      if (network === 'localhost') {
        this.provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      } else {
        // For other networks, you would configure different RPC endpoints
        this.provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      }
      
      if (this.provider) {
        this.contract = new ethers.Contract(this.contractAddress, CYBER_REPORT_ABI, this.provider);
      }
    } catch (error) {
      console.error('Failed to initialize provider:', error);
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      if (!this.provider) return false;
      await this.provider.getNetwork();
      return true;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  async connectWallet(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && 'ethereum' in window && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        await provider.send("eth_requestAccounts", []);
        this.signer = await provider.getSigner();
        
        if (this.signer && this.contract) {
          this.contract = (this.contract as ethers.Contract).connect(this.signer);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      return false;
    }
  }

  async submitReport(
    reportHash: string,
    category: string,
    severity: string,
    targetType: string
  ): Promise<ethers.TransactionResponse | null> {
    try {
      if (!this.contract || !this.signer) {
        throw new Error('Contract not initialized or wallet not connected');
      }

      const tx = await this.contract.submitReport(reportHash, category, severity, targetType);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Failed to submit report:', error);
      throw error;
    }
  }

  async getAllReports(): Promise<CyberReport[]> {
    try {
      if (!this.contract) {
        console.warn('Contract not initialized, returning mock data');
        return this.getMockReports();
      }

      const reports = await this.contract.getAllReports();
      return this.formatReports(reports);
    } catch (error) {
      console.error('Failed to get all reports:', error);
      // Return mock data if contract call fails
      return this.getMockReports();
    }
  }

  async getRecentReports(count: number = 10): Promise<CyberReport[]> {
    try {
      if (!this.contract) {
        console.warn('Contract not initialized, returning mock data');
        return this.getMockReports().slice(0, count);
      }

      const reports = await this.contract.getRecentReports(count);
      return this.formatReports(reports);
    } catch (error) {
      console.error('Failed to get recent reports:', error);
      // Return mock data if contract call fails
      return this.getMockReports().slice(0, count);
    }
  }

  async getValidCategories(): Promise<string[]> {
    try {
      if (!this.contract) {
        return ['phishing', 'malware', 'social_engineering', 'data_breach', 'ransomware'];
      }

      return await this.contract.getValidCategories();
    } catch (error) {
      console.error('Failed to get valid categories:', error);
      return ['phishing', 'malware', 'social_engineering', 'data_breach', 'ransomware'];
    }
  }

  async verifyReport(reportId: number): Promise<ethers.TransactionResponse | null> {
    try {
      if (!this.contract || !this.signer) {
        throw new Error('Contract not initialized or wallet not connected');
      }
      const tx = await this.contract.verifyReport(reportId);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Failed to verify report:', error);
      throw error;
    }
  }

  private formatReports(rawReports: any[]): CyberReport[] {
    return rawReports.map((report, index) => ({
      id: Number(report.id || index),
      reporter: report.reporter || '0x0000000000000000000000000000000000000000',
      reportHash: report.reportHash || '',
      category: report.category || '',
      severity: report.severity || '',
      targetType: report.targetType || '',
      timestamp: Number(report.timestamp || Date.now() / 1000),
      verified: Boolean(report.verified || false)
    }));
  }

  private getMockReports(): CyberReport[] {
    return [
      {
        id: 1,
        reporter: '0x1234567890123456789012345678901234567890',
        reportHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        category: 'phishing',
        severity: 'high',
        targetType: 'email',
        timestamp: Math.floor(Date.now() / 1000) - 3600,
        verified: true
      },
      {
        id: 2,
        reporter: '0x0987654321098765432109876543210987654321',
        reportHash: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
        category: 'malware',
        severity: 'critical',
        targetType: 'website',
        timestamp: Math.floor(Date.now() / 1000) - 7200,
        verified: false
      },
      {
        id: 3,
        reporter: '0x1111111111111111111111111111111111111111',
        reportHash: 'QmZTR5bcpQD7cFgTorqxZDYaew1Wqgfbd2ud9QqGPAkK2V',
        category: 'social_engineering',
        severity: 'medium',
        targetType: 'phone',
        timestamp: Math.floor(Date.now() / 1000) - 10800,
        verified: true
      }
    ];
  }
}
