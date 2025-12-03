import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileScanner from '@/components/FileScanner';
import URLScanner from '@/components/URLScanner';
import ScanResults from '@/components/ScanResults';
import ScanHistory from '@/components/ScanHistory';
import UserProfile from '@/components/UserProfile';
import Icon from '@/components/ui/icon';

interface ScanResult {
  id: string;
  type: 'file' | 'url';
  name: string;
  status: 'scanning' | 'clean' | 'malicious' | 'suspicious';
  detections: number;
  totalEngines: number;
  timestamp: Date;
  hash?: string;
  fileSize?: string;
  url?: string;
  engines: Array<{
    name: string;
    status: 'clean' | 'malicious' | 'suspicious';
    details?: string;
  }>;
}

export default function Index() {
  const [activeTab, setActiveTab] = useState('scan');
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [darkMode] = useState(true);

  const handleScanComplete = (result: ScanResult) => {
    setCurrentScan(result);
    setScanHistory(prev => [result, ...prev]);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Shield" className="text-primary-foreground" size={24} />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse-ring"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold">VirusGuard</h1>
                <p className="text-xs text-muted-foreground">Multi-Engine Security Scanner</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setActiveTab('scan')}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  activeTab === 'scan' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="Search" size={18} />
                Сканирование
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  activeTab === 'history' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="History" size={18} />
                История
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name="User" size={18} />
                Профиль
              </button>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {activeTab === 'scan' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Анализ файлов и URL</h2>
                <p className="text-muted-foreground">
                  Проверка через {Math.floor(Math.random() * 10) + 65} антивирусных движков
                </p>
              </div>

              <Tabs defaultValue="file" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="file" className="flex items-center gap-2">
                    <Icon name="FileUp" size={18} />
                    Файл
                  </TabsTrigger>
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <Icon name="Link" size={18} />
                    URL
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="file">
                  <FileScanner onScanComplete={handleScanComplete} />
                </TabsContent>

                <TabsContent value="url">
                  <URLScanner onScanComplete={handleScanComplete} />
                </TabsContent>
              </Tabs>

              {currentScan && (
                <div className="mt-8 animate-scale-in">
                  <ScanResults result={currentScan} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-fade-in">
              <ScanHistory history={scanHistory} onSelectScan={setCurrentScan} />
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="animate-fade-in">
              <UserProfile scanCount={scanHistory.length} />
            </div>
          )}
        </main>

        <footer className="border-t border-border mt-16 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon name="Info" size={18} />
                  О сервисе
                </h3>
                <p className="text-sm text-muted-foreground">
                  Комплексный анализ безопасности файлов и URL с использованием множества антивирусных движков
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon name="BookOpen" size={18} />
                  Документация
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>API Reference</li>
                  <li>Integration Guide</li>
                  <li>FAQ</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Icon name="BarChart3" size={18} />
                  Статистика
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex justify-between">
                    <span>Активных движков:</span>
                    <span className="text-foreground font-medium">72</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Проверок сегодня:</span>
                    <span className="text-foreground font-medium">1,245,892</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              © 2024 VirusGuard. Powered by AI Security Technology
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}