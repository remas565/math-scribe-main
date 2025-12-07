import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Code2, Eye, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Confetti } from './Sparkles';

interface LatencyInfo {
  uploadTime: number;
  processingTime: number;
  totalTime: number;
}

interface ResultPanelProps {
  latex: string;
  isProcessing: boolean;
  latency?: LatencyInfo | null;
}

export function ResultPanel({ latex, isProcessing, latency }: ResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [displayedLatex, setDisplayedLatex] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const prevLatexRef = useRef('');

  // Typing animation effect
  useEffect(() => {
    if (latex && latex !== prevLatexRef.current) {
      setDisplayedLatex('');
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 100);
      
      let index = 0;
      const timer = setInterval(() => {
        if (index < latex.length) {
          setDisplayedLatex(latex.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
        }
      }, 20);
      
      prevLatexRef.current = latex;
      return () => clearInterval(timer);
    } else if (!latex) {
      setDisplayedLatex('');
      prevLatexRef.current = '';
    }
  }, [latex]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderLatexPreview = (tex: string) => {
    return tex
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\sum/g, 'Σ')
      .replace(/\\int/g, '∫')
      .replace(/\\alpha/g, 'α')
      .replace(/\\beta/g, 'β')
      .replace(/\\pi/g, 'π')
      .replace(/\\theta/g, 'θ')
      .replace(/\^(\{[^}]+\}|\w)/g, (_, p1) => `^${p1.replace(/[{}]/g, '')}`)
      .replace(/_(\{[^}]+\}|\w)/g, (_, p1) => `_${p1.replace(/[{}]/g, '')}`)
      .replace(/\\\\/g, '\n')
      .replace(/\\[a-z]+/gi, '');
  };

  return (
    <Card variant="elevated" className="animate-fade-up relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
      <Confetti trigger={showConfetti} />
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-mint to-soft-blue">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-gradient"> LaTeX Result</CardTitle>
              <CardDescription>Your LaTeX is ready to shine!</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                "rounded-xl transition-all duration-300",
                showPreview && "bg-accent text-accent-foreground"
              )}
            >
              <Eye className="w-4 h-4 mr-1.5" />
              Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!latex}
              className="rounded-xl"
            >
              {copied ? (
                <Check className="w-4 h-4 mr-1.5 text-mint" />
              ) : (
                <Copy className="w-4 h-4 mr-1.5" />
              )}
              {copied ? ' Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isProcessing ? (
          <div className="h-36 rounded-2xl bg-gradient-to-br from-lavender/10 to-soft-blue/10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-3 border-lavender/30" />
                <div className="absolute inset-0 rounded-full border-3 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-primary animate-pulse" />
              </div>
              <p className="text-sm font-medium text-muted-foreground animate-pulse-soft">
                 Converting magic dust into LaTeX…
              </p>
            </div>
          </div>
        ) : latex ? (
          <div className="space-y-4">
            <div className="relative glass-card p-4 overflow-hidden">
              <pre className="overflow-x-auto text-sm font-mono text-foreground">
                <code>{displayedLatex}</code>
                {displayedLatex.length < latex.length && (
                  <span className="inline-block w-2 h-5 ml-0.5 bg-primary animate-typing-cursor" />
                )}
              </pre>
            </div>
            
            {showPreview && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-lemon/20 to-mint/20 border border-mint/30 animate-scale-in">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Math Preview
                </p>
                <p className="text-xl font-medium text-foreground">
                  {renderLatexPreview(latex)}
                </p>
              </div>
            )}
            
            {latency && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-lavender/10 to-blush/10 border border-lavender/20 animate-fade-up">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-lavender" />
                  <span className="text-xs font-semibold text-muted-foreground"> OCR Complete</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-2 rounded-xl bg-card/50">
                    <p className="text-xs text-muted-foreground mb-1">Upload</p>
                    <p className="font-mono font-bold text-soft-blue">{latency.uploadTime}ms</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-card/50">
                    <p className="text-xs text-muted-foreground mb-1">Processing</p>
                    <p className="font-mono font-bold text-mint">{latency.processingTime}ms</p>
                  </div>
                  <div className="text-center p-2 rounded-xl bg-card/50">
                    <p className="text-xs text-muted-foreground mb-1">Total</p>
                    <p className="font-mono font-bold text-primary">{latency.totalTime}ms</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-36 rounded-2xl bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
               Upload your printed math masterpiece to see results
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
