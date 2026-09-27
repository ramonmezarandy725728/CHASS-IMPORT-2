// src/components/SeccionHistorial.tsx
import { useState } from 'react';

interface Props {
  historialSemanas: any[];
  onEliminarSemana?: (numeroSemana: number) => void;
}

export default function SeccionHistorial({ historialSemanas, onEliminarSemana }: Props) {
  const [semanaExpandida, SemanaExpandida] = useState<number | null>(null);

  // Cálculos de totales históricos
  const totalVentasHist = historialSemanas.reduce((acc, s) => acc + s.ingresos, 0);
  const totalGastosHist = historialSemanas.reduce((acc, s) => acc + s.salidas, 0);
  const gananciaNeta = totalVentasHist - totalGastosHist;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TARJETA PRINCIPAL DE HISTORIAL */}
      <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', padding: '25px' }}>
        <h2 style={{ color: '#c084fc', margin: '0 0 5px 0', fontSize: '20px' }}>📅 HISTORIAL DE SEMANAS Y RENDIMIENTO HISTÓRICO</h2>
        <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '20px' }}>Análisis comparativo de ingresos, gastos y utilidad semana a semana.</p>

        {/* MÉTRICAS GLOBALES */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px', marginBottom: '25px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>TOTAL VENTAS HISTÓRICAS</span>
            <span style={{ fontSize: '20px', color: '#4ade80', fontWeight: 'bold' }}>S/ {totalVentasHist.toFixed(2)}</span>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>TOTAL GASTOS HISTÓRICOS</span>
            <span style={{ fontSize: '20px', color: '#f87171', fontWeight: 'bold' }}>S/ {totalGastosHist.toFixed(2)}</span>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>GANANCIA NETA ACUMULADA</span>
            <span style={{ fontSize: '20px', color: '#38bdf8', fontWeight: 'bold' }}>S/ {gananciaNeta.toFixed(2)}</span>
          </div>
        </div>

        {/* LISTADO DE SEMANAS */}
        <h3 style={{ color: '#38bdf8', fontSize: '15px', marginBottom: '15px' }}>📊 GRÁFICO Y CIRES DE COMPARATIVA SEMANAL</h3>
        
        {historialSemanas.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', padding: '20px' }}>No hay semanas cerradas registradas todavía.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {historialSemanas.map((semana) => {
              const maxVal = Math.max(semana.ingresos, semana.salidas, 1);
              const porcIngresos = (semana.ingresos / maxVal) * 100;
              const porcSalidas = (semana.salidas / maxVal) * 100;
              const estaExpandido = semanaExpandida === semana.numeroSemana;

              return (
                <div key={semana.numeroSemana} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <span style={{ color: '#c084fc', fontWeight: 'bold', fontSize: '15px' }}>SEMANA {semana.numeroSemana}</span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '10px' }}>Cierre: {semana.fechaCierre}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => SemanaExpandida(estaExpandido ? null : semana.numeroSemana)}
                        style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', color: '#60a5fa', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        {estaExpandido ? '▲ Ocultar Movimientos' : '▼ Ver Movimientos'}
                      </button>

                      <button 
                        onClick={() => {
                          if (confirm(`⚠️ ¿Estás seguro de eliminar el registro histórico de la Semana ${semana.numeroSemana}?`)) {
                            onEliminarSemana?.(semana.numeroSemana);
                          }
                        }}
                        style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        🗑️ Eliminar Semana
                      </button>
                    </div>
                  </div>

                  {/* BARRAS DE PROGRESO */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', color: '#4ade80' }}>
                        <span>Ventas / Ingresos</span>
                        <span>S/ {semana.ingresos.toFixed(2)}</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${porcIngresos}%`, height: '100%', background: '#22c55e', transition: 'width 0.4s' }} />
                      </div>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px', color: '#f87171' }}>
                        <span>Gastos / Salidas</span>
                        <span>S/ {semana.salidas.toFixed(2)}</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${porcSalidas}%`, height: '100%', background: '#ef4444', transition: 'width 0.4s' }} />
                      </div>
                    </div>
                  </div>

                  {/* DESPLEGABLE DE MOVIMIENTOS DE ESA SEMANA */}
                  {estaExpandido && (
                    <div style={{ marginTop: '15px', borderTop: '1px solid #1e293b', paddingTop: '15px' }}>
                      <h4 style={{ color: '#38bdf8', fontSize: '12px', margin: '0 0 10px 0' }}>📋 Detalle de movimientos de la Semana {semana.numeroSemana}:</h4>
                      {semana.movimientos && semana.movimientos.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                          {semana.movimientos.map((m: any, idx: number) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', background: '#03050c', padding: '8px 12px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                              <span style={{ color: '#cbd5e1' }}>{m.concepto} ({m.metodoPago})</span>
                              <span style={{ color: m.tipo === 'ingreso' ? '#4ade80' : '#f87171', fontWeight: 'bold' }}>
                                {m.tipo === 'ingreso' ? '+' : '-'} S/ {m.monto.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ color: '#94a3b8', fontSize: '11px' }}>No hay transacciones guardadas en esta semana.</p>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}