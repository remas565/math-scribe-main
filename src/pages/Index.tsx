import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { UploadCard } from '@/components/UploadCard';
import { ResultPanel } from '@/components/ResultPanel';
import { HistoryPanel } from '@/components/HistoryPanel';
import { LoggingPanel } from '@/components/LoggingPanel';
import { toast } from '@/hooks/use-toast';

interface HistoryItem {
  id: string;
  latex: string;
  timestamp: Date;
  thumbnail?: string;
}

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface LatencyInfo {
  uploadTime: number;
  processingTime: number;
  totalTime: number;
}

const API_URL = 'https://web-production-8f04.up.railway.app';


const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [latex, setLatex] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [latency, setLatency] = useState<LatencyInfo | null>(null);

  const addLog = useCallback((type: LogEntry['type'], message: string) => {
    const entry = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type,
      message,
    };
    setLogs(prev => [...prev, entry]);
    return entry;
  }, []);

  const sendEvent = useCallback(async (eventType: string, data?: Record<string, unknown>) => {
    try {
      await fetch(`${API_URL}/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventType, timestamp: new Date().toISOString(), ...data }),
      });
    } catch (err) {
      console.warn('Failed to send event:', eventType);
    }
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    const uploadStart = performance.now();
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      const uploadEnd = performance.now();
      const uploadTime = Math.round(uploadEnd - uploadStart);
      
      setUploadedImage(imageUrl);
      setUploadedFile(file);
      addLog('info', `Image uploaded: ${file.name} (${uploadTime}ms)`);
      sendEvent('image_uploaded', { filename: file.name, uploadTime });

      // Start OCR processing
      setIsProcessing(true);
      setLatency(null);
      addLog('info', 'Submitting to OCR backend...');
      sendEvent('submitted_for_ocr');
      
      const processingStart = performance.now();
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_URL}/predict`, {
          method: 'POST',
          body: formData,
        });
        
        const processingEnd = performance.now();
        const processingTime = Math.round(processingEnd - processingStart);
        const totalTime = uploadTime + processingTime;
        
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();
        const result = data.latex || '';
        
        setLatex(result);
        setLatency({ uploadTime, processingTime, totalTime });
        setIsProcessing(false);
        addLog('success', `LaTeX extraction complete (${processingTime}ms)`);
        sendEvent('ocr_success', { processingTime, totalTime });
        
        // Add to history
        const historyItem = {
          id: crypto.randomUUID(),
          latex: result,
          timestamp: new Date(),
          thumbnail: imageUrl,
        };
        setHistory(prev => [historyItem, ...prev].slice(0, 10));
        sendEvent('history_entry_saved', { id: historyItem.id });
        
        toast({
          title: "Conversion Complete",
          description: "LaTeX has been extracted successfully.",
        });
      } catch (error) {
        const processingEnd = performance.now();
        const processingTime = Math.round(processingEnd - processingStart);
        
        setIsProcessing(false);
        addLog('error', `OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        sendEvent('ocr_failure', { error: String(error), processingTime });
        
        toast({
          title: "OCR Failed",
          description: "Could not connect to backend. Make sure FastAPI is running on localhost:8000",
          variant: "destructive",
        });
      }
    };
    reader.readAsDataURL(file);
  }, [addLog, sendEvent]);

  const handleClear = useCallback(() => {
    setUploadedImage(null);
    setUploadedFile(null);
    setLatex('');
    setLatency(null);
    addLog('info', 'Cleared current image');
  }, [addLog]);

  const handleHistorySelect = useCallback((item: HistoryItem) => {
    setLatex(item.latex);
    if (item.thumbnail) {
      setUploadedImage(item.thumbnail);
    }
    setLatency(null);
    addLog('info', 'Loaded from history');
  }, [addLog]);

  const handleHistoryDelete = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    addLog('info', 'Removed from history');
  }, [addLog]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "LaTeX copied to clipboard.",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container px-4 md:px-6 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tools - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <UploadCard
              onImageUpload={handleImageUpload}
              uploadedImage={uploadedImage}
              onClear={handleClear}
            />
            
            <ResultPanel
              latex={latex}
              isProcessing={isProcessing}
              latency={latency}
            />
            
            <HistoryPanel
              history={history}
              onSelect={handleHistorySelect}
              onDelete={handleHistoryDelete}
              onCopy={handleCopy}
            />
          </div>
          
          {/* Logs Sidebar - Right Column */}
          <div className="space-y-6">
            <LoggingPanel logs={logs} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
