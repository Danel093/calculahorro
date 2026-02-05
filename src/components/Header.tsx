import { Wallet, PiggyBank } from 'lucide-react';

export function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-secondary py-12 px-6 text-primary-foreground">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <PiggyBank className="w-8 h-8" />
          </div>
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Wallet className="w-8 h-8" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
          Mi Calculadora de Ahorro Personal
        </h1>
        
        <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
          Toma control de tus finanzas y alcanza tus metas
        </p>
      </div>
    </header>
  );
}
