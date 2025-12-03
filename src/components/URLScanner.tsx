import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface URLScannerProps {
  onScanComplete: (result: any) => void;
}

export default function URLScanner({ onScanComplete }: URLScannerProps) {
  const [url, setUrl] = useState('');
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);

  const simulateScan = async (targetUrl: string) => {
    setScanning(true);
    setProgress(0);

    const totalEngines = 72;
    const detections = Math.floor(Math.random() * 8);
    
    for (let i = 0; i <= 100; i += 3) {
      await new Promise(resolve => setTimeout(resolve, 40));
      setProgress(i);
    }

    const engines = Array.from({ length: totalEngines }, (_, i) => {
      const engineNames = [
        'Google Safe Browsing', 'Yandex Safe', 'Kaspersky URL Advisor', 'PhishTank',
        'Norton Safe Web', 'McAfee WebAdvisor', 'Fortinet', 'Sophos',
        'Bitdefender TrafficLight', 'ESET', 'Trend Micro', 'Dr.Web'
      ];
      
      const name = engineNames[i % engineNames.length] + (i >= engineNames.length ? ` ${Math.floor(i / engineNames.length) + 1}` : '');
      const isDetected = i < detections;
      
      return {
        name,
        status: isDetected ? 'malicious' : 'clean',
        details: isDetected ? 'Phishing/Malware detected' : undefined
      };
    });

    const result = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'url' as const,
      name: targetUrl,
      status: detections > 5 ? 'malicious' : detections > 0 ? 'suspicious' : 'clean' as const,
      detections,
      totalEngines,
      timestamp: new Date(),
      url: targetUrl,
      engines
    };

    setTimeout(() => {
      setScanning(false);
      setUrl('');
      onScanComplete(result);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      simulateScan(url);
    }
  };

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center">
              <Icon name="Globe" className="text-secondary" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Проверка URL на безопасность</h3>
              <p className="text-sm text-muted-foreground">
                Введите адрес сайта для анализа угроз
              </p>
            </div>
          </div>

          {!scanning ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1"
                  disabled={scanning}
                />
                <Button type="submit" disabled={!url.trim() || scanning}>
                  <Icon name="Search" className="mr-2" size={18} />
                  Проверить
                </Button>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Info" size={14} />
                <span>Поддерживается проверка HTTP, HTTPS и IP-адресов</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center animate-pulse">
                <Icon name="ShieldCheck" className="text-secondary animate-scan" size={32} />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Анализ URL...</h3>
                <p className="text-sm text-muted-foreground mb-4 break-all font-mono">{url}</p>
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Проверка безопасности: {Math.floor(progress * 0.72)}/72 движков
                </p>
              </div>
            </div>
          )}
        </div>
      </form>
    </Card>
  );
}
