import  { useState } from 'react';

interface Props {
  role: 'ADMIN' | 'TRABAJADOR';
  numeroSemanaActual: number;
  movimientos: any[];
  onCierreSemana: () => void;
  onRegistrarDiscordancia: (monto: number, nota: string) => void;
}

export default function SeccionInicio({ role, numeroSemanaActual, movimientos, onCierreSemana, onRegistrarDiscordancia }: Props) {
  const [b100, setB100] = useState(0);
  const [b50, setB50] = useState(0);
  const [b20, setB20] = useState(0);
  const [b10, setB10] = useState(0);
  const [monedas, setMonedas] = useState(0);
  const [notaAuditoria, setNotaAuditoria] = useState('');

  const ingresos = movimientos.filter(m => m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0);
  const salidas = movimientos.filter(m => m.tipo === 'salida').reduce((acc, m) => acc + m.monto, 0);
  const balanceNeto = ingresos - salidas;

  const efectivoEnCaja = movimientos.reduce((acc, m) => {
    if (m.metodoPago === 'Efectivo') return m.tipo === 'ingreso' ? acc + m.monto : acc - m.monto;
    return acc;
  }, 0);

  const yapeTotal = movimientos.filter(m => m.metodoPago === 'Yape / Plin' && m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0);
  const bancoTotal = movimientos.filter(m => m.metodoPago === 'Transferencia BCP/BBVA' && m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0);

  const totalContado = (b100 * 100) + (b50 * 50) + (b20 * 20) + (b10 * 10) + (monedas * 1);
  const diferenciaCuadre = totalContado - efectivoEnCaja;
  const porcentajeGastos = ingresos > 0 ? (salidas / ingresos) * 100 : 0;

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', padding: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '20px' }}>CHASS IMPORT — SEMANA {numeroSemanaActual}</h2>
            <span style={{ fontSize: '11px', color: '#38bdf8' }}>CONTROL Y SALUD FINANCIERA DE LA EMPRESA</span>
          </div>
          {role === 'ADMIN' && (
            <button onClick={onCierreSemana} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>
              🔒 CIERRE DE SEMANA (REINICIAR CAJA)
            </button>
          )}
        </div>

        {/* SEMÁFORO DE GASTOS */}
        <div style={{ 
          padding: '15px 20px', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px',
          background: porcentajeGastos > 50 ? 'rgba(239, 68, 68, 0.15)' : porcentajeGastos > 30 ? 'rgba(234, 179, 8, 0.15)' : 'rgba(34, 197, 94, 0.15)',
          border: porcentajeGastos > 50 ? '1px solid #ef4444' : porcentajeGastos > 30 ? '1px solid #eab308' : '1px solid #22c55e'
        }}>
          <div style={{ fontSize: '28px' }}>{porcentajeGastos > 50 ? '🚨' : porcentajeGastos > 30 ? '⚠️' : '❇️'}</div>
          <div>
            <h4 style={{ margin: 0, fontSize: '13px', color: porcentajeGastos > 50 ? '#fca5a5' : porcentajeGastos > 30 ? '#fde047' : '#86efac' }}>
              {porcentajeGastos > 50 ? 'ALERTA ROJA: GASTOS SUPERAN EL 50% DE LAS VENTAS' : porcentajeGastos > 30 ? 'RITMO DE GASTOS MODERADO' : 'ESTADO SALUDABLE EN CAJA'}
            </h4>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Has consumido el <strong>{porcentajeGastos.toFixed(1)}%</strong> de tus ingresos en gastos semanales.</span>
          </div>
        </div>

        {/* DINERO ACUMULADO */}
        <div style={{ textAlign: 'center', background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>DINERO TOTAL ACUMULADO</span>
          <h1 style={{ margin: 0, fontSize: '42px', fontWeight: '900', color: '#38bdf8' }}>S/ {balanceNeto.toFixed(2)}</h1>
        </div>

        {/* DESGLOSE POR TIPO */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
          <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#86efac', fontWeight: 'bold' }}>💵 EFECTIVO EN CAJA</span>
            <h3 style={{ margin: '5px 0 0 0', color: '#4ade80', fontSize: '22px' }}>S/ {efectivoEnCaja.toFixed(2)}</h3>
          </div>
          <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid #a855f7', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#c084fc', fontWeight: 'bold' }}>📱 YAPE / PLIN</span>
            <h3 style={{ margin: '5px 0 0 0', color: '#c084fc', fontSize: '22px' }}>S/ {yapeTotal.toFixed(2)}</h3>
          </div>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
            <span style={{ fontSize: '10px', color: '#60a5fa', fontWeight: 'bold' }}>🏦 BANCO (BCP/BBVA)</span>
            <h3 style={{ margin: '5px 0 0 0', color: '#60a5fa', fontSize: '22px' }}>S/ {bancoTotal.toFixed(2)}</h3>
          </div>
        </div>

        {/* AUDITORÍA DE BILLETES (ADMIN) */}
        {role === 'ADMIN' && (
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#38bdf8' }}>🧮 AUDITORÍA RÁPIDA DE EFECTIVO</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px', marginBottom: '15px' }}>
              <div><label style={{ fontSize: '9px', color: '#94a3b8' }}>S/ 100:</label><input type="number" min="0" value={b100} onChange={e => setB100(parseInt(e.target.value) || 0)} style={{ width: '100%', padding: '6px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ fontSize: '9px', color: '#94a3b8' }}>S/ 50:</label><input type="number" min="0" value={b50} onChange={e => setB50(parseInt(e.target.value) || 0)} style={{ width: '100%', padding: '6px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ fontSize: '9px', color: '#94a3b8' }}>S/ 20:</label><input type="number" min="0" value={b20} onChange={e => setB20(parseInt(e.target.value) || 0)} style={{ width: '100%', padding: '6px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ fontSize: '9px', color: '#94a3b8' }}>S/ 10:</label><input type="number" min="0" value={b10} onChange={e => setB10(parseInt(e.target.value) || 0)} style={{ width: '100%', padding: '6px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} /></div>
              <div><label style={{ fontSize: '9px', color: '#94a3b8' }}>Monedas:</label><input type="number" min="0" value={monedas} onChange={e => setMonedas(parseFloat(e.target.value) || 0)} style={{ width: '100%', padding: '6px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '4px' }} /></div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#090d16', padding: '12px 15px', borderRadius: '8px' }}>
              <div><span style={{ fontSize: '10px', color: '#94a3b8' }}>Contado:</span> <strong style={{ color: '#fff' }}>S/ {totalContado.toFixed(2)}</strong></div>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: diferenciaCuadre === 0 ? '#4ade80' : diferenciaCuadre < 0 ? '#ef4444' : '#60a5fa' }}>
                  {diferenciaCuadre === 0 ? '🟢 CAJA QUADRADA' : diferenciaCuadre < 0 ? `🔴 FALTA S/ ${Math.abs(diferenciaCuadre).toFixed(2)}` : `🔵 SOBRA S/ ${diferenciaCuadre.toFixed(2)}`}
                </span>
              </div>
            </div>

            {diferenciaCuadre !== 0 && (
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <input type="text" placeholder="Observación para la trabajadora..." value={notaAuditoria} onChange={e => setNotaAuditoria(e.target.value)} style={{ flex: 1, padding: '8px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '11px' }} />
                <button onClick={() => { onRegistrarDiscordancia(Math.abs(diferenciaCuadre), notaAuditoria); setNotaAuditoria(''); }} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
                  🚨 REGISTRAR DISCORDANCIA
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}