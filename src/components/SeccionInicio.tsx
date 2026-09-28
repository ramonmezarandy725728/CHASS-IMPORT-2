// src/components/SeccionInicio.tsx
import { useState } from 'react';

interface Props {
  role: 'ADMIN' | 'TRABAJADOR';
  numeroSemanaActual: number;
  movimientos: any[];
  onCierreSemana: () => void;
  onRegistrarDiscordancia: (montoFaltante: number, nota: string) => void;
}

export default function SeccionInicio({ role, numeroSemanaActual, movimientos, onCierreSemana, onRegistrarDiscordancia }: Props) {
  // ESTADOS PARA LA AUDITORÍA RÁPIDA DE EFECTIVO
  const [b100, setB100] = useState(0);
  const [b50, setB50] = useState(0);
  const [b20, setB20] = useState(0);
  const [b10, setB10] = useState(0);
  const [monedas, setMonedas] = useState(0);
  const [observacionDiscordancia, setObservacionDiscordancia] = useState('');

  // CÁLCULOS SEPARADOS POR MÉTODO DE PAGO Y TIPO (INGRESOS VS SALIDAS)
  const totalEfectivoIngresos = movimientos.filter(m => m.tipo === 'ingreso' && m.metodoPago === 'Efectivo').reduce((acc, m) => acc + m.monto, 0);
  const totalEfectivoSalidas = movimientos.filter(m => m.tipo === 'salida' && m.metodoPago === 'Efectivo').reduce((acc, m) => acc + m.monto, 0);
  const netoEfectivo = totalEfectivoIngresos - totalEfectivoSalidas;

  const totalYapeIngresos = movimientos.filter(m => m.tipo === 'ingreso' && m.metodoPago === 'Yape / Plin').reduce((acc, m) => acc + m.monto, 0);
  const totalYapeSalidas = movimientos.filter(m => m.tipo === 'salida' && m.metodoPago === 'Yape / Plin').reduce((acc, m) => acc + m.monto, 0);
  const netoYape = totalYapeIngresos - totalYapeSalidas;

  const totalBancoIngresos = movimientos.filter(m => m.tipo === 'ingreso' && m.metodoPago === 'Transferencia BCP/BBVA').reduce((acc, m) => acc + m.monto, 0);
  const totalBancoSalidas = movimientos.filter(m => m.tipo === 'salida' && m.metodoPago === 'Transferencia BCP/BBVA').reduce((acc, m) => acc + m.monto, 0);
  const netoBanco = totalBancoIngresos - totalBancoSalidas;

  const totalIngresosGeneral = movimientos.filter(m => m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0);
  const totalSalidasGeneral = movimientos.filter(m => m.tipo === 'salida').reduce((acc, m) => acc + m.monto, 0);
  const dineroTotalAcumulado = totalIngresosGeneral - totalSalidasGeneral;

  // CÁLCULO DE ARQUEO FÍSICO
  const efectivoContado = (b100 * 100) + (b50 * 50) + (b20 * 20) + (b10 * 10) + monedas;
  const diferenciaEfectivo = efectivoContado - netoEfectivo;

  // ALERTA ROJA SI LOS GASTOS SUPERAN EL 50% DE LAS VENTAS
  const porcentajeGastos = totalIngresosGeneral > 0 ? (totalSalidasGeneral / totalIngresosGeneral) * 100 : 0;
  const alertaRoja = porcentajeGastos > 50;

  const handleEnviarDiscordancia = () => {
    if (diferenciaEfectivo >= 0) {
      alert('⚠️ No hay faltante de dinero. El arqueo físico es correcto o hay sobrante.');
      return;
    }
    const montoFaltante = Math.abs(diferenciaEfectivo);
    onRegistrarDiscordancia(montoFaltante, observacionDiscordancia);
    setObservacionDiscordancia('');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* CABECERA */}
      <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h2 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '22px' }}>CHASS IMPORT — SEMANA {numeroSemanaActual}</h2>
          <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 'bold' }}>CONTROL Y SALUD FINANCIERA DE LA EMPRESA</span>
        </div>
        {role === 'ADMIN' && (
          <button onClick={onCierreSemana} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
            🔒 CIERRE DE SEMANA (REINICIAR CAJA)
          </button>
        )}
      </div>

      {/* ALERTA ROJA GASTOS */}
      {alertaRoja && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', borderRadius: '12px', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ fontSize: '24px' }}>🚨</span>
          <div>
            <h4 style={{ color: '#f87171', margin: '0 0 3px 0', fontSize: '13px' }}>ALERTA ROJA: GASTOS SUPERAN EL 50% DE LAS VENTAS</h4>
            <span style={{ color: '#cbd5e1', fontSize: '11px' }}>Has consumido el <strong>{porcentajeGastos.toFixed(1)}%</strong> de tus ingresos en gastos semanales.</span>
          </div>
        </div>
      )}

      {/* DINERO TOTAL ACUMULADO */}
      <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', padding: '30px', textAlign: 'center' }}>
        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 'bold', letterSpacing: '1px' }}>DINERO TOTAL ACUMULADO (NETO)</span>
        <h1 style={{ fontSize: '38px', color: dineroTotalAcumulado >= 0 ? '#38bdf8' : '#f87171', margin: '10px 0 0 0' }}>
          S/ {dineroTotalAcumulado.toFixed(2)}
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px', fontSize: '11px', color: '#94a3b8' }}>
          <span>🟢 Total Ingresos: +S/ {totalIngresosGeneral.toFixed(2)}</span>
          <span>🔴 Total Salidas: -S/ {totalSalidasGeneral.toFixed(2)}</span>
        </div>
      </div>

      {/* DESGLOSE POR MÉTODO DE PAGO */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        
        {/* EFECTIVO */}
        <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid #22c55e', borderRadius: '16px', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#4ade80', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>💵 EFECTIVO EN CAJA (NETO)</span>
          <h3 style={{ fontSize: '24px', color: '#fff', margin: '0 0 10px 0' }}>S/ {netoEfectivo.toFixed(2)}</h3>
          <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span>Ingresos Efectivo: +S/ {totalEfectivoIngresos.toFixed(2)}</span>
            <span>Salidas Efectivo: -S/ {totalEfectivoSalidas.toFixed(2)}</span>
          </div>
        </div>

        {/* YAPE / PLIN */}
        <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid #c084fc', borderRadius: '16px', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#c084fc', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>📱 YAPE / PLIN (NETO)</span>
          <h3 style={{ fontSize: '24px', color: '#fff', margin: '0 0 10px 0' }}>S/ {netoYape.toFixed(2)}</h3>
          <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span>Ingresos Yape/Plin: +S/ {totalYapeIngresos.toFixed(2)}</span>
            <span>Salidas Yape/Plin: -S/ {totalYapeSalidas.toFixed(2)}</span>
          </div>
        </div>

        {/* BANCO */}
        <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid #3b82f6', borderRadius: '16px', padding: '20px' }}>
          <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>🏦 BANCO BCP/BBVA (NETO)</span>
          <h3 style={{ fontSize: '24px', color: '#fff', margin: '0 0 10px 0' }}>S/ {netoBanco.toFixed(2)}</h3>
          <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span>Ingresos Banco: +S/ {totalBancoIngresos.toFixed(2)}</span>
            <span>Salidas Banco: -S/ {totalBancoSalidas.toFixed(2)}</span>
          </div>
        </div>

      </div>

      {/* AUDITORÍA RÁPIDA DE EFECTIVO */}
      <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', padding: '25px' }}>
        <h3 style={{ color: '#38bdf8', margin: '0 0 15px 0', fontSize: '16px' }}>📊 AUDITORÍA RÁPIDA DE EFECTIVO FÍSICO</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>S/ 100</label>
            <input type="number" min="0" value={b100} onChange={e => setB100(parseInt(e.target.value) || 0)} style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>S/ 50</label>
            <input type="number" min="0" value={b50} onChange={e => setB50(parseInt(e.target.value) || 0)} style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>S/ 20</label>
            <input type="number" min="0" value={b20} onChange={e => setB20(parseInt(e.target.value) || 0)} style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>S/ 10</label>
            <input type="number" min="0" value={b10} onChange={e => setB10(parseInt(e.target.value) || 0)} style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Monedas (Total)</label>
            <input type="number" step="0.1" min="0" value={monedas} onChange={e => setMonedas(parseFloat(e.target.value) || 0)} style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0f172a', padding: '15px 20px', borderRadius: '12px', border: '1px solid #1e293b', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Efectivo Contado: </span>
            <strong style={{ fontSize: '18px', color: '#4ade80' }}>S/ {efectivoContado.toFixed(2)}</strong>
          </div>
          <div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Estado Caja: </span>
            <span style={{ fontSize: '13px', fontWeight: 'bold', color: diferenciaEfectivo === 0 ? '#4ade80' : diferenciaEfectivo > 0 ? '#38bdf8' : '#f87171' }}>
              {diferenciaEfectivo === 0 ? '🟢 CAJA EXACTA' : diferenciaEfectivo > 0 ? `🟢 SOBRA S/ ${diferenciaEfectivo.toFixed(2)}` : `🔴 FALTA S/ ${Math.abs(diferenciaEfectivo).toFixed(2)}`}
            </span>
          </div>
        </div>

        {role === 'TRABAJADOR' && diferenciaEfectivo < 0 && (
          <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Explique el motivo del faltante de efectivo..." 
              value={observacionDiscordancia} 
              onChange={e => setObservacionDiscordancia(e.target.value)} 
              style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #ef4444', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} 
            />
            <button onClick={handleEnviarDiscordancia} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
              🚨 REGISTRAR DISCORDANCIA EN BITÁCORA
            </button>
          </div>
        )}

      </div>

    </div>
  );
}