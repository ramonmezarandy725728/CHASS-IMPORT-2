// src/components/SeccionBitacora.tsx
import { useState } from 'react';

interface Props {
  role: 'ADMIN' | 'TRABAJADOR';
  bitacora: any[];
  onResponder: (id: number, respuesta: string) => void;
  onCerrarObservacion?: (id: number) => void;
}

export default function SeccionBitacora({ role, bitacora, onResponder, onCerrarObservacion }: Props) {
  const [respuestas, setRespuestas] = useState<{ [key: number]: string }>({});

  const handleTextChange = (id: number, text: string) => {
    setRespuestas({ ...respuestas, [id]: text });
  };

  const handleEnviar = (id: number) => {
    const texto = respuestas[id];
    if (!texto || !texto.trim()) {
      alert('⚠️ Por favor ingrese su justificación antes de enviar.');
      return;
    }
    onResponder(id, texto.trim());
    setRespuestas({ ...respuestas, [id]: '' });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* CABECERA */}
      <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(244, 114, 182, 0.3)', borderRadius: '20px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ color: '#f472b6', margin: '0 0 5px 0', fontSize: '18px' }}>📝 BITÁCORA DE DISCORDANCIAS Y DESCARGOS</h2>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
              {role === 'ADMIN' 
                ? 'Monitoreo de observaciones por faltante en conteo de caja y respuestas del personal.' 
                : 'Expediente de observaciones. Por favor revise y justifique cualquier diferencia registrada en caja.'}
            </p>
          </div>
          <span style={{ background: 'rgba(244, 114, 182, 0.15)', border: '1px solid #f472b6', color: '#f472b6', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 'bold' }}>
            Total Registros: {bitacora.length}
          </span>
        </div>
      </div>

      {/* LISTADO DE OBSERVACIONES */}
      {bitacora.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {bitacora.map((item) => {
            const estado = item.estado || (item.empleadoRespuesta ? 'JUSTIFICADO' : 'PENDIENTE');

            return (
              <div 
                key={item.id} 
                style={{ 
                  background: 'rgba(15, 23, 42, 0.9)', 
                  border: estado === 'RESUELTO' ? '1px solid #22c55e' : estado === 'JUSTIFICADO' ? '1px solid #eab308' : '1px solid #ef4444', 
                  borderRadius: '16px', 
                  padding: '20px' 
                }}
              >
                {/* ENCABEZADO TARJETA */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#94a3b8', display: 'block' }}>SEMANA {item.semana} — {item.fechaHora || 'Fecha no registrada'}</span>
                    <strong style={{ color: '#ef4444', fontSize: '16px' }}>🚨 DESCUADRE: -S/ {Number(item.montoFaltante || 0).toFixed(2)}</strong>
                  </div>

                  <span style={{ 
                    padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold',
                    background: estado === 'RESUELTO' ? 'rgba(34, 197, 94, 0.2)' : estado === 'JUSTIFICADO' ? 'rgba(234, 179, 8, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: estado === 'RESUELTO' ? '#4ade80' : estado === 'JUSTIFICADO' ? '#fde047' : '#fca5a5',
                    border: estado === 'RESUELTO' ? '1px solid #22c55e' : estado === 'JUSTIFICADO' ? '1px solid #eab308' : '1px solid #ef4444'
                  }}>
                    {estado === 'RESUELTO' ? '🟢 RESUELTO' : estado === 'JUSTIFICADO' ? '🟡 DESCARGO ENVIADO' : '🔴 PENDIENTE DE DESCARGO'}
                  </span>
                </div>

                {/* NOTA DEL ADMINISTRADOR */}
                <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>👤 OBSERVACIÓN DEL ADMINISTRADOR:</span>
                  <p style={{ margin: 0, color: '#fff', fontSize: '12px' }}>"{item.adminNota || 'Falta dinero en el conteo de efectivo.'}"</p>
                </div>

                {/* DESCARGO DEL EMPLEADO / CAMPOS */}
                {item.empleadoRespuesta ? (
                  <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px' }}>
                    <span style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 'bold', display: 'block', marginBottom: '2px' }}>💬 DESCARGO / JUSTIFICACIÓN DEL TRABAJADOR ({item.empleadoNombre || 'María'}):</span>
                    <p style={{ margin: 0, color: '#60a5fa', fontSize: '12px' }}>"{item.empleadoRespuesta}"</p>
                  </div>
                ) : (
                  role === 'TRABAJADOR' && (
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '11px', color: '#fde047', fontWeight: 'bold' }}>✍️ INGRESE SU DESCARGO O JUSTIFICACIÓN:</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <input 
                          type="text" 
                          placeholder="Ej. El cliente pagó con billete falso / Se dio vuelto de más por confusión de cambio." 
                          value={respuestas[item.id] || ''} 
                          onChange={(e) => handleTextChange(item.id, e.target.value)} 
                          style={{ flex: 1, padding: '10px', background: '#090d16', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '12px', minWidth: '220px' }} 
                        />
                        <button 
                          onClick={() => handleEnviar(item.id)} 
                          style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                          📩 ENVIAR DESCARGO
                        </button>
                      </div>
                    </div>
                  )
                )}

                {/* ACCIÓN ADMIN PARA CERRAR CASO */}
                {role === 'ADMIN' && estado !== 'RESUELTO' && onCerrarObservacion && (
                  <div style={{ marginTop: '12px', textAlign: 'right' }}>
                    <button 
                      onClick={() => onCerrarObservacion(item.id)} 
                      style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#4ade80', padding: '6px 12px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      ✓ APROBAR Y CERRAR OBSERVACIÓN
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      ) : (
        /* VISTA SIN CASOS */
        <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '30px', textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '10px' }}>✨</div>
          <h3 style={{ color: '#fff', margin: '0 0 5px 0', fontSize: '15px' }}>SIN DISCORDANCIAS NI OBSERVACIONES</h3>
          <p style={{ color: '#94a3b8', fontSize: '11px', margin: 0 }}>
            La caja se encuentra perfectamente cuadrada o no se han enviado reportes de faltante.
          </p>
        </div>
      )}

    </div>
  );
}