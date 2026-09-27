// src/components/SeccionHistorial.tsx
import { useState } from 'react';

interface Props {
  historialSemanas: any[];
}

export default function SeccionHistorial({ historialSemanas }: Props) {
  const [semanaSeleccionada, setSemanaSeleccionada] = useState<any | null>(null);

  // Cálculos consolidados para el Dashboard
  const totalIngresosHistorico = historialSemanas.reduce((acc, s) => acc + (s.ingresos || s.balance || 0), 0);
  const totalSalidasHistorico = historialSemanas.reduce((acc, s) => acc + (s.salidas || 0), 0);
  const balanceHistorico = totalIngresosHistorico - totalSalidasHistorico;

  // Calcular la barra con el valor más alto para escalar el gráfico
  const maxMonto = Math.max(
    ...historialSemanas.map(s => Math.max(s.ingresos || s.balance || 0, s.salidas || 0)),
    100
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* CABECERA Y KPI GENERALES */}
      <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(192, 132, 252, 0.3)', borderRadius: '20px', padding: '20px' }}>
        <h2 style={{ color: '#c084fc', margin: '0 0 5px 0', fontSize: '18px' }}>📅 HISTORIAL DE SEMANAS Y RENDIMIENTO HISTÓRICO</h2>
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 20px 0' }}>Análisis comparativo de ingresos, gastos y utilidad semana a semana.</p>

        {/* METRICAS TOTALES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>TOTAL VENTAS HISTÓRICAS</span>
            <strong style={{ fontSize: '20px', color: '#38bdf8' }}>S/ {totalIngresosHistorico.toFixed(2)}</strong>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>TOTAL GASTOS HISTÓRICOS</span>
            <strong style={{ fontSize: '20px', color: '#ef4444' }}>S/ {totalSalidasHistorico.toFixed(2)}</strong>
          </div>
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>GANANCIA NETA ACUMULADA</span>
            <strong style={{ fontSize: '20px', color: '#4ade80' }}>S/ {balanceHistorico.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      {/* GRÁFICO COMPARATIVO SEMANAL */}
      {historialSemanas.length > 0 ? (
        <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', padding: '20px' }}>
          <h3 style={{ color: '#38bdf8', margin: '0 0 15px 0', fontSize: '15px' }}>📊 GRÁFICO DE COMPARATIVA SEMANAL (INGRESOS vs GASTOS)</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {historialSemanas.map((s, idx) => {
              const ing = s.ingresos || s.balance || 0;
              const sal = s.salidas || 0;
              const porcentajeIngreso = Math.min((ing / maxMonto) * 100, 100);
              const porcentajeSalida = Math.min((sal / maxMonto) * 100, 100);

              return (
                <div key={idx} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <strong style={{ color: '#c084fc', fontSize: '14px' }}>SEMANA {s.numeroSemana}</strong>
                      <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '10px' }}>Cierre: {s.fechaCierre}</span>
                    </div>
                    <button 
                      onClick={() => setSemanaSeleccionada(semanaSeleccionada?.numeroSemana === s.numeroSemana ? null : s)} 
                      style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      {semanaSeleccionada?.numeroSemana === s.numeroSemana ? '▲ Ocultar Expediente' : '▼ Ver Movimientos'}
                    </button>
                  </div>

                  {/* BARRAS DE PROGRESO DE LA SEMANA */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* BARRA INGRESOS */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#4ade80', marginBottom: '2px' }}>
                        <span>Ventas / Ingresos</span>
                        <strong>S/ {ing.toFixed(2)}</strong>
                      </div>
                      <div style={{ width: '100%', height: '10px', background: '#090d16', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${porcentajeIngreso}%`, height: '100%', background: 'linear-gradient(90deg, #22c55e, #4ade80)', transition: 'width 0.5s ease-in-out' }} />
                      </div>
                    </div>

                    {/* BARRA GASTOS */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#ef4444', marginBottom: '2px' }}>
                        <span>Gastos / Salidas</span>
                        <strong>S/ {sal.toFixed(2)}</strong>
                      </div>
                      <div style={{ width: '100%', height: '10px', background: '#090d16', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{ width: `${porcentajeSalida}%`, height: '100%', background: 'linear-gradient(90deg, #dc2626, #ef4444)', transition: 'width 0.5s ease-in-out' }} />
                      </div>
                    </div>
                  </div>

                  {/* EXPEDIENTE DESPLEGABLE */}
                  {semanaSeleccionada?.numeroSemana === s.numeroSemana && (
                    <div style={{ marginTop: '15px', borderTop: '1px solid #1e293b', paddingTop: '12px', fontSize: '11px' }}>
                      <h4 style={{ color: '#fde047', margin: '0 0 8px 0', fontSize: '12px' }}>📋 REGISTRO DE MOVIMIENTOS DE LA SEMANA {s.numeroSemana}:</h4>
                      {s.movimientos && s.movimientos.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
                            <thead>
                              <tr style={{ background: '#080c18', color: '#60a5fa' }}>
                                <th style={{ padding: '6px' }}>Tipo</th>
                                <th style={{ padding: '6px' }}>Detalle / Concepto</th>
                                <th style={{ padding: '6px' }}>Método</th>
                                <th style={{ padding: '6px' }}>Monto</th>
                              </tr>
                            </thead>
                            <tbody>
                              {s.movimientos.map((m: any, i: number) => (
                                <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                                  <td style={{ padding: '6px', color: m.tipo === 'ingreso' ? '#4ade80' : '#ef4444', fontWeight: 'bold' }}>{m.tipo.toUpperCase()}</td>
                                  <td style={{ padding: '6px', color: '#fff' }}>{m.concepto || m.modeloIphone}</td>
                                  <td style={{ padding: '6px', color: '#94a3b8' }}>{m.metodoPago}</td>
                                  <td style={{ padding: '6px', color: m.tipo === 'ingreso' ? '#4ade80' : '#ef4444', fontWeight: 'bold' }}>S/ {m.monto.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <span style={{ color: '#64748b' }}>Sin movimientos registrados en este archivo.</span>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VISTA SI AÚN NO HAY CIERRES */
        <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>📦</div>
          <h3 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '15px' }}>AÚN NO HAY SEMANAS ARCHIVADAS</h3>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>
            Para ver gráficos comparativos, realiza el primer <strong>🔒 CIERRE DE SEMANA</strong> desde la pestaña <strong>1. Inicio — Caja</strong>.
          </p>
        </div>
      )}

    </div>
  );
}