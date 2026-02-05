import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface GastoItemProps {
  nombre: string;
  monto: number;
  onNombreChange: (value: string) => void;
  onMontoChange: (value: number) => void;
  onRemove: () => void;
  placeholderNombre?: string;
}

export function GastoItem({
  nombre,
  monto,
  onNombreChange,
  onMontoChange,
  onRemove,
  placeholderNombre = 'Nombre del gasto',
}: GastoItemProps) {
  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    onMontoChange(value ? parseInt(value, 10) : 0);
  };

  return (
    <div className="flex items-center gap-3 group animate-fade-in">
      <Input
        type="text"
        value={nombre}
        onChange={(e) => onNombreChange(e.target.value)}
        placeholder={placeholderNombre}
        className="flex-1"
      />
      
      <div className="relative w-32 flex-shrink-0">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
          $
        </span>
        <Input
          type="text"
          inputMode="numeric"
          value={monto || ''}
          onChange={handleMontoChange}
          placeholder="0"
          className="pl-7 text-right font-medium"
        />
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
