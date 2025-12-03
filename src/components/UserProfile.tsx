import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface UserProfileProps {
  scanCount: number;
}

export default function UserProfile({ scanCount }: UserProfileProps) {
  const stats = {
    totalScans: scanCount,
    cleanFiles: Math.floor(scanCount * 0.85),
    threatsDetected: Math.floor(scanCount * 0.15),
    urlScans: Math.floor(scanCount * 0.4),
    fileScans: Math.floor(scanCount * 0.6),
  };

  const achievements = [
    { icon: 'Shield', title: 'Первое сканирование', description: 'Проверили первый файл', unlocked: scanCount > 0 },
    { icon: 'Target', title: 'Активный пользователь', description: '10+ сканирований', unlocked: scanCount >= 10 },
    { icon: 'Award', title: 'Эксперт безопасности', description: '50+ сканирований', unlocked: scanCount >= 50 },
    { icon: 'Crown', title: 'Мастер анализа', description: '100+ сканирований', unlocked: scanCount >= 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Профиль</h2>
        <p className="text-muted-foreground">Ваша статистика и достижения</p>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              <Icon name="User" size={32} />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-2xl font-bold">Security User</h3>
            <p className="text-muted-foreground">Активен с {new Date().toLocaleDateString('ru-RU')}</p>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Activity" className="text-primary" size={24} />
            </div>
            <p className="text-2xl font-bold">{stats.totalScans}</p>
            <p className="text-xs text-muted-foreground">Всего проверок</p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-success/10 flex items-center justify-center">
              <Icon name="CheckCircle2" className="text-success" size={24} />
            </div>
            <p className="text-2xl font-bold">{stats.cleanFiles}</p>
            <p className="text-xs text-muted-foreground">Безопасных</p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-destructive/10 flex items-center justify-center">
              <Icon name="AlertTriangle" className="text-destructive" size={24} />
            </div>
            <p className="text-2xl font-bold">{stats.threatsDetected}</p>
            <p className="text-xs text-muted-foreground">Угроз найдено</p>
          </div>

          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-secondary/10 flex items-center justify-center">
              <Icon name="Globe" className="text-secondary" size={24} />
            </div>
            <p className="text-2xl font-bold">{stats.urlScans}</p>
            <p className="text-xs text-muted-foreground">URL проверок</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Icon name="Trophy" size={24} className="text-primary" />
          Достижения
        </h3>
        <div className="space-y-4">
          {achievements.map((achievement, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                achievement.unlocked
                  ? 'bg-primary/10 border border-primary/20'
                  : 'bg-muted/30 opacity-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                achievement.unlocked ? 'bg-primary' : 'bg-muted'
              }`}>
                <Icon
                  name={achievement.icon as any}
                  className={achievement.unlocked ? 'text-primary-foreground' : 'text-muted-foreground'}
                  size={24}
                />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{achievement.title}</h4>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </div>
              {achievement.unlocked && (
                <Icon name="CheckCircle2" className="text-success" size={24} />
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={24} />
          Прогресс до следующего уровня
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">До следующего достижения</span>
            <span className="font-semibold">{scanCount}/10</span>
          </div>
          <Progress value={(scanCount / 10) * 100} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Осталось {Math.max(0, 10 - scanCount)} сканирований до разблокировки "Активный пользователь"
          </p>
        </div>
      </Card>
    </div>
  );
}
