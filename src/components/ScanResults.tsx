import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface ScanResultsProps {
  result: {
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
  };
}

export default function ScanResults({ result }: ScanResultsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'text-success bg-success/10 border-success/20';
      case 'malicious': return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'suspicious': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'clean': return 'CheckCircle2';
      case 'malicious': return 'XCircle';
      case 'suspicious': return 'AlertTriangle';
      default: return 'HelpCircle';
    }
  };

  const detectionRate = (result.detections / result.totalEngines) * 100;
  const cleanEngines = result.engines.filter(e => e.status === 'clean').length;
  const maliciousEngines = result.engines.filter(e => e.status === 'malicious').length;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className={getStatusColor(result.status)}>
                <Icon name={getStatusIcon(result.status)} className="mr-1" size={14} />
                {result.status === 'clean' ? 'Безопасно' : result.status === 'malicious' ? 'Угроза' : 'Подозрительно'}
              </Badge>
              <Badge variant="outline">
                <Icon name={result.type === 'file' ? 'File' : 'Link'} className="mr-1" size={14} />
                {result.type === 'file' ? 'Файл' : 'URL'}
              </Badge>
            </div>
            <h3 className="text-xl font-semibold mb-1 break-all">{result.name}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(result.timestamp).toLocaleString('ru-RU')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <Icon name="AlertOctagon" className="text-destructive" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{result.detections}</p>
                <p className="text-xs text-muted-foreground">Обнаружений</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Icon name="Shield" className="text-success" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{cleanEngines}</p>
                <p className="text-xs text-muted-foreground">Безопасно</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon name="Database" className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{result.totalEngines}</p>
                <p className="text-xs text-muted-foreground">Всего движков</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Уровень угрозы</span>
            <span className="font-semibold">{detectionRate.toFixed(1)}%</span>
          </div>
          <Progress value={detectionRate} className="h-3" />
        </div>

        {result.hash && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Icon name="Fingerprint" className="text-muted-foreground mt-0.5" size={16} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Hash</p>
                <p className="text-xs font-mono break-all">{result.hash}</p>
              </div>
            </div>
          </div>
        )}

        {result.fileSize && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Icon name="HardDrive" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground">Размер файла:</span>
            <span className="font-medium">{result.fileSize}</span>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Icon name="Activity" size={20} />
            Детали сканирования
          </h3>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span className="text-muted-foreground">{cleanEngines} чисто</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span className="text-muted-foreground">{maliciousEngines} угроз</span>
            </div>
          </div>
        </div>

        <Separator className="mb-4" />

        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {result.engines.map((engine, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-2 h-2 rounded-full ${
                    engine.status === 'clean' ? 'bg-success' : 'bg-destructive'
                  }`}></div>
                  <span className="font-medium">{engine.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {engine.details && (
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                      {engine.details}
                    </span>
                  )}
                  <Icon
                    name={engine.status === 'clean' ? 'CheckCircle2' : 'XCircle'}
                    size={18}
                    className={engine.status === 'clean' ? 'text-success' : 'text-destructive'}
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
