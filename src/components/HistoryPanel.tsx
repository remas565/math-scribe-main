import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Trash2, Copy, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryItem {
  id: string;
  latex: string;
  timestamp: Date;
  thumbnail?: string;
}

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onCopy: (latex: string) => void;
}

export function HistoryPanel({ history, onSelect, onDelete, onCopy }: HistoryPanelProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <Card variant="elevated" className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-blush to-lavender">
            <Wand2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-gradient">🔮 History</CardTitle>
            <CardDescription>History of your math spells</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="h-28 rounded-2xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No spells cast yet </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
            {history.map((item, index) => (
              <div
                key={item.id}
                onClick={() => onSelect(item)}
                className={cn(
                  "group flex items-center gap-3 p-3 rounded-2xl cursor-pointer",
                  "bg-gradient-to-r from-card to-secondary/50 hover:from-accent/50 hover:to-lavender/20",
                  "transition-all duration-300 hover:-translate-y-1 hover:shadow-soft",
                  "border border-transparent hover:border-lavender/30"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {item.thumbnail && (
                  <div className="w-12 h-12 rounded-xl bg-background overflow-hidden flex-shrink-0 shadow-soft">
                    <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-mono truncate text-foreground">{item.latex}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(item.timestamp)}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl hover:bg-mint/20 hover:text-mint"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCopy(item.latex);
                    }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl hover:bg-destructive/20 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
