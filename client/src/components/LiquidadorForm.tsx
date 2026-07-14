/**
 * LiquidAR — Formulario de Liquidación
 * Design: Financial Precision Tool
 */

import { useEffect, useState } from "react";
import {
  CONVENIOS,
  type DatosLiquidacion,
  getPeriodoActual,
  formatPeriodo,
} from "@/lib/convenios";

interface DatosEmpleado {
  nombre: string;
  apellido: string;
  cuil: string;
  empresa: string;
  cuit: string;
  domicilio: string;
}

interface LiquidadorFormProps {
  datos: DatosLiquidacion;
  datosEmpleado: DatosEmpleado;
  onDatosChange: (datos: DatosLiquidacion) => void;
  onDatosEmpleadoChange: (datos: DatosEmpleado) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span
        className="text-xs font-bold uppercase tracking-widest"
        style={{ color: "var(--navy)", fontFamily: "Sora, sans-serif" }}
      >
        {children}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}

function FieldLabel({ children, tooltip }: { children: React.ReactNode; tooltip?: string }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wide">
      {children}
      {tooltip && (
        <span
          title={tooltip}
          className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-xs cursor-help shrink-0"
          style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
        >
          ?
        </span>
      )}
    </label>
  );
}

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150";

const selectClass =
  "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-150 appearance-none cursor-pointer";

export default function LiquidadorForm({
  datos,
  datosEmpleado,
  onDatosChange,
  onDatosEmpleadoChange,
}: LiquidadorFormProps) {
  const [localDatos, setLocalDatos] = useState<DatosLiquidacion>(datos);
  const [tabActivo, setTabActivo] = useState<"empleado" | "liquidacion">("liquidacion");

  const esFueraConvenio = localDatos.fueraConvenio === true;

  const convenioActual = CONVENIOS.find((c) => c.id === localDatos.convenioId)!;
  const categoriasDisponibles = convenioActual?.categorias ?? [];
  const adicionalesDisponibles = convenioActual?.adicionales.filter(
    (a) => !a.id.includes("antiguedad") && !a.id.includes("presentismo")
  ) ?? [];

  // Cuando cambia el convenio, resetear categoría
  const handleConvenioChange = (convenioId: string) => {
    const conv = CONVENIOS.find((c) => c.id === convenioId)!;
    const nuevoDatos = {
      ...localDatos,
      convenioId,
      categoriaId: conv.categorias[0]?.id ?? "",
      adicionales: [],
    };
    setLocalDatos(nuevoDatos);
    onDatosChange(nuevoDatos);
  };

  const handleChange = <K extends keyof DatosLiquidacion>(
    key: K,
    value: DatosLiquidacion[K]
  ) => {
    const nuevoDatos = { ...localDatos, [key]: value };
    setLocalDatos(nuevoDatos);
    onDatosChange(nuevoDatos);
  };

  const handleFueraConvenioToggle = (fuera: boolean) => {
    const nuevoDatos: DatosLiquidacion = {
      ...localDatos,
      fueraConvenio: fuera,
      basicoManual: fuera ? localDatos.basicoManual || 1_500_000 : localDatos.basicoManual,
      adicionales: [],
    };
    setLocalDatos(nuevoDatos);
    onDatosChange(nuevoDatos);
  };

  const handleAdicionalToggle = (id: string) => {
    const nuevosAdicionales = localDatos.adicionales.includes(id)
      ? localDatos.adicionales.filter((a) => a !== id)
      : [...localDatos.adicionales, id];
    handleChange("adicionales", nuevosAdicionales);
  };

  const handleAdicionalPersonalizado = (
    key: keyof DatosLiquidacion["adicionalesPersonalizados"],
    value: string
  ) => {
    const num = parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;
    const nuevoDatos = {
      ...localDatos,
      adicionalesPersonalizados: {
        ...localDatos.adicionalesPersonalizados,
        [key]: num,
      },
    };
    setLocalDatos(nuevoDatos);
    onDatosChange(nuevoDatos);
  };

  // Generar opciones de período (últimos 12 meses + próximos 3)
  const periodos: string[] = [];
  const now = new Date();
  for (let i = -12; i <= 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const p = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    periodos.push(p);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-border">
        {(["liquidacion", "empleado"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setTabActivo(tab)}
            className="flex-1 py-3 text-sm font-medium transition-all duration-150"
            style={{
              color: tabActivo === tab ? "var(--navy)" : "var(--muted-foreground)",
              borderBottom: tabActivo === tab ? "2px solid var(--navy)" : "2px solid transparent",
              background: "transparent",
            }}
          >
            {tab === "liquidacion" ? "Datos de Liquidación" : "Datos del Empleado"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-5 space-y-6">
        {tabActivo === "liquidacion" && (
          <>
            {/* Período */}
            <div>
              <SectionTitle>Período</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel tooltip="Mes y año de la liquidación">Período</FieldLabel>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={localDatos.periodo}
                      onChange={(e) => handleChange("periodo", e.target.value)}
                    >
                      {periodos.map((p) => (
                        <option key={p} value={p}>
                          {formatPeriodo(p)}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <FieldLabel tooltip="Días trabajados en el mes (30 = mes completo)">Días trabajados</FieldLabel>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    className={inputClass}
                    value={localDatos.diasTrabajados}
                    onChange={(e) => handleChange("diasTrabajados", parseInt(e.target.value) || 30)}
                  />
                </div>
              </div>
            </div>

            {/* Modo: Dentro / Fuera de Convenio */}
            <div>
              <SectionTitle>Modalidad</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { fuera: false, label: "Bajo Convenio", sub: "Según CCT" },
                  { fuera: true, label: "Fuera de Convenio", sub: "Básico manual" },
                ].map((modo) => (
                  <button
                    key={modo.label}
                    onClick={() => handleFueraConvenioToggle(modo.fuera)}
                    className="p-3 rounded-lg border text-left transition-all duration-150"
                    style={{
                      borderColor: esFueraConvenio === modo.fuera ? "var(--navy)" : "var(--border)",
                      background: esFueraConvenio === modo.fuera ? "oklch(0.96 0.005 250)" : "transparent",
                    }}
                  >
                    <div className="text-sm font-medium text-foreground">{modo.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{modo.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Básico Manual (Fuera de Convenio) */}
            {esFueraConvenio && (
              <div>
                <SectionTitle>Salario Básico</SectionTitle>
                <div>
                  <FieldLabel tooltip="Salario básico bruto mensual del empleado fuera de convenio">
                    Básico bruto mensual ($)
                  </FieldLabel>
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    placeholder="1.500.000"
                    value={localDatos.basicoManual || ""}
                    onChange={(e) => handleChange("basicoManual", parseFloat(e.target.value) || 0)}
                    style={{ fontFamily: "JetBrains Mono, monospace" }}
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Personal jerárquico o fuera de todo CCT. Aportes y contribuciones estándar.
                  </p>
                </div>
              </div>
            )}

            {/* Convenio y Categoría */}
            {!esFueraConvenio && (
            <div>
              <SectionTitle>Convenio Colectivo</SectionTitle>
              <div className="space-y-3">
                <div>
                  <FieldLabel tooltip="Convenio Colectivo de Trabajo aplicable">CCT</FieldLabel>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={localDatos.convenioId}
                      onChange={(e) => handleConvenioChange(e.target.value)}
                    >
                      {CONVENIOS.map((c) => (
                        <option key={c.id} value={c.id}>
                          CCT {c.numero} — {c.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                  {convenioActual && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {convenioActual.sindicato} · {convenioActual.horasSemana}hs/sem · {convenioActual.vigencia}
                    </p>
                  )}
                </div>

                <div>
                  <FieldLabel tooltip="Categoría laboral según el CCT">Categoría</FieldLabel>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={localDatos.categoriaId}
                      onChange={(e) => handleChange("categoriaId", e.target.value)}
                    >
                      {categoriasDisponibles.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                  </div>
                  {localDatos.categoriaId && (
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {categoriasDisponibles.find((c) => c.id === localDatos.categoriaId)?.descripcion}
                    </p>
                  )}
                </div>
              </div>
            </div>
            )}

            {/* Antigüedad y Presentismo */}
            <div>
              <SectionTitle>Antigüedad y Presentismo</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel tooltip="Años de antigüedad en la empresa (1% del básico por año)">
                    Antigüedad (años)
                  </FieldLabel>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    className={inputClass}
                    value={localDatos.antiguedad}
                    onChange={(e) => handleChange("antiguedad", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <FieldLabel tooltip="El trabajador no registró ausencias injustificadas">
                    Presentismo
                  </FieldLabel>
                  <div className="flex items-center gap-3 h-[38px]">
                    <button
                      onClick={() => handleChange("presentismo", true)}
                      className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 border"
                      style={{
                        background: localDatos.presentismo ? "var(--positive)" : "transparent",
                        color: localDatos.presentismo ? "white" : "var(--muted-foreground)",
                        borderColor: localDatos.presentismo ? "var(--positive)" : "var(--border)",
                      }}
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => handleChange("presentismo", false)}
                      className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 border"
                      style={{
                        background: !localDatos.presentismo ? "var(--negative)" : "transparent",
                        color: !localDatos.presentismo ? "white" : "var(--muted-foreground)",
                        borderColor: !localDatos.presentismo ? "var(--negative)" : "var(--border)",
                      }}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Horas Extras */}
            <div>
              <SectionTitle>Horas Extras</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel tooltip="Horas extras con recargo del 50% (días hábiles)">
                    HE 50% (hs)
                  </FieldLabel>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    className={inputClass}
                    value={localDatos.horasExtras50}
                    onChange={(e) => handleChange("horasExtras50", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <FieldLabel tooltip="Horas extras con recargo del 100% (feriados y domingos)">
                    HE 100% (hs)
                  </FieldLabel>
                  <input
                    type="number"
                    min={0}
                    max={200}
                    className={inputClass}
                    value={localDatos.horasExtras100}
                    onChange={(e) => handleChange("horasExtras100", parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            {/* Adicionales del CCT */}
            {adicionalesDisponibles.length > 0 && (
              <div>
                <SectionTitle>Adicionales del CCT</SectionTitle>
                <div className="space-y-2">
                  {adicionalesDisponibles.map((adicional) => (
                    <label
                      key={adicional.id}
                      className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150"
                      style={{
                        borderColor: localDatos.adicionales.includes(adicional.id)
                          ? "var(--navy)"
                          : "var(--border)",
                        background: localDatos.adicionales.includes(adicional.id)
                          ? "oklch(0.96 0.005 250)"
                          : "transparent",
                      }}
                    >
                      <input
                        type="checkbox"
                        className="mt-0.5 shrink-0"
                        checked={localDatos.adicionales.includes(adicional.id)}
                        onChange={() => handleAdicionalToggle(adicional.id)}
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-foreground">{adicional.nombre}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{adicional.descripcion}</div>
                        <div
                          className="text-xs mt-1"
                          style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--navy)" }}
                        >
                          {adicional.tipo === "porcentaje"
                            ? `${adicional.valor}% del básico`
                            : `$${adicional.valor.toLocaleString("es-AR")} fijo`}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Adicionales Personalizados */}
            <div>
              <SectionTitle>Otros Conceptos</SectionTitle>
              <div className="space-y-3">
                <div>
                  <FieldLabel tooltip="Comisiones por ventas u objetivos (remunerativo)">
                    Comisiones ($)
                  </FieldLabel>
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    placeholder="0"
                    value={localDatos.adicionalesPersonalizados.comisiones || ""}
                    onChange={(e) => handleAdicionalPersonalizado("comisiones", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel tooltip="Suma fija no remunerativa (no tributa aportes)">
                    No Remunerativo ($)
                  </FieldLabel>
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    placeholder="0"
                    value={localDatos.adicionalesPersonalizados.noRemunerativo || ""}
                    onChange={(e) => handleAdicionalPersonalizado("noRemunerativo", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel tooltip="Viáticos y gastos de representación (no remunerativo)">
                    Viáticos ($)
                  </FieldLabel>
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    placeholder="0"
                    value={localDatos.adicionalesPersonalizados.viaticos || ""}
                    onChange={(e) => handleAdicionalPersonalizado("viaticos", e.target.value)}
                  />
                </div>
                <div>
                  <FieldLabel tooltip="Otros adicionales remunerativos no contemplados">
                    Otros Adicionales ($)
                  </FieldLabel>
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    placeholder="0"
                    value={localDatos.adicionalesPersonalizados.otros || ""}
                    onChange={(e) => handleAdicionalPersonalizado("otros", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Tipo de Empleador */}
            <div>
              <SectionTitle>Tipo de Empleador</SectionTitle>
              <div>
                <FieldLabel tooltip="Afecta la alícuota de contribuciones patronales (18% PyME / 20.4% grande)">
                  Categoría empleador
                </FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "grande" as const, label: "Grande / Servicios", sub: "20.4%" },
                    { id: "pyme" as const, label: "PyME", sub: "18%" },
                  ].map((tipo) => (
                    <button
                      key={tipo.id}
                      onClick={() => handleChange("tipoEmpleador", tipo.id)}
                      className="p-3 rounded-lg border text-left transition-all duration-150"
                      style={{
                        borderColor: localDatos.tipoEmpleador === tipo.id ? "var(--navy)" : "var(--border)",
                        background: localDatos.tipoEmpleador === tipo.id ? "oklch(0.96 0.005 250)" : "transparent",
                      }}
                    >
                      <div className="text-sm font-medium text-foreground">{tipo.label}</div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--navy)" }}
                      >
                        {tipo.sub} contrib.
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {tabActivo === "empleado" && (
          <>
            <div>
              <SectionTitle>Datos del Trabajador</SectionTitle>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <FieldLabel>Apellido</FieldLabel>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="García"
                      value={datosEmpleado.apellido}
                      onChange={(e) => onDatosEmpleadoChange({ ...datosEmpleado, apellido: e.target.value })}
                    />
                  </div>
                  <div>
                    <FieldLabel>Nombre</FieldLabel>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Juan"
                      value={datosEmpleado.nombre}
                      onChange={(e) => onDatosEmpleadoChange({ ...datosEmpleado, nombre: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel tooltip="CUIL del trabajador (20-12345678-9)">CUIL</FieldLabel>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="20-12345678-9"
                    value={datosEmpleado.cuil}
                    onChange={(e) => onDatosEmpleadoChange({ ...datosEmpleado, cuil: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <SectionTitle>Datos del Empleador</SectionTitle>
              <div className="space-y-3">
                <div>
                  <FieldLabel>Razón Social / Empresa</FieldLabel>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Empresa S.A."
                    value={datosEmpleado.empresa}
                    onChange={(e) => onDatosEmpleadoChange({ ...datosEmpleado, empresa: e.target.value })}
                  />
                </div>
                <div>
                  <FieldLabel tooltip="CUIT del empleador">CUIT</FieldLabel>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="30-12345678-9"
                    value={datosEmpleado.cuit}
                    onChange={(e) => onDatosEmpleadoChange({ ...datosEmpleado, cuit: e.target.value })}
                  />
                </div>
                <div>
                  <FieldLabel>Domicilio</FieldLabel>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="Av. Corrientes 1234, CABA"
                    value={datosEmpleado.domicilio}
                    onChange={(e) => onDatosEmpleadoChange({ ...datosEmpleado, domicilio: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div
              className="p-4 rounded-lg text-sm"
              style={{ background: "oklch(0.96 0.005 250)", color: "var(--muted-foreground)" }}
            >
              <div className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p>
                  Los datos del empleado y empleador son opcionales y solo se usan para generar el recibo de sueldo. No se almacenan ni se envían a ningún servidor.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
