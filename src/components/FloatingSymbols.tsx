import { cn } from '@/lib/utils';

const mathSymbols = [
  { symbol: '∫', className: 'top-4 left-8 text-lavender' },
  { symbol: 'Σ', className: 'top-8 right-12 text-soft-blue' },
  { symbol: '√', className: 'bottom-8 left-16 text-mint' },
  { symbol: 'π', className: 'bottom-4 right-8 text-blush' },
  { symbol: 'α', className: 'top-1/2 left-4 text-lemon' },
  { symbol: '∞', className: 'top-1/4 right-4 text-lavender' },
];

interface FloatingSymbolsProps {
  active?: boolean;
}

export function FloatingSymbols({ active = false }: FloatingSymbolsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {mathSymbols.map((item, index) => (
        <span
          key={index}
          className={cn(
            'absolute text-2xl font-bold opacity-40 transition-all duration-500',
            active ? 'animate-float opacity-60' : 'animate-float-reverse opacity-30',
            item.className,
            `float-delay-${index + 1}`
          )}
          style={{
            filter: active ? 'drop-shadow(0 0 8px currentColor)' : 'none',
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
