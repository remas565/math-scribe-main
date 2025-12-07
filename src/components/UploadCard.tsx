import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Sparkles as SparklesIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FloatingSymbols } from './FloatingSymbols';
import { Sparkles } from './Sparkles';

interface UploadCardProps {
  onImageUpload: (file: File) => void;
  uploadedImage: string | null;
  onClear: () => void;
}

export function UploadCard({ onImageUpload, uploadedImage, onClear }: UploadCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 100);
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 100);
      onImageUpload(file);
    }
  }, [onImageUpload]);

  return (
    <Card variant="elevated" className="animate-fade-up overflow-visible">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-lavender to-soft-blue">
            <SparklesIcon className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-gradient"> Upload Image</CardTitle>
            <CardDescription>Let the magic begin — upload your math!</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!uploadedImage ? (
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "relative flex flex-col items-center justify-center w-full h-56 rounded-2xl cursor-pointer",
              "border-2 border-dashed transition-all duration-500",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.02] animate-pulse-border"
                : "border-lavender/50 hover:border-primary/60 hover:bg-accent/20"
            )}
          >
            <FloatingSymbols active={isDragging} />
            <Sparkles trigger={showSparkles} />
            
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className={cn(
              "flex flex-col items-center gap-4 transition-all duration-500 z-10",
              isDragging && "scale-110"
            )}>
              <div className={cn(
                "p-5 rounded-2xl transition-all duration-500",
                isDragging 
                  ? "bg-gradient-to-br from-lavender/30 to-soft-blue/30 shadow-glow" 
                  : "bg-gradient-to-br from-lavender/20 to-mint/20"
              )}>
                <Upload className={cn(
                  "w-10 h-10 transition-all duration-500",
                  isDragging ? "text-primary animate-bounce" : "text-muted-foreground"
                )} />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground text-lg">
                  {isDragging ? " Drop it like it's hot!" : "Drop your printed equation here "}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            </div>
          </label>
        ) : (
          <div className="relative group">
            <Sparkles trigger={showSparkles} count={20} />
            <div className="relative rounded-2xl overflow-hidden bg-secondary shadow-card">
              <img
                src={uploadedImage}
                alt="Uploaded math"
                className="w-full h-56 object-contain animate-scale-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <Button
              variant="icon"
              size="icon"
              onClick={onClear}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-card/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
