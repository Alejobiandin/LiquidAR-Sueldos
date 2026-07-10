/**
 * LiquidAR — Sidebar Navigation
 * Design: Navy blue sidebar with gold accents
 */

import type { Seccion } from "@/pages/Home";

interface SidebarProps {
  seccionActiva: Seccion;
  onCambiarSeccion: (seccion: Seccion) => void;
  open?: boolean;
  onClose?: () => void;
}

const navItems: { id: Seccion; label: string; icon: React.ReactNode; descripcion: string }[] = [
  {
    id: "inicio",
    label: "Inicio",
    descripcion: "Presentación",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: "liquidador",
    label: "Liquidador",
    descripcion: "Calcular haberes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="2" width="16" height="20" rx="2"/>
        <line x1="8" y1="6" x2="16" y2="6"/>
        <line x1="8" y1="10" x2="16" y2="10"/>
        <line x1="8" y1="14" x2="12" y2="14"/>
        <path d="m15 17 2 2 4-4"/>
      </svg>
    ),
  },
  {
    id: "convenios",
    label: "Convenios",
    descripcion: "Info CCT",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    id: "aguinaldo",
    label: "Aguinaldo",
    descripcion: "SAC / SAC proporcional",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    id: "indemnizacion",
    label: "Indemnización",
    descripcion: "Art. 245 LCT",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
];

export default function Sidebar({ seccionActiva, onCambiarSeccion, open = false, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay (solo mobile, cuando el drawer está abierto) */}
      {open && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: "oklch(0 0 0 / 0.5)" }}
          onClick={onClose}
        />
      )}

      <aside
        className={`w-[220px] min-h-screen flex flex-col shrink-0 fixed inset-y-0 left-0 z-40 transition-transform duration-200 md:static md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--navy)" }}
      >
      {/* Logo */}
      <div className="px-4 py-5 border-b flex items-center justify-between" style={{ borderColor: "oklch(0.35 0.07 250)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
            style={{ background: "var(--gold)" }}
          >
            <img
              src="/logo.svg"
              alt="LiquidAR"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <div
              className="text-base font-bold leading-tight"
              style={{ fontFamily: "Sora, sans-serif", color: "oklch(0.98 0 0)" }}
            >
              LiquidAR
            </div>
            <div className="text-xs" style={{ color: "oklch(0.65 0.04 250)" }}>
              Sueldos Argentina
            </div>
          </div>
        </div>
        {/* Botón cerrar (solo mobile) */}
        <button
          onClick={onClose}
          className="md:hidden w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "oklch(0.35 0.07 250)", color: "white" }}
          aria-label="Cerrar menú"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <div className="text-xs font-semibold uppercase tracking-widest mb-3 px-3" style={{ color: "oklch(0.50 0.04 250)" }}>
          Herramientas
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onCambiarSeccion(item.id);
              onClose?.();
            }}
            className={`nav-item w-full text-left ${seccionActiva === item.id ? "active" : ""}`}
          >
            <span className="shrink-0">{item.icon}</span>
            <div className="min-w-0">
              <div className="text-sm font-medium leading-tight">{item.label}</div>
              <div className="text-xs opacity-60 leading-tight mt-0.5">{item.descripcion}</div>
            </div>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "oklch(0.35 0.07 250)" }}>
        <div className="text-xs" style={{ color: "oklch(0.50 0.04 250)" }}>
          <div className="font-medium" style={{ color: "oklch(0.65 0.04 250)" }}>LiquidAR v2026</div>
          <div className="mt-1">Datos actualizados</div>
          <div>julio 2026</div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--positive)" }} />
          <span className="text-xs" style={{ color: "oklch(0.65 0.04 250)" }}>CCT vigentes</span>
        </div>
      </div>
      </aside>
    </>
  );
}