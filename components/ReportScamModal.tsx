// components/ReportScamModal.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCyberReport } from '@/hooks/useCyberReport';
import { ShieldAlert, Upload, Loader2 } from 'lucide-react';

interface ReportScamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportScamModal({ isOpen, onClose }: ReportScamModalProps) {
  const [formData, setFormData] = useState({
    reportHash: '',
    category: '',
    severity: 'medium',
    targetType: 'email',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitReport, getValidCategories } = useCyberReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await submitReport(formData);
      console.log('Report submitted:', result);
      onClose();
      // Reset form
      setFormData({ reportHash: '', category: '', severity: 'medium', targetType: 'email' });
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] gradient-surface">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <ShieldAlert className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle className="text-2xl font-bold">Report a Scam</DialogTitle>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Report Hash / URL</label>
            <Input
              placeholder="Enter IPFS hash, URL, or email content"
              value={formData.reportHash}
              onChange={(e) => setFormData({ ...formData, reportHash: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select value={formData.category} onValueChange={(value) => 
                setFormData({ ...formData, category: value })
              } required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {['phishing', 'malware', 'social_engineering', 'data_breach', 'ransomware'].map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat.replace('_', ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Severity</label>
              <Select value={formData.severity} onValueChange={(value) => 
                setFormData({ ...formData, severity: value })
              } required>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  {['low', 'medium', 'high', 'critical'].map((sev) => (
                    <SelectItem key={sev} value={sev}>{sev}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Target Type</label>
            <Select value={formData.targetType} onValueChange={(value) => 
              setFormData({ ...formData, targetType: value })
            } required>
              <SelectTrigger>
                <SelectValue placeholder="Select target type" />
              </SelectTrigger>
              <SelectContent>
                {['email', 'website', 'application', 'phone', 'sms'].map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1 gradient-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}