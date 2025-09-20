// hooks/useCyberReport.ts
import { useState, useEffect } from 'react';
import CyberReportService from '@/lib/CyberReportService';

export function useCyberReport(network = 'localhost') {
  const [service, setService] = useState<CyberReportService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initService() {
      try {
        setLoading(true);
        const cyberService = new CyberReportService(network);
        await cyberService.checkConnection();
        setService(cyberService);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Connection failed');
      } finally {
        setLoading(false);
      }
    }
    
    initService();
  }, [network]);

  const submitReport = async (reportData: {
    reportHash: string;
    category: string;
    severity: string;
    targetType: string;
  }) => {
    if (!service?.signer) throw new Error('Wallet not connected');
    return service.submitReport(
      reportData.reportHash,
      reportData.category,
      reportData.severity,
      reportData.targetType
    );
  };

  const getRecentReports = async (count = 10) => {
    if (!service) return [];
    return service.getRecentReports(count);
  };

  return {
    service,
    loading,
    error,
    submitReport,
    getRecentReports,
    getAllReports: () => service?.getAllReports() || Promise.resolve([]),
    getValidCategories: () => service?.getValidCategories() || Promise.resolve([]),
  };
}