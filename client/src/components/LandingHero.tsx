/**
 * LiquidAR — Landing Hero (v2)
 * Design: Financial Precision Tool — Instrumento técnico-contable
 * Paleta controlada: navy/gold/green/red — sin colores decorativos
 * Densidad informativa: dashboard/tabla/registro indexado
 */

import { CONVENIOS } from "@/lib/convenios";

interface LandingHeroProps {
  onIrALiquidador: () => void;
}

// Tabla de características — estilo documento técnico
const features = [
  {
    codigo: "F-01",
    nombre: "Cálculo reactivo",
    descripcion: "Los haberes se recalculan en tiempo real al modificar cualquier parámetro.",
    tag: "TIEMPO REAL",
  },
  {
    codigo: "F-02",
    nombre: "Recibo imprimible",
    descripcion: "Genera recibo de sueldo con formato oficial, listo para imprimir o exportar.",
    tag: "FORMATO OFICIAL",
  },
  {
    codigo: "F-03",
    nombre: "Escalas actualizadas",
    descripcion: "Básicos, adicionales y aportes actualizados según normativa vigente julio 2026.",
    tag: "JULIO 2026",
  },
  {
    codigo: "F-04",
    nombre: "Todos los CCT",
    descripcion: `${CONVENIOS.length} convenios colectivos: comercio, construcción, metalurgia, salud y más.`,
    tag: `${CONVENIOS.length} CCT`,
  },
];

// Tabla de convenios — estilo registro indexado
const conveniosTabla = CONVENIOS.map((c) => ({
  id: c.id,
  numero: c.numero,
  nombre: c.nombre,
  sindicato: c.sindicato,
  sector: c.sector,
  categorias: c.categorias.length,
}));

export default function LandingHero({ onIrALiquidador }: LandingHeroProps) {
  return (
    <div className="min-h-screen">
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--navy)" }}
      >
        {/* Grid técnico */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(oklch(0.98 0 0 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(0.98 0 0 / 0.04) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative container py-14 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
            {/* Left — Headline */}
            <div>
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-semibold mb-5 tracking-wider"
                style={{
                  background: "oklch(0.30 0.07 250)",
                  color: "var(--gold)",
                  border: "1px solid oklch(0.38 0.08 250)",
                  fontFamily: "JetBrains Mono, monospace",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gold)" }} />
                DATOS VIGENTES — JULIO 2026
              </div>

              <h1
                className="text-4xl lg:text-5xl font-bold text-white leading-[1.1] mb-5"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Liquidá cualquier CCT{" "}
                <span style={{ color: "var(--gold)" }}>en segundos.</span>
              </h1>

              <p className="text-base text-white/65 mb-8 max-w-lg leading-relaxed">
                Plataforma de liquidación de haberes para contadores y responsables de RRHH.
                Todos los Convenios Colectivos de Trabajo vigentes, aportes, contribuciones
                y recibo de sueldo imprimible. Sin registro. Sin costo.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onIrALiquidador}
                  className="flex items-center gap-2 px-6 py-3 rounded font-semibold text-sm transition-all duration-150 active:scale-[0.97]"
                  style={{
                    background: "var(--gold)",
                    color: "oklch(0.12 0.05 85)",
                    boxShadow: "0 4px 16px oklch(0.72 0.15 85 / 0.35)",
                    fontFamily: "Sora, sans-serif",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="4" y="2" width="16" height="20" rx="1.5"/>
                    <path d="m9 11 3 3 3-3"/>
                    <line x1="12" y1="7" x2="12" y2="14"/>
                  </svg>
                  Calcular liquidación
                </button>
                <button
                  onClick={onIrALiquidador}
                  className="flex items-center gap-2 px-5 py-3 rounded font-medium text-sm transition-all duration-150"
                  style={{
                    background: "oklch(0.30 0.07 250)",
                    color: "oklch(0.85 0.01 250)",
                    border: "1px solid oklch(0.38 0.08 250)",
                  }}
                >
                  Ver convenios
                </button>
              </div>

              {/* Stats — estilo datos técnicos */}
              <div
                className="flex gap-8 mt-10 pt-8"
                style={{ borderTop: "1px solid oklch(0.32 0.07 250)" }}
              >
                {[
                  { valor: `${CONVENIOS.length}`, label: "CCT cargados", mono: true },
                  { valor: "17%", label: "Aportes empleado", mono: true },
                  { valor: "23.5%", label: "Contrib. patronal", mono: true },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div
                      className="text-2xl font-bold"
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        color: "var(--gold)",
                      }}
                    >
                      {stat.valor}
                    </div>
                    <div className="text-xs text-white/45 mt-0.5 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Panel de datos técnicos */}
            <div
              className="rounded-lg overflow-hidden"
              style={{ border: "1px solid oklch(0.35 0.07 250)" }}
            >
              {/* Header del panel */}
              <div
                className="px-4 py-2.5 flex items-center justify-between"
                style={{ background: "oklch(0.25 0.07 250)", borderBottom: "1px solid oklch(0.35 0.07 250)" }}
              >
                <span
                  className="text-xs font-bold uppercase tracking-widest"
                  style={{ color: "var(--gold)", fontFamily: "JetBrains Mono, monospace" }}
                >
                  APORTES Y CONTRIBUCIONES
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ background: "oklch(0.30 0.07 250)", color: "oklch(0.65 0.04 250)", fontFamily: "JetBrains Mono, monospace" }}
                >
                  RES. AFIP 2026
                </span>
              </div>

              {/* Tabla de aportes */}
              <div style={{ background: "oklch(0.22 0.07 250)" }}>
                {[
                  { concepto: "Jubilación (SIPA)", empleado: "11%", empleador: "16%", tipo: "seguridad" },
                  { concepto: "PAMI (INSSJP)", empleado: "3%", empleador: "2%", tipo: "seguridad" },
                  { concepto: "Obra Social", empleado: "3%", empleador: "6%", tipo: "salud" },
                  { concepto: "Fondo Nac. Empleo", empleado: "—", empleador: "1.5%", tipo: "empleo" },
                  { concepto: "Cuota Sindical", empleado: "2%", empleador: "—", tipo: "sindical" },
                ].map((row, i) => (
                  <div
                    key={row.concepto}
                    className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2.5 text-xs"
                    style={{
                      borderBottom: i < 4 ? "1px solid oklch(0.28 0.07 250)" : "none",
                    }}
                  >
                    <span style={{ color: "oklch(0.72 0.02 250)" }}>{row.concepto}</span>
                    <span
                      className="text-right"
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        color: row.empleado === "—" ? "oklch(0.40 0.04 250)" : "var(--positive)",
                      }}
                    >
                      {row.empleado}
                    </span>
                    <span
                      className="text-right"
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        color: row.empleador === "—" ? "oklch(0.40 0.04 250)" : "var(--negative)",
                      }}
                    >
                      {row.empleador}
                    </span>
                  </div>
                ))}
                {/* Totales */}
                <div
                  className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-3 text-xs"
                  style={{ background: "oklch(0.25 0.07 250)", borderTop: "1px solid oklch(0.35 0.07 250)" }}
                >
                  <span className="font-bold uppercase tracking-wide" style={{ color: "oklch(0.80 0.02 250)" }}>
                    TOTAL
                  </span>
                  <span
                    className="font-bold text-right"
                    style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--positive)" }}
                  >
                    17%
                  </span>
                  <span
                    className="font-bold text-right"
                    style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--negative)" }}
                  >
                    25.5%
                  </span>
                </div>
              </div>

              {/* Leyenda */}
              <div
                className="px-4 py-2 flex items-center gap-4 text-xs"
                style={{ background: "oklch(0.20 0.07 250)", borderTop: "1px solid oklch(0.28 0.07 250)" }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--positive)" }} />
                  <span style={{ color: "oklch(0.55 0.03 250)" }}>Empleado</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: "var(--negative)" }} />
                  <span style={{ color: "oklch(0.55 0.03 250)" }}>Empleador</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CARACTERÍSTICAS — estilo ficha técnica ─────────── */}
      <section className="py-12" style={{ background: "oklch(0.97 0.003 250)" }}>
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-5 rounded-full" style={{ background: "var(--gold)" }} />
            <h2
              className="text-lg font-bold text-foreground uppercase tracking-wider"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              Funcionalidades del sistema
            </h2>
          </div>

          {/* Tabla de features */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--navy)" }}>
                  <th className="text-left px-4 py-2.5 text-xs font-bold text-white/50 uppercase tracking-widest w-16" style={{ fontFamily: "JetBrains Mono, monospace" }}>CÓD.</th>
                  <th className="text-left px-4 py-2.5 text-xs font-bold text-white/50 uppercase tracking-widest">FUNCIONALIDAD</th>
                  <th className="hidden md:table-cell text-left px-4 py-2.5 text-xs font-bold text-white/50 uppercase tracking-widest">DESCRIPCIÓN</th>
                  <th className="text-right px-4 py-2.5 text-xs font-bold text-white/50 uppercase tracking-widest">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {features.map((f, i) => (
                  <tr key={f.codigo} style={{ background: i % 2 === 0 ? "white" : "oklch(0.985 0.001 250)" }}>
                    <td
                      className="px-4 py-3 text-xs"
                      style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--muted-foreground)" }}
                    >
                      {f.codigo}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-foreground" style={{ fontFamily: "Sora, sans-serif" }}>
                        {f.nombre}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-muted-foreground text-xs leading-relaxed">
                      {f.descripcion}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold"
                        style={{
                          background: "oklch(0.94 0.04 145)",
                          color: "oklch(0.35 0.12 145)",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        <span className="w-1 h-1 rounded-full" style={{ background: "var(--positive)" }} />
                        {f.tag}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── ÍNDICE DE CONVENIOS — estilo registro oficial ──── */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 rounded-full" style={{ background: "var(--gold)" }} />
              <h2
                className="text-lg font-bold text-foreground uppercase tracking-wider"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Índice de Convenios Colectivos
              </h2>
            </div>
            <div
              className="text-xs px-3 py-1 rounded"
              style={{
                background: "oklch(0.95 0.005 250)",
                color: "var(--navy)",
                fontFamily: "JetBrains Mono, monospace",
                border: "1px solid oklch(0.88 0.005 250)",
              }}
            >
              {CONVENIOS.length} REGISTROS
            </div>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--navy)" }}>
                  <th className="text-left px-4 py-2.5 text-xs font-bold text-white/50 uppercase tracking-widest" style={{ fontFamily: "JetBrains Mono, monospace" }}>CCT N°</th>
                  <th className="text-left px-4 py-2.5 text-xs font-bold text-white/50 uppercase tracking-widest">ACTIVIDAD</th>
                  <th className="hidden sm:table-cell text-left px-4 py-2.5 text-xs font-bold text-white/50 uppercase tracking-widest">SINDICATO</th>
                  <th className="hidden lg:table-cell text-left px-4 py-2.5 text-xs font-bold text-white/50 uppercase tracking-widest">SECTOR</th>
                  <th className="text-right px-4 py-2.5 text-xs font-bold text-white/50 uppercase tracking-widest">CATEG.</th>
                  <th className="text-right px-4 py-2.5 text-xs font-bold text-white/50 uppercase tracking-widest w-24">ACCIÓN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {conveniosTabla.map((c, i) => (
                  <tr
                    key={c.id}
                    className="group hover:bg-muted/40 transition-colors cursor-pointer"
                    onClick={onIrALiquidador}
                    style={{ background: i % 2 === 0 ? "white" : "oklch(0.985 0.001 250)" }}
                  >
                    <td className="px-4 py-2.5">
                      <span
                        className="font-semibold"
                        style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--navy)" }}
                      >
                        {c.numero}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-foreground">{c.nombre}</td>
                    <td className="hidden sm:table-cell px-4 py-2.5 text-muted-foreground text-xs">{c.sindicato}</td>
                    <td className="hidden lg:table-cell px-4 py-2.5">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs"
                        style={{
                          background: "oklch(0.94 0.005 250)",
                          color: "var(--navy)",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        {c.sector}
                      </span>
                    </td>
                    <td
                      className="px-4 py-2.5 text-right text-xs"
                      style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--muted-foreground)" }}
                    >
                      {c.categorias}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span
                        className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "var(--navy)" }}
                      >
                        Liquidar →
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────── */}
      <section
        className="py-14"
        style={{ background: "var(--navy)" }}
      >
        <div className="container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Sora, sans-serif" }}
              >
                Calculá la liquidación ahora
              </h2>
              <p className="text-white/55 text-sm mt-1">
                Sin registro · Sin costo · Datos actualizados julio 2026
              </p>
            </div>
            <button
              onClick={onIrALiquidador}
              className="flex items-center gap-2 px-7 py-3 rounded font-semibold text-sm transition-all duration-150 active:scale-[0.97] shrink-0"
              style={{
                background: "var(--gold)",
                color: "oklch(0.12 0.05 85)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              Ir al Liquidador
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
