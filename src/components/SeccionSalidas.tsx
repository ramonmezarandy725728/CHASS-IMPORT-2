// src/components/SeccionSalidas.tsx
import { useState } from 'react';

interface Props {
  role: 'ADMIN' | 'TRABAJADOR';
  nombreUsuario: string;
  movimientos: any[];
  onRegistrarSalida: (nuevo: any) => void;
  onEliminarMovimiento?: (id: number) => void;
  onEditarMovimiento?: (id: number, actualizado: any) => void;
}

export default function SeccionSalidas({ role, nombreUsuario, movimientos, onRegistrarSalida, onEliminarMovimiento, onEditarMovimiento }: Props) {
  const hoyYYYYMMDD = new Date().toISOString().split('T')[0];

  const [fecha, setFecha] = useState(hoyYYYYMMDD);
  const [categoriaGasto, setCategoriaGasto] = useState('Delivery');
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [metodoPago, setMetodoPago] = useState('Efectivo');

  // ESTADO PARA EDICIÓN DE GASTOS (SOLO ADMIN)
  const [idEditando, setIdEditando] = useState<number | null>(null);

  const salidasTotales = movimientos.filter(m => m.tipo === 'salida').reduce((acc, m) => acc + m.monto, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monto || parseFloat(monto) <= 0 || !concepto.trim()) return;

    const partesFecha = fecha.split('-');
    const fechaFormateada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`;

    const objetoDatos = {
      tipo: 'salida',
      categoriaGasto,
      concepto,
      monto: parseFloat(monto),
      metodoPago,
      usuario: nombreUsuario,
      fecha: fechaFormateada,
      hora: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    };

    if (idEditando !== null) {
      onEditarMovimiento?.(idEditando, objetoDatos);
      setIdEditando(null);
    } else {
      onRegistrarSalida(objetoDatos);
      alert('✅ Salida o gasto registrado correctamente.');
    }

    setConcepto('');
    setMonto('');
  };

  const iniciarEdicion = (m: any) => {
    setIdEditando(m.id);
    setCategoriaGasto(m.categoriaGasto || 'Delivery');
    setConcepto(m.concepto || '');
    setMonto(m.monto ? m.monto.toString() : '');
    setMetodoPago(m.metodoPago || 'Efectivo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* SI ES TRABAJADOR: VE EL FORMULARIO DE REGISTRO DE SALIDAS */}
      {role === 'TRABAJADOR' && (
        <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '20px', padding: '25px' }}>
          <h2 style={{ color: '#f87171', margin: '0 0 5px 0', fontSize: '20px' }}>🔴 REGISTRAR SALIDA O GASTO DE CAJA</h2>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '20px' }}>Complete los datos para justificar la salida de dinero.</p>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#f87171', marginBottom: '6px', fontWeight: 'bold' }}>📅 FECHA</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#f87171', marginBottom: '6px', fontWeight: 'bold' }}>🏷️ CATEGORÍA DE GASTO</label>
              <select value={categoriaGasto} onChange={(e) => setCategoriaGasto(e.target.value)} style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}>
                <option value="Delivery">📦 Delivery / Envíos</option>
                <option value="Insumos">🛍️ Insumos / Empaques</option>
                <option value="Proveedor">🤝 Pago a Proveedor</option>
                <option value="Otros">💡 Otros Gastos</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#f87171', marginBottom: '6px', fontWeight: 'bold' }}>💳 MÉTODO DE SALIDA</label>
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}>
                <option value="Efectivo">💵 Efectivo de Caja</option>
                <option value="Yape / Plin">📱 Yape / Plin</option>
                <option value="Transferencia BCP/BBVA">🏦 Transferencia Bancaria</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#f87171', marginBottom: '6px', fontWeight: 'bold' }}>📝 MOTIVO / DESCRIPCIÓN</label>
              <input type="text" placeholder="Ej. Pago de envío Olva Courier a provincia" value={concepto} onChange={(e) => setConcepto(e.target.value)} required style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#f87171', marginBottom: '6px', fontWeight: 'bold' }}>💰 MONTO RETIRADO (S/)</label>
                <input type="number" step="0.01" placeholder="0.00" value={monto} onChange={(e) => setMonto(e.target.value)} required style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #ef4444', color: '#fff', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', height: '45px' }}>
                ⚡ REGISTRAR SALIDA EN CAJA
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SI ES ADMIN Y ACTIVA LA EDICIÓN: VE EL FORMULARIO DE EDICIÓN DE GASTO */}
      {role === 'ADMIN' && idEditando !== null && (
        <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid #eab308', borderRadius: '20px', padding: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <h2 style={{ color: '#eab308', margin: '0 0 5px 0', fontSize: '20px' }}>✏️ EDITAR SALIDA / GASTO</h2>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>Modifique los campos necesarios y guarde los cambios.</p>
            </div>
            <button onClick={() => { setIdEditando(null); setConcepto(''); setMonto(''); }} style={{ background: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>
              Cancelar Edición
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#f87171', marginBottom: '6px', fontWeight: 'bold' }}>📅 FECHA</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#f87171', marginBottom: '6px', fontWeight: 'bold' }}>🏷️ CATEGORÍA DE GASTO</label>
              <select value={categoriaGasto} onChange={(e) => setCategoriaGasto(e.target.value)} style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}>
                <option value="Delivery">📦 Delivery / Envíos</option>
                <option value="Insumos">🛍️ Insumos / Empaques</option>
                <option value="Proveedor">🤝 Pago a Proveedor</option>
                <option value="Otros">💡 Otros Gastos</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#f87171', marginBottom: '6px', fontWeight: 'bold' }}>💳 MÉTODO DE SALIDA</label>
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}>
                <option value="Efectivo">💵 Efectivo de Caja</option>
                <option value="Yape / Plin">📱 Yape / Plin</option>
                <option value="Transferencia BCP/BBVA">🏦 Transferencia Bancaria</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '11px', color: '#f87171', marginBottom: '6px', fontWeight: 'bold' }}>📝 MOTIVO / DESCRIPCIÓN</label>
              <input type="text" placeholder="Ej. Pago de envío Olva Courier a provincia" value={concepto} onChange={(e) => setConcepto(e.target.value)} required style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#f87171', marginBottom: '6px', fontWeight: 'bold' }}>💰 MONTO RETIRADO (S/)</label>
                <input type="number" step="0.01" placeholder="0.00" value={monto} onChange={(e) => setMonto(e.target.value)} required style={{ width: '100%', padding: '11px', background: '#0f172a', border: '1px solid #ef4444', color: '#fff', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '12px', background: '#eab308', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', height: '45px' }}>
                💾 GUARDAR CAMBIOS DE SALIDA
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLA DE MONITOREO DE SALIDAS (SOLO ADMIN) */}
      {role === 'ADMIN' && (
        <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '20px', padding: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ color: '#f87171', margin: 0, fontSize: '20px' }}>🔴 MONITOREO DE SALIDAS (GASTOS)</h2>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Supervisión detallada de salidas de caja.</span>
            </div>
            <span style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#f87171', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>
              Total Gastos: S/ {salidasTotales.toFixed(2)}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', minWidth: '750px' }}>
              <thead>
                <tr style={{ background: '#0f172a', color: '#f87171' }}>
                  <th style={{ padding: '10px' }}>FECHA / HORA</th>
                  <th style={{ padding: '10px' }}>CATEGORÍA</th>
                  <th style={{ padding: '10px' }}>DESCRIPCIÓN / MOTIVO</th>
                  <th style={{ padding: '10px' }}>MÉTODO</th>
                  <th style={{ padding: '10px' }}>REGISTRADO POR</th>
                  <th style={{ padding: '10px' }}>MONTO</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>ACCIONES (ADMIN)</th>
                </tr>
              </thead>
              <tbody>
                {movimientos.filter(m => m.tipo === 'salida').map((m) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '10px', color: '#94a3b8' }}>{m.fecha}<br/><small>{m.hora}</small></td>
                    <td style={{ padding: '10px', fontWeight: 'bold', color: '#fca5a5' }}>{m.categoriaGasto}</td>
                    <td style={{ padding: '10px', color: '#fff' }}>{m.concepto}</td>
                    <td style={{ padding: '10px' }}>{m.metodoPago}</td>
                    <td style={{ padding: '10px', color: '#c084fc' }}>👤 {m.usuario}</td>
                    <td style={{ padding: '10px', color: '#f87171', fontWeight: 'bold' }}>- S/ {m.monto.toFixed(2)}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                        <button 
                          onClick={() => iniciarEdicion(m)}
                          style={{ background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', color: '#93c5fd', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                        >
                          ✏️ Editar
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`¿Estás seguro de eliminar esta salida por S/ ${m.monto.toFixed(2)}?`)) {
                              onEliminarMovimiento?.(m.id);
                            }
                          }}
                          style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}