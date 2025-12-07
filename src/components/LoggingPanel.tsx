import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Terminal, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface LoggingPanelProps {
  logs: LogEntry[];
}

export function LoggingPanel({ logs }: LoggingPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [visibleLogs, setVisibleLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  // Typing effect for new logs
  useEffect(() => {
    setVisibleLogs(logs);
  }, [logs]);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  const getTypeColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return 'text-mint';
      case 'warning': return 'text-lemon';
      case 'error': return 'text-blush';
      default: return 'text-console-accent';
    }
  };

  const getTypePrefix = (type: LogEntry['type']) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✗';
      default: return '›';
    }
  };

  return (
    <Card variant="glass" className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-console-bg">
              <Terminal className="w-4 h-4 text-console-accent" />
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Event Log
              </CardTitle>
              <CardDescription className="text-xs">The truth behind the magic </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0 rounded-xl"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent>
          <div
            ref={scrollRef}
            className={cn(
              "relative h-64 rounded-2xl overflow-hidden",
              "bg-console-bg p-4 overflow-y-auto",
              "terminal-text text-xs",
              "animate-terminal-flicker scanlines"
            )}
          >
            {visibleLogs.length === 0 ? (
              <p className="text-console-text/50 animate-glow-pulse">
                {'>'} Waiting for events...
                <span className="inline-block w-2 h-4 ml-1 bg-console-accent animate-typing-cursor" />
              </p>
            ) : (
              <div className="space-y-2">
                {visibleLogs.map((log, index) => (
                  <div 
                    key={log.id} 
                    className={cn(
                      "flex gap-2 animate-fade-up",
                      log.type === 'success' && "terminal-glow"
                    )}
                    style={{ animationDelay: `${index * 0.02}s` }}
                  >
                    <span className="text-console-text/40 flex-shrink-0">
                      [{formatTime(log.timestamp)}]
                    </span>
                    <span className={cn("flex-shrink-0 font-bold", getTypeColor(log.type))}>
                      {getTypePrefix(log.type)}
                    </span>
                    <span className={cn(
                      "text-console-text",
                      log.type === 'success' && "text-mint",
                      log.type === 'error' && "text-blush"
                    )}>
                      {log.message}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-console-accent">{'>'}</span>
                  <span className="w-2 h-4 bg-console-accent animate-typing-cursor" />
                </div>
              </div>
            )}
            
            {/* Glow effect at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-console-bg to-transparent pointer-events-none" />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
