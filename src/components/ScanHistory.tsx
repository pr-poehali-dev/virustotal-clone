import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface ScanHistoryProps {
  history: Array<{
    id: string;
    type: 'file' | 'url';
    name: string;
    status: 'scanning' | 'clean' | 'malicious' | 'suspicious';
    detections: number;
    totalEngines: number;
    timestamp: Date;
  }>;
  onSelectScan: (scan: any) => void;
}

export default function ScanHistory({ history, onSelectScan }: ScanHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = history.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      default: return 'Loader2';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">История сканирований</h2>
          <p className="text-muted-foreground">
            Всего проверок: {history.length}
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Поиск по файлам и URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {filteredHistory.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Icon name="Inbox" className="text-muted-foreground" size={32} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'Ничего не найдено' : 'История пуста'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Попробуйте изменить запрос' : 'Начните сканирование файлов или URL'}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <ScrollArea className="h-[600px]">
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <Card
                key={item.id}
                className="p-4 hover:bg-muted/50 cursor-pointer transition-all hover:shadow-md"
                onClick={() => onSelectScan(item)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon
                      name={item.type === 'file' ? 'File' : 'Link'}
                      className="text-primary"
                      size={24}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold truncate">{item.name}</h4>
                      <Badge variant="outline" className={`${getStatusColor(item.status)} flex-shrink-0`}>
                        <Icon name={getStatusIcon(item.status)} className="mr-1" size={12} />
                        {item.status === 'clean' ? 'Безопасно' : item.status === 'malicious' ? 'Угроза' : 'Подозрительно'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        {new Date(item.timestamp).toLocaleString('ru-RU')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="Shield" size={14} />
                        {item.detections}/{item.totalEngines} обнаружений
                      </div>
                    </div>
                  </div>

                  <Icon name="ChevronRight" className="text-muted-foreground flex-shrink-0" size={20} />
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
