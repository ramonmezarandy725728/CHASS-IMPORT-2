// src/components/SeccionSalidas.tsx
import React, { useState } from 'react';

interface Props {
  role: 'ADMIN' | 'TRABAJADOR';
  nombreUsuario: string;
  movimientos: any[];
  onRegistrarSalida: (nuevo: any) => void;
}

export default function SeccionSalidas({ role, nombreUsuario, movimientos, onRegistrarSalida }: Props) {
  // Fecha por defecto en formato YYYY-MM-DD para el input date
  const hoyYYYYMMDD = new Date().toISOString().split('T')[0];

  const [fecha, setFecha] = useState(hoyYYYYMMDD);
  const [categoriaGasto, setCategoriaGasto] = useState('Delivery');
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');

  const salidasTotales = movimientos.filter(m => m.tipo === 'salida').reduce((acc, m) => acc + m.monto, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monto || parseFloat(monto) <= 0 || !concepto.trim()) return;

    // Formatear la fecha elegida a DD/MM/YYYY para mostrar uniforme
    const partesFecha = fecha.split('-');
    const fechaFormateada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;

    onRegistrarSalida({
      id: Date.now(),
      tipo: 'salida',
      categoriaGasto,
      concepto,
      monto: parseFloat(monto),
      metodoPago,
      usuario: nombreUsuario,
      fecha: fechaFormateada,
      hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    });

    setConcepto('');
    setMonto('');
    alert('🔴 Gasto registrado correctamente.');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {role === 'ADMIN' ? (
        /* VISTA ADMINISTRADOR: MONITOREO */
        <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '20px', padding: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ color: '#ef4444', margin: 0, fontSize: '20px' }}>🔴 MONITOREO DE SALIDAS (GASTOS)</h2>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Supervisión detallada de salidas de caja.</span>
            </div>
            <span style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>
              Total Gastos: S/ {salidasTotales.toFixed(2)}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: '#0f172a', color: '#fca5a5' }}>
                  <th style={{ padding: '10px' }}>FECHA / HORA</th>
                  <th style={{ padding: '10px' }}>CATEGORÍA</th>
                  <th style={{ padding: '10px' }}>DESCRIPCIÓN / MOTIVO</th>
                  <th style={{ padding: '10px' }}>MÉTODO</th>
                  <th style={{ padding: '10px' }}>REGISTRADO POR</th>
                  <th style={{ padding: '10px' }}>MONTO</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.filter(m => m.tipo === 'salida').map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '10px', color: '#94a3b8' }}>{m.fecha}<br/><small>{m.hora}</small></td>
                    <td style={{ padding: '10px', color: '#fca5a5' }}>{m.categoriaGasto || 'General'}</td>
                    <td style={{ padding: '10px', color: '#fff', fontWeight: 'bold' }}>{m.concepto}</td>
                    <td style={{ padding: '10px' }}>{m.metodoPago}</td>
                    <td style={{ padding: '10px', color: '#c084fc' }}>👤 {m.usuario}</td>
                    <td style={{ padding: '10px', color: '#ef4444', fontWeight: 'bold' }}>- S/ {m.monto.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VISTA TRABAJADOR: FORMULARIO ALINEADO Y PROPORCIONAL */
        <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '20px', padding: '25px' }}>
          <h2 style={{ color: '#ef4444', margin: '0 0 5px 0', fontSize: '20px' }}>🔴 REGISTRAR SALIDA DE DINERO / GASTO</h2>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '20px' }}>Complete los datos del retiro de dinero para mantener la caja cuadrada.</p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#fca5a5', marginBottom: '6px', fontWeight: 'bold' }}>📅 FECHA</label>
              <input 
                type="date" 
                value={fecha} 
                onChange={(e) => setFecha(e.target.value)} 
                required 
                style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#fca5a5', marginBottom: '6px', fontWeight: 'bold' }}>🏷️ CATEGORÍA</label>
              <select value={categoriaGasto} onChange={(e) => setCategoriaGasto(e.target.value)} style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}>
                <option value="Delivery">🛵 Delivery / Envío a Domicilio</option>
                <option value="Mercadería">📦 Mercadería / Insumos Tienda</option>
                <option value="Movilidad">🚕 Movilidad / Pasajes</option>
                <option value="Alimentación">🍔 Alimentación / Refrigerio</option>
                <option value="Otros">🛠️ Otros Gastos Operativos</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#fca5a5', marginBottom: '6px', fontWeight: 'bold' }}>💳 MÉTODO DE PAGO</label>
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}>
                <option value="Efectivo">💵 Efectivo (Retirado de Caja)</option>
                <option value="Yape / Plin">📱 Yape / Plin</option>
                <option value="Transferencia BCP/BBVA">🏦 Transferencia Bancaria</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#fca5a5', marginBottom: '6px', fontWeight: 'bold' }}>📝 MOTIVO / DESCRIPCIÓN DETALLADA</label>
              <input 
                type="text" 
                placeholder="Ej. Envío Olva a Miraflores / Pasaje taxi al almacén" 
                value={concepto} 
                onChange={(e) => setConcepto(e.target.value)} 
                required 
                style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} 
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#ef4444', marginBottom: '6px', fontWeight: 'bold' }}>💰 MONTO RETIRADO (S/)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={monto} 
                  onChange={(e) => setMonto(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #ef4444', color: '#fff', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', boxSizing: 'border-box' }} 
                />
              </div>

              <button type="submit" style={{ width: '100%', padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', height: '45px' }}>
                🔴 GUARDAR SALIDA EN CAJA
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}