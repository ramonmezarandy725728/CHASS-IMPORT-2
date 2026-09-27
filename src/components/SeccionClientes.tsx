import React, { useState } from 'react';

interface Props {
  clientes: any[];
  onAgregarCliente: (nuevo: any) => void;
  onEditarCliente: (id: number, clienteEditado: any) => void;
  onEliminarCliente: (id: number) => void;
}

export default function SeccionClientes({ clientes, onAgregarCliente, onEditarCliente, onEliminarCliente }: Props) {
  const [nombre, setNombre] = useState('');
  const [tipoCliente, setTipoCliente] = useState('Punto de Venta');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');

  // Estado para la edición
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    if (editandoId !== null) {
      // Guardar cambios del cliente editado
      onEditarCliente(editandoId, {
        nombre,
        tipoCliente,
        dni: dni || '-',
        telefono: telefono || '-',
        direccion: direccion || '-'
      });
      alert('✅ Cliente actualizado con éxito.');
      setEditandoId(null);
    } else {
      // Agregar nuevo cliente
      onAgregarCliente({
        id: Date.now(),
        nombre,
        tipoCliente,
        dni: dni || '-',
        telefono: telefono || '-',
        direccion: direccion || '-'
      });
      alert('✅ Cliente o Punto de Venta guardado correctamente.');
    }

    limpiarFormulario();
  };

  const iniciarEdicion = (cliente: any) => {
    setEditandoId(cliente.id);
    setNombre(cliente.nombre);
    setTipoCliente(cliente.tipoCliente || 'Punto de Venta');
    setDni(cliente.dni === '-' ? '' : cliente.dni);
    setTelefono(cliente.telefono === '-' ? '' : cliente.telefono);
    setDireccion(cliente.direccion === '-' ? '' : cliente.direccion);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre('');
    setDni('');
    setTelefono('');
    setDireccion('');
    setTipoCliente('Punto de Venta');
  };

  const handleEliminar = (id: number, nombreCliente: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar a "${nombreCliente}" del directorio?`)) {
      onEliminarCliente(id);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* FORMULARIO DE REGISTRO / EDICIÓN */}
      <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: editandoId ? '1px solid #fde047' : '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ color: editandoId ? '#fde047' : '#38bdf8', margin: '0 0 5px 0', fontSize: '18px' }}>
              {editandoId ? '✏️ EDITAR CLIENTE / PUNTO' : '👥 DIRECTORIO DE CLIENTES Y PUNTOS DE VENTA'}
            </h2>
            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
              {editandoId ? 'Modifique los campos y guarde los cambios.' : 'Registre clientes frecuentes y tiendas aliadas para asociar a las ventas.'}
            </p>
          </div>
          {editandoId && (
            <button onClick={cancelarEdicion} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold' }}>
              ✕ Cancelar Edición
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#60a5fa', marginBottom: '4px' }}>TIPO DE REGISTRO</label>
            <select value={tipoCliente} onChange={e => setTipoCliente(e.target.value)} style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }}>
              <option value="Punto de Venta">🏪 Punto de Venta / Consignación</option>
              <option value="Cliente Frecuente">👤 Cliente Frecuente</option>
              <option value="Distribuidor">📦 Distribuidor Mayorista</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#60a5fa', marginBottom: '4px' }}>NOMBRE / RAZÓN SOCIAL</label>
            <input type="text" placeholder="Ej. Tienda Miraflores / Juan Pérez" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#60a5fa', marginBottom: '4px' }}>DNI / RUC</label>
            <input type="text" placeholder="Ej. 20601234567" value={dni} onChange={e => setDni(e.target.value)} style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#60a5fa', marginBottom: '4px' }}>TELÉFONO / WHATSAPP</label>
            <input type="text" placeholder="Ej. 912345678" value={telefono} onChange={e => setTelefono(e.target.value)} style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '11px', color: '#60a5fa', marginBottom: '4px' }}>DIRECCIÓN / UBICACIÓN</label>
            <input type="text" placeholder="Ej. Av. Larco 123 - Miraflores" value={direccion} onChange={e => setDireccion(e.target.value)} style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', fontSize: '12px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '5px' }}>
            <button type="submit" style={{ width: '100%', padding: '12px', background: editandoId ? '#eab308' : '#3b82f6', color: editandoId ? '#000' : '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
              {editandoId ? '💾 GUARDAR CAMBIOS' : '+ AGREGAR AL DIRECTORIO'}
            </button>
          </div>
        </form>
      </div>

      {/* LISTADO DE CLIENTES CON BOTONES DE ACCIÓN */}
      <div style={{ background: 'rgba(8, 12, 24, 0.9)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '20px', padding: '20px' }}>
        <h3 style={{ color: '#fff', margin: '0 0 15px 0', fontSize: '15px' }}>📋 LISTA DE CLIENTES REGISTRADOS ({clientes.length})</h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', minWidth: '650px' }}>
            <thead>
              <tr style={{ background: '#0f172a', color: '#60a5fa' }}>
                <th style={{ padding: '10px' }}>TIPO</th>
                <th style={{ padding: '10px' }}>NOMBRE / RAZÓN SOCIAL</th>
                <th style={{ padding: '10px' }}>DNI / RUC</th>
                <th style={{ padding: '10px' }}>TELÉFONO</th>
                <th style={{ padding: '10px' }}>DIRECCIÓN</th>
                <th style={{ padding: '10px', textAlign: 'center' }}>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '10px' }}>
                    <span style={{ 
                      padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold',
                      background: c.tipoCliente === 'Punto de Venta' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                      color: c.tipoCliente === 'Punto de Venta' ? '#38bdf8' : '#c084fc',
                      border: c.tipoCliente === 'Punto de Venta' ? '1px solid #38bdf8' : '1px solid #a855f7'
                    }}>
                      {c.tipoCliente || 'Punto de Venta'}
                    </span>
                  </td>
                  <td style={{ padding: '10px', color: '#fff', fontWeight: 'bold' }}>{c.nombre}</td>
                  <td style={{ padding: '10px', color: '#94a3b8' }}>{c.dni}</td>
                  <td style={{ padding: '10px', color: '#4ade80' }}>{c.telefono}</td>
                  <td style={{ padding: '10px', color: '#94a3b8' }}>{c.direccion || '-'}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <button onClick={() => iniciarEdicion(c)} style={{ background: 'rgba(234, 179, 8, 0.2)', border: '1px solid #eab308', color: '#fde047', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
                        ✏️ Editar
                      </button>
                      <button onClick={() => handleEliminar(c.id, c.nombre)} style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>
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

    </div>
  );
}