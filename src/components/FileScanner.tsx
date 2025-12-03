import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface FileScannerProps {
  onScanComplete: (result: any) => void;
}

export default function FileScanner({ onScanComplete }: FileScannerProps) {
  const [dragActive, setDragActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const simulateScan = async (file: File) => {
    setScanning(true);
    setFileName(file.name);
    setProgress(0);

    const totalEngines = 72;
    const detections = Math.floor(Math.random() * 5);
    
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setProgress(i);
    }

    const engines = Array.from({ length: totalEngines }, (_, i) => {
      const engineNames = [
        'Kaspersky', 'Avast', 'McAfee', 'Norton', 'Bitdefender', 'ESET', 
        'Malwarebytes', 'Trend Micro', 'Sophos', 'AVG', 'Avira', 'Panda',
        'Windows Defender', 'F-Secure', 'G Data', 'Emsisoft', 'Comodo'
      ];
      
      const name = engineNames[i % engineNames.length] + (i >= engineNames.length ? ` ${Math.floor(i / engineNames.length) + 1}` : '');
      const isDetected = i < detections;
      
      return {
        name,
        status: isDetected ? 'malicious' : 'clean',
        details: isDetected ? 'Trojan.Generic.Detected' : undefined
      };
    });

    const result = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'file' as const,
      name: file.name,
      status: detections > 5 ? 'malicious' : detections > 0 ? 'suspicious' : 'clean' as const,
      detections,
      totalEngines,
      timestamp: new Date(),
      hash: 'SHA256: ' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      fileSize: (file.size / 1024).toFixed(2) + ' KB',
      engines
    };

    setTimeout(() => {
      setScanning(false);
      onScanComplete(result);
    }, 500);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateScan(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      simulateScan(e.target.files[0]);
    }
  };

  return (
    <Card className="p-8">
      <div
        className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-all ${
          dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleChange}
          disabled={scanning}
        />
        
        {!scanning ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Upload" className="text-primary" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Загрузите файл для анализа</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Перетащите файл сюда или выберите с компьютера
              </p>
            </div>
            <Button asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Icon name="FileUp" className="mr-2" size={18} />
                Выбрать файл
              </label>
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Максимальный размер: 650 MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <Icon name="ShieldCheck" className="text-primary animate-scan" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Сканирование...</h3>
              <p className="text-sm text-muted-foreground mb-4 font-mono">{fileName}</p>
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Проверка через антивирусные движки: {Math.floor(progress * 0.72)}/72
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
