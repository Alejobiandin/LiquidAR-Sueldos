/**
 * LiquidAR — Home Page
 * Design: Financial Precision Tool
 * Layout: Sidebar (nav) + Main (form + results)
 */

import { useState, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import LiquidadorForm from "@/components/LiquidadorForm";
import ResultadosPanel from "@/components/ResultadosPanel";
import ReciboSueldo from "@/components/ReciboSueldo";
import ConveniosInfo from "@/components/ConveniosInfo";
import AguinaldoCalc from "@/components/AguinaldoCalc";
import IndemnizacionCalc from "@/components/IndemnizacionCalc";
import LandingHero from "@/components/LandingHero";
import NominaMasiva from "@/components/NominaMasiva";
import {
  calcularLiquidacion,
  type DatosLiquidacion,
  type ResultadoLiquidacion,
  getPeriodoActual,
} from "@/lib/convenios";

export type Seccion = "inicio" | "liquidador" | "convenios" | "aguinaldo" | "indemnizacion";

const defaultDatos: DatosLiquidacion = {
  convenioId: "comercio",
  categoriaId: "vendedor_b",
  antiguedad: 3,
  horasExtras50: 0,
  horasExtras100: 0,
  presentismo: true,
  adicionales: [],
  periodo: getPeriodoActual(),
  diasTrabajados: 30,
  tipoEmpleador: "grande",
  adicionalesPersonalizados: {
    noRemunerativo: 0,
    comisiones: 0,
    viaticos: 0,
    otros: 0,
  },
};

export default function Home() {
  const [seccionActiva, setSeccionActiva] = useState<Seccion>("inicio");
  const [sidebarAbierto, setSidebarAbierto] = useState(false);
  const [modoLiquidacion, setModoLiquidacion] = useState<"unitario" | "masivo">("unitario");
  const [datos, setDatos] = useState<DatosLiquidacion>(defaultDatos);
  const [resultado, setResultado] = useState<ResultadoLiquidacion | null>(null);
  const [mostrarRecibo, setMostrarRecibo] = useState(false);
  const [datosEmpleado, setDatosEmpleado] = useState({
    nombre: "",
    apellido: "",
    cuil: "",
    empresa: "",
    cuit: "",
    domicilio: "",
  });

  const handleCalcular = useCallback((nuevosDatos: DatosLiquidacion) => {
    setDatos(nuevosDatos);
    try {
      const res = calcularLiquidacion(nuevosDatos);
      setResultado(res);
    } catch (e) {
      console.error("Error al calcular:", e);
    }
  }, []);

  const handleIrALiquidador = () => {
    setSeccionActiva("liquidador");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        seccionActiva={seccionActiva}
        onCambiarSeccion={setSeccionActiva}
        open={sidebarAbierto}
        onClose={() => setSidebarAbierto(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto min-w-0">
        {/* Topbar móvil */}
        <div
          className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-card sticky top-0 z-20"
        >
          <button
            onClick={() => setSidebarAbierto(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0"
            style={{ background: "var(--navy)", color: "white" }}
            aria-label="Abrir menú"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <img src="/logo.svg" alt="LiquidAR" className="w-6 h-6" />
          <span className="text-sm font-bold" style={{ fontFamily: "Sora, sans-serif" }}>LiquidAR</span>
        </div>

        {seccionActiva === "inicio" && (
          <LandingHero onIrALiquidador={handleIrALiquidador} />
        )}

        {seccionActiva === "liquidador" && (
          <div className="min-h-screen">
            {/* Header */}
            <div className="border-b border-border bg-card px-4 sm:px-6 py-4 md:sticky md:top-0 z-10">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-lg sm:text-xl font-semibold text-foreground" style={{ fontFamily: "Sora, sans-serif" }}>
                    Liquidación de Haberes
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {modoLiquidacion === "unitario"
                      ? "Cálculo en tiempo real — Todos los CCT vigentes"
                      : "Liquidación masiva por nómina — CSV / Excel"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Toggle Unitario / Masivo */}
                  <div className="flex rounded-lg border border-border overflow-hidden">
                    {([
                      { id: "unitario" as const, label: "Unitario" },
                      { id: "masivo" as const, label: "Masivo" },
                    ]).map((modo) => (
                      <button
                        key={modo.id}
                        onClick={() => setModoLiquidacion(modo.id)}
                        className="px-3 sm:px-4 py-2 text-sm font-medium transition-all duration-150"
                        style={{
                          background: modoLiquidacion === modo.id ? "var(--navy)" : "transparent",
                          color: modoLiquidacion === modo.id ? "white" : "var(--muted-foreground)",
                        }}
                      >
                        {modo.label}
                      </button>
                    ))}
                  </div>
                  {modoLiquidacion === "unitario" && resultado && (
                    <button
                      onClick={() => setMostrarRecibo(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.97]"
                      style={{
                        background: "var(--gold)",
                        color: "oklch(0.15 0.05 85)",
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                      Ver Recibo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            {modoLiquidacion === "unitario" ? (
              <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-0 min-h-[calc(100vh-73px)]">
                {/* Form Panel */}
                <div className="border-r border-border bg-card/50 overflow-auto">
                  <LiquidadorForm
                    datos={datos}
                    datosEmpleado={datosEmpleado}
                    onDatosChange={handleCalcular}
                    onDatosEmpleadoChange={setDatosEmpleado}
                  />
                </div>

                {/* Results Panel */}
                <div className="overflow-auto bg-background">
                  <ResultadosPanel
                    resultado={resultado}
                    onVerRecibo={() => setMostrarRecibo(true)}
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto w-full">
                <NominaMasiva />
              </div>
            )}
          </div>
        )}

        {seccionActiva === "convenios" && <ConveniosInfo />}
        {seccionActiva === "aguinaldo" && <AguinaldoCalc />}
        {seccionActiva === "indemnizacion" && <IndemnizacionCalc />}
      </main>

      {/* Recibo Modal */}
      {mostrarRecibo && resultado && (
        <ReciboSueldo
          resultado={resultado}
          datosEmpleado={datosEmpleado}
          onCerrar={() => setMostrarRecibo(false)}
        />
      )}
    </div>
  );
}