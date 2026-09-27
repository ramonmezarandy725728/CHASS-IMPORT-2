// src/components/SeccionEntradas.tsx
import React, { useState } from 'react';

interface Props {
  role: 'ADMIN' | 'TRABAJADOR';
  nombreUsuario: string;
  movimientos: any[];
  clientes: any[];
  onRegistrarIngreso: (nuevo: any) => void;
  onAbrirModal: (movimiento: any) => void;
}

export default function SeccionEntradas({ role, nombreUsuario, movimientos, clientes, onRegistrarIngreso, onAbrirModal }: Props) {
  const hoyYYYYMMDD = new Date().toISOString().split('T')[0];

  const [fecha, setFecha] = useState(hoyYYYYMMDD);
  const [tipoVenta, setTipoVenta] = useState('Venta Tienda');
  const [clienteSel, setClienteSel] = useState('Cliente Ocasional');
  const [modeloIphone, setModeloIphone] = useState('iPhone 15 Pro Max');
  const [tipoCase, setTipoCase] = useState('Magsafe Transparente');
  const [cantidadCases, setCantidadCases] = useState(1);
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [numOperacion, setNumOperacion] = useState('');

  const ingresosTotales = movimientos.filter(m => m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monto || parseFloat(monto) <= 0 || !concepto.trim()) return;

    if ((metodoPago === 'Yape / Plin' || metodoPago === 'Transferencia BCP/BBVA') && !numOperacion.trim()) {
      alert('⚠️ Para pagos digitales es OBLIGATORIO ingresar el N° de Operación.');
      return;
    }

    const partesFecha = fecha.split('-');
    const fechaFormateada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;

    onRegistrarIngreso({
      id: Date.now(),
      tipo: 'ingreso',
      tipoVenta,
      cliente: clienteSel,
      modeloIphone,
      tipoCase,
      cantidad: cantidadCases,
      concepto,
      monto: parseFloat(monto),
      metodoPago,
      numOperacion: numOperacion || '-',
      usuario: nombreUsuario,
      fecha: fechaFormateada,
      hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    });

    setConcepto('');
    setMonto('');
    setNumOperacion('');
    alert('✅ Venta registrada correctamente.');
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {role === 'ADMIN' ? (
        /* VISTA ADMINISTRADOR: MONITOREO Y AUDITORÍA */
        <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', padding: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ color: '#4ade80', margin: 0, fontSize: '20px' }}>🟢 MONITOREO Y AUDITORÍA DE VENTAS (ENTRADAS)</h2>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Supervisión de cases vendidos y verificación bancaria.</span>
            </div>
            <span style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#4ade80', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>
              Total Ingresos: S/ {ingresosTotales.toFixed(2)}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', minWidth: '650px' }}>
              <thead>
                <tr style={{ background: '#0f172a', color: '#60a5fa' }}>
                  <th style={{ padding: '10px' }}>FECHA / HORA</th>
                  <th style={{ padding: '10px' }}>TIPO VENTA</th>
                  <th style={{ padding: '10px' }}>CLIENTE</th>
                  <th style={{ padding: '10px' }}>MODELO / CASE</th>
                  <th style={{ padding: '10px' }}>MÉTODO</th>
                  <th style={{ padding: '10px' }}>N° OPERACIÓN</th>
                  <th style={{ padding: '10px' }}>REGISTRADO POR</th>
                  <th style={{ padding: '10px' }}>MONTO</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.filter(m => m.tipo === 'ingreso').map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '10px', color: '#94a3b8' }}>{m.fecha}<br/><small>{m.hora}</small></td>
                    <td style={{ padding: '10px' }}>{m.tipoVenta}</td>
                    <td style={{ padding: '10px', color: '#fff', fontWeight: 'bold' }}>{m.cliente}</td>
                    <td style={{ padding: '10px' }}><strong style={{ color: '#38bdf8' }}>{m.modeloIphone}</strong><br/>{m.tipoCase}</td>
                    <td style={{ padding: '10px' }}>{m.metodoPago}</td>
                    <td style={{ padding: '10px' }}>
                      {m.numOperacion && m.numOperacion !== '-' ? (
                        <button onClick={() => onAbrirModal(m)} style={{ background: 'rgba(234, 179, 8, 0.15)', border: '1px solid #eab308', color: '#fde047', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          🔍 #{m.numOperacion}
                        </button>
                      ) : '-'}
                    </td>
                    <td style={{ padding: '10px', color: '#c084fc' }}>👤 {m.usuario}</td>
                    <td style={{ padding: '10px', color: '#4ade80', fontWeight: 'bold' }}>+ S/ {m.monto.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* VISTA TRABAJADOR: FORMULARIO DE REGISTRO */
        <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', padding: '25px' }}>
          <h2 style={{ color: '#4ade80', margin: '0 0 5px 0', fontSize: '20px' }}>🟢 REGISTRAR NUEVA VENTA / INGRESO</h2>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '20px' }}>Complete los datos para ingresar la venta a caja.</p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#60a5fa', marginBottom: '6px', fontWeight: 'bold' }}>📅 FECHA</label>
              <input 
                type="date" 
                value={fecha} 
                onChange={(e) => setFecha(e.target.value)} 
                required 
                style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#60a5fa', marginBottom: '6px', fontWeight: 'bold' }}>🏷️ TIPO OPERACIÓN</label>
              <select value={tipoVenta} onChange={(e) => setTipoVenta(e.target.value)} style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}>
                <option value="Venta Tienda">🏬 Venta Tienda Directa</option>
                <option value="Punto de Venta">🏪 Punto de Venta / Consignación</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#60a5fa', marginBottom: '6px', fontWeight: 'bold' }}>👤 CLIENTE / PUNTO</label>
              <select value={clienteSel} onChange={(e) => setClienteSel(e.target.value)} style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}>
                <option value="Cliente Ocasional">-- Cliente Ocasional --</option>
                {clientes.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#38bdf8', marginBottom: '6px', fontWeight: 'bold' }}>📱 MODELO IPHONE</label>
              <select value={modeloIphone} onChange={(e) => setModeloIphone(e.target.value)} style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}>
                <option value="iPhone 16 Pro Max">iPhone 16 Pro Max</option>
                <option value="iPhone 15 Pro Max">iPhone 15 Pro Max</option>
                <option value="iPhone 14 Series">iPhone 14 Series</option>
                <option value="Varios / Lote">Varios / Lote</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#38bdf8', marginBottom: '6px', fontWeight: 'bold' }}>🛡️ TIPO DE CASE</label>
              <select value={tipoCase} onChange={(e) => setTipoCase(e.target.value)} style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}>
                <option value="Magsafe Transparente">Magsafe Transparente</option>
                <option value="Silicona Case">Silicona Case</option>
                <option value="Antigolpe Reforzado">Antigolpe Reforzado</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#60a5fa', marginBottom: '6px', fontWeight: 'bold' }}>💳 MÉTODO DE PAGO</label>
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}>
                <option value="Efectivo">💵 Efectivo</option>
                <option value="Yape / Plin">📱 Yape / Plin</option>
                <option value="Transferencia BCP/BBVA">🏦 Transferencia Bancaria</option>
              </select>
            </div>

            {(metodoPago === 'Yape / Plin' || metodoPago === 'Transferencia BCP/BBVA') && (
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#fde047', marginBottom: '6px', fontWeight: 'bold' }}>🔢 N° DE OPERACIÓN BANCARIO</label>
                <input 
                  type="text" 
                  placeholder="Ej. 982134" 
                  value={numOperacion} 
                  onChange={(e) => setNumOperacion(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #eab308', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} 
                />
              </div>
            )}

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#60a5fa', marginBottom: '6px', fontWeight: 'bold' }}>📝 DESCRIPCIÓN ADICIONAL</label>
              <input 
                type="text" 
                placeholder="Ej. Case Magsafe + mica de regalo" 
                value={concepto} 
                onChange={(e) => setConcepto(e.target.value)} 
                required 
                style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} 
              />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#4ade80', marginBottom: '6px', fontWeight: 'bold' }}>💰 MONTO COBRADO (S/)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={monto} 
                  onChange={(e) => setMonto(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #22c55e', color: '#fff', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', boxSizing: 'border-box' }} 
                />
              </div>

              <button type="submit" style={{ width: '100%', padding: '12px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', height: '45px' }}>
                ⚡ REGISTRAR VENTA EN CAJA
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}