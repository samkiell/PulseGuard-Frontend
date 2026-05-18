import { Activity, FileText, History, Shield } from 'lucide-react';

interface NavigationRailProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export function NavigationRail({ activeModule, onModuleChange }: NavigationRailProps) {
  const modules = [
    { id: 'ingest', icon: Activity, label: 'Live Ingest' },
    { id: 'policy', icon: FileText, label: 'Policy Editor' },
    { id: 'history', icon: History, label: 'History Vault' },
  ];

  return (
    <div className="w-16 h-full bg-[#0B0E14] border-r border-[#30363D] flex flex-col items-center py-6 gap-6">
      <div className="flex flex-col items-center gap-1 mb-8">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#00D1FF] to-[#2EB872] flex items-center justify-center">
          <Shield className="w-5 h-5 text-[#0B0E14]" />
        </div>
        <div className="text-[8px] text-[#9CA3AF] font-mono tracking-wider">SENTINEL</div>
      </div>

      {modules.map((module) => (
        <button
          key={module.id}
          onClick={() => onModuleChange(module.id)}
          className={`group relative w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
            activeModule === module.id
              ? 'bg-[#161B22] border border-[#00D1FF] shadow-[0_0_12px_rgba(0,209,255,0.3)]'
              : 'bg-transparent border border-transparent hover:bg-[#161B22] hover:border-[#30363D]'
          }`}
        >
          <module.icon
            className={`w-5 h-5 ${
              activeModule === module.id ? 'text-[#00D1FF]' : 'text-[#9CA3AF] group-hover:text-[#E5E7EB]'
            }`}
          />
          <div className="absolute left-16 px-3 py-1.5 bg-[#161B22] border border-[#30363D] rounded text-xs text-[#E5E7EB] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity font-mono">
            {module.label}
          </div>
        </button>
      ))}

      <div className="mt-auto flex flex-col items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#2EB872] animate-pulse shadow-[0_0_8px_rgba(46,184,114,0.6)]" />
        <div className="text-[7px] text-[#9CA3AF] font-mono text-center leading-tight">
          VEEA<br />ONLINE
        </div>
      </div>
    </div>
  );
}
