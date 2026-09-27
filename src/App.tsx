// src/App.tsx - CHASS IMPORT CON SUPABASE & ELIMINAR MOVIMIENTOS Y SEMANAS
import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ModalOperacion from './components/ModalOperacion';
import SeccionInicio from './components/SeccionInicio';
import SeccionEntradas from './components/SeccionEntradas';
import SeccionSalidas from './components/SeccionSalidas';
import SeccionClientes from './components/SeccionClientes';
import SeccionHistorial from './components/SeccionHistorial';
import SeccionBitacora from './components/SeccionBitacora';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('randy');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'ADMIN' | 'TRABAJADOR'>('TRABAJADOR');
  const [nombreUsuario, setNombreUsuario] = useState<string>('María');

  const [seccionActiva, setSeccionActiva] = useState<string>('entradas');
  const [numeroSemanaActual, setNumeroSemanaActual] = useState<number>(4);
  const [movimientoModal, setMovimientoModal] = useState<any | null>(null);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState<boolean>(false);

  // ESTADOS DE DATOS DESDE SUPABASE
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [bitacora, setBitacora] = useState<any[]>([]);
  
  const [historialSemanas, setHistorialSemanas] = useState<any[]>([
    {
      numeroSemana: 3,
      fechaCierre: '20/09/2026',
      ingresos: 1250.00,
      salidas: 280.00,
      balance: 970.00,
      movimientos: []
    }
  ]);

  // CARGAR DATOS DESDE SUPABASE AL INICIAR
  useEffect(() => {
    cargarDatosSupabase();
  }, []);

  const cargarDatosSupabase = async () => {
    try {
      // 1. Cargar Movimientos
      const { data: movData, error: movError } = await supabase.from('movimientos').select('*').order('id', { ascending: false });
      if (!movError && movData) {
        setMovimientos(movData.map(m => ({
          ...m,
          tipoVenta: m.tipo_venta,
          modeloIphone: m.modelo_iphone,
          tipoCase: m.tipo_case,
          categoriaGasto: m.categoria_gasto,
          metodoPago: m.metodo_pago,
          numOperacion: m.num_operacion
        })));
      }

      // 2. Cargar Clientes
      const { data: cliData, error: cliError } = await supabase.from('clientes').select('*').order('id', { ascending: false });
      if (!cliError && cliData) {
        setClientes(cliData.map(c => ({
          ...c,
          tipoCliente: c.tipo_cliente
        })));
      }

      // 3. Cargar Bitácora
      const { data: bitData, error: bitError } = await supabase.from('bitacora').select('*').order('id', { ascending: false });
      if (!bitError && bitData) {
        setBitacora(bitData.map(b => ({
          ...b,
          fechaHora: b.fecha_hora,
          montoFaltante: b.monto_faltante,
          adminNota: b.admin_nota,
          empleadoRespuesta: b.empleado_respuesta,
          empleadoNombre: b.empleado_nombre
        })));
      }
    } catch (err) {
      console.error('Error cargando datos de Supabase:', err);
    }
  };

  // AUTENTICACIÓN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === 'randy' && password === 'admin123') {
      setRole('ADMIN'); setNombreUsuario('Randy Ramon Meza'); setIsAuthenticated(true);
    } else if (username.toLowerCase() === 'maria' && password === 'maria123') {
      setRole('TRABAJADOR'); setNombreUsuario('María'); setIsAuthenticated(true);
    } else {
      alert('⚠️ Credenciales incorrectas.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false); setUsername(''); setPassword('');
  };

  // AGREGAR MOVIMIENTO (ENTRADA / SALIDA)
  const handleAgregarMovimiento = async (nuevo: any) => {
    try {
      const objetoDB = {
        tipo: nuevo.tipo,
        tipo_venta: nuevo.tipoVenta || null,
        cliente: nuevo.cliente || null,
        modelo_iphone: nuevo.modeloIphone || null,
        tipo_case: nuevo.tipoCase || null,
        cantidad: nuevo.cantidad || null,
        categoria_gasto: nuevo.categoriaGasto || null,
        concepto: nuevo.concepto,
        monto: nuevo.monto,
        metodo_pago: nuevo.metodoPago,
        num_operacion: nuevo.numOperacion || null,
        usuario: nuevo.usuario,
        fecha: nuevo.fecha,
        hora: nuevo.hora
      };

      const { data, error } = await supabase.from('movimientos').insert([objetoDB]).select();
      if (error) {
        alert('⚠️ Error al guardar en Supabase: ' + error.message);
        return;
      }

      if (data && data[0]) {
        const itemCreado = {
          ...data[0],
          tipoVenta: data[0].tipo_venta,
          modeloIphone: data[0].modelo_iphone,
          tipoCase: data[0].tipo_case,
          categoriaGasto: data[0].categoria_gasto,
          metodoPago: data[0].metodo_pago,
          numOperacion: data[0].num_operacion
        };
        setMovimientos([itemCreado, ...movimientos]);
      }
    } catch (err) {
      console.error('Excepción al registrar movimiento:', err);
    }
  };

  // ELIMINAR MOVIMIENTO (SOLO ADMIN)
  const handleEliminarMovimiento = async (id: number) => {
    try {
      const { error } = await supabase.from('movimientos').delete().eq('id', id);
      if (error) {
        alert('⚠️ Error al eliminar en Supabase: ' + error.message);
        return;
      }
      setMovimientos(movimientos.filter(m => m.id !== id));
      alert('🗑️ Registro eliminado correctamente de la base de datos.');
    } catch (err) {
      console.error('Excepción al eliminar movimiento:', err);
    }
  };

  // ELIMINAR SEMANA DEL HISTORIAL (SOLO ADMIN)
  const handleEliminarSemana = (numeroSemana: number) => {
    setHistorialSemanas(historialSemanas.filter(s => s.numeroSemana !== numeroSemana));
    alert(`🗑️ El historial de la Semana ${numeroSemana} fue eliminado.`);
  };

  // AGREGAR CLIENTE
  const handleAgregarCliente = async (nuevo: any) => {
    try {
      const objetoDB = {
        nombre: nuevo.nombre,
        tipo_cliente: nuevo.tipoCliente,
        dni: nuevo.dni || null,
        telefono: nuevo.telefono || null,
        direccion: nuevo.direccion || null
      };

      const { data, error } = await supabase.from('clientes').insert([objetoDB]).select();
      if (error) {
        alert('⚠️ Error al guardar cliente: ' + error.message);
        return;
      }

      if (data && data[0]) {
        const cliCreado = { ...data[0], tipoCliente: data[0].tipo_cliente };
        setClientes([cliCreado, ...clientes]);
      }
    } catch (err) {
      console.error('Excepción al registrar cliente:', err);
    }
  };

  const handleEditarCliente = async (id: number, clienteEditado: any) => {
    try {
      const objetoDB = {
        nombre: clienteEditado.nombre,
        tipo_cliente: clienteEditado.tipoCliente,
        dni: clienteEditado.dni,
        telefono: clienteEditado.telefono,
        direccion: clienteEditado.direccion
      };

      const { error } = await supabase.from('clientes').update(objetoDB).eq('id', id);
      if (!error) {
        setClientes(clientes.map(c => c.id === id ? { ...c, ...clienteEditado } : c));
      }
    } catch (err) {
      console.error('Error al editar cliente:', err);
    }
  };

  const handleEliminarCliente = async (id: number) => {
    try {
      const { error } = await supabase.from('clientes').delete().eq('id', id);
      if (!error) {
        setClientes(clientes.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Error al eliminar cliente:', err);
    }
  };

  const handleRegistrarDiscordancia = async (monto: number, nota: string) => {
    try {
      const objetoDB = {
        semana: numeroSemanaActual,
        fecha_hora: new Date().toLocaleString('es-PE'),
        monto_faltante: monto,
        admin_nota: nota || 'Se requiere revisión del efectivo en caja.',
        empleado_respuesta: '',
        estado: 'PENDIENTE',
        empleado_nombre: 'María'
      };

      const { data, error } = await supabase.from('bitacora').insert([objetoDB]).select();
      if (!error && data && data[0]) {
        const itemBitacora = {
          ...data[0],
          fechaHora: data[0].fecha_hora,
          montoFaltante: data[0].monto_faltante,
          adminNota: data[0].admin_nota,
          empleadoRespuesta: data[0].empleado_respuesta,
          empleadoNombre: data[0].empleado_nombre
        };
        setBitacora([itemBitacora, ...bitacora]);
        alert('🚨 Discordancia registrada en la bitácora de Supabase.');
      }
    } catch (err) {
      console.error('Error al registrar discordancia:', err);
    }
  };

  const handleResponderBitacora = async (id: number, respuesta: string) => {
    try {
      const { error } = await supabase.from('bitacora').update({ empleado_respuesta: respuesta, estado: 'JUSTIFICADO' }).eq('id', id);
      if (!error) {
        setBitacora(bitacora.map(b => b.id === id ? { ...b, empleadoRespuesta: respuesta, estado: 'JUSTIFICADO' } : b));
        alert('✅ Justificación guardada en la nube.');
      }
    } catch (err) {
      console.error('Error al responder bitácora:', err);
    }
  };

  const handleCerrarObservacion = async (id: number) => {
    try {
      const { error } = await supabase.from('bitacora').update({ estado: 'RESUELTO' }).eq('id', id);
      if (!error) {
        setBitacora(bitacora.map(b => b.id === id ? { ...b, estado: 'RESUELTO' } : b));
        alert('🟢 Observación aprobada y caso cerrado.');
      }
    } catch (err) {
      console.error('Error al cerrar observación:', err);
    }
  };

  const handleCierreSemana = () => {
    if (confirm(`¿Desea cerrar la Semana ${numeroSemanaActual}? Se guardará el consolidado.`)) {
      const ingresos = movimientos.filter(m => m.tipo === 'ingreso').reduce((acc, m) => acc + m.monto, 0);
      const salidas = movimientos.filter(m => m.tipo === 'salida').reduce((acc, m) => acc + m.monto, 0);

      const nuevaSemana = {
        numeroSemana: numeroSemanaActual,
        fechaCierre: new Date().toLocaleDateString('es-PE'),
        ingresos,
        salidas,
        balance: ingresos - salidas,
        movimientos: [...movimientos]
      };

      setHistorialSemanas([nuevaSemana, ...historialSemanas]);
      setNumeroSemanaActual(numeroSemanaActual + 1);
      alert(`🔒 Semana ${numeroSemanaActual} cerrada con éxito.`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#03050c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ background: '#080c18', border: '1px solid #3b82f6', borderRadius: '16px', padding: '35px', width: '320px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', margin: '0 0 5px 0' }}>CHASS IMPORT</h2>
          <span style={{ color: '#38bdf8', fontSize: '10px', display: 'block', marginBottom: '20px', fontWeight: 'bold' }}>CONTROL DE CAJA (SUPABASE)</span>
          <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#3b82f6', border: 'none', color: '#fff', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>INGRESAR</button>
        </form>
      </div>
    );
  }

  const cambiarSeccion = (seccion: string) => {
    setSeccionActiva(seccion);
    setMenuMovilAbierto(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#03050c', color: '#f8fafc', fontFamily: 'sans-serif', position: 'relative' }}>
      
      <ModalOperacion movimiento={movimientoModal} onClose={() => setMovimientoModal(null)} />

      {/* BOTÓN FLOTANTE DE 3 RAYITAS PARA CELULAR */}
      <div style={{ position: 'fixed', top: '15px', left: '15px', zIndex: 1100, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button 
          onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
          style={{ background: '#0f172a', border: '1px solid #3b82f6', color: '#fff', padding: '10px 14px', borderRadius: '8px', fontSize: '18px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', fontWeight: 'bold' }}
        >
          {menuMovilAbierto ? '✕' : '☰'}
        </button>
      </div>

      {menuMovilAbierto && (
        <div onClick={() => setMenuMovilAbierto(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 999, backdropFilter: 'blur(3px)' }} />
      )}

      {/* BARRA LATERAL */}
      <aside style={{ 
        position: 'fixed', top: 0, left: menuMovilAbierto ? 0 : '-300px', width: '280px', height: '100vh',
        backgroundColor: '#060912', borderRight: '1px solid rgba(59, 130, 246, 0.2)', padding: '25px 20px', 
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box',
        zIndex: 1000, transition: 'left 0.3s ease-in-out', boxShadow: menuMovilAbierto ? '5px 0 25px rgba(0,0,0,0.8)' : 'none'
      }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '35px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#ffffff' }}>CHASS IMPORT</h2>
              <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 'bold', display: 'block' }}>☁️ SUPABASE CONECTADO</span>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button onClick={() => cambiarSeccion('inicio')} style={{ padding: '12px', background: seccionActiva === 'inicio' ? 'rgba(239, 68, 68, 0.2)' : 'transparent', border: seccionActiva === 'inicio' ? '1px solid #ef4444' : '1px solid transparent', color: '#fff', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
              🏢 1. Inicio — Caja
            </button>
            <button onClick={() => cambiarSeccion('entradas')} style={{ padding: '12px', background: seccionActiva === 'entradas' ? 'rgba(239, 68, 68, 0.2)' : 'transparent', border: seccionActiva === 'entradas' ? '1px solid #ef4444' : '1px solid transparent', color: '#fff', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
              🟢 2. Entradas {role === 'ADMIN' ? '(Monitoreo)' : '(Registro)'}
            </button>
            <button onClick={() => cambiarSeccion('salidas')} style={{ padding: '12px', background: seccionActiva === 'salidas' ? 'rgba(239, 68, 68, 0.2)' : 'transparent', border: seccionActiva === 'salidas' ? '1px solid #ef4444' : '1px solid transparent', color: '#fff', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
              🔴 3. Salidas {role === 'ADMIN' ? '(Monitoreo)' : '(Registro)'}
            </button>
            <button onClick={() => cambiarSeccion('clientes')} style={{ padding: '12px', background: seccionActiva === 'clientes' ? 'rgba(239, 68, 68, 0.2)' : 'transparent', border: seccionActiva === 'clientes' ? '1px solid #ef4444' : '1px solid transparent', color: '#fff', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
              👥 4. Clientes / Puntos
            </button>
            
            {role === 'ADMIN' && (
              <button onClick={() => cambiarSeccion('registros')} style={{ padding: '12px', background: seccionActiva === 'registros' ? 'rgba(239, 68, 68, 0.2)' : 'transparent', border: seccionActiva === 'registros' ? '1px solid #ef4444' : '1px solid transparent', color: '#fff', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
                📅 5. Historial Semanas
              </button>
            )}

            <button onClick={() => cambiarSeccion('bitacora')} style={{ padding: '12px', background: seccionActiva === 'bitacora' ? 'rgba(239, 68, 68, 0.2)' : 'transparent', border: seccionActiva === 'bitacora' ? '1px solid #ef4444' : '1px solid transparent', color: '#fff', borderRadius: '8px', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
              📝 {role === 'ADMIN' ? '6. Bitácora & Descargos' : '5. Bitácora & Descargos'}
            </button>
          </nav>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
          <div style={{ fontSize: '11px', color: '#60a5fa', marginBottom: '8px' }}>ROL: <strong style={{ color: role === 'ADMIN' ? '#ef4444' : '#22c55e' }}>{role}</strong> ({nombreUsuario})</div>
          <button onClick={handleLogout} style={{ width: '100%', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>CERRAR SESIÓN</button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main style={{ flex: 1, padding: '75px 20px 25px 20px', overflowY: 'auto', boxSizing: 'border-box', width: '100%' }}>
        {seccionActiva === 'inicio' && <SeccionInicio role={role} numeroSemanaActual={numeroSemanaActual} movimientos={movimientos} onCierreSemana={handleCierreSemana} onRegistrarDiscordancia={handleRegistrarDiscordancia} />}
        {seccionActiva === 'entradas' && (
          <SeccionEntradas 
            role={role} 
            nombreUsuario={nombreUsuario} 
            movimientos={movimientos} 
            clientes={clientes} 
            onRegistrarIngreso={handleAgregarMovimiento} 
            onAbrirModal={m => setMovimientoModal(m)} 
            onEliminarMovimiento={handleEliminarMovimiento}
          />
        )}
        {seccionActiva === 'salidas' && <SeccionSalidas role={role} nombreUsuario={nombreUsuario} movimientos={movimientos} onRegistrarSalida={handleAgregarMovimiento} />}
        {seccionActiva === 'clientes' && (
          <SeccionClientes 
            clientes={clientes} 
            onAgregarCliente={handleAgregarCliente}
            onEditarCliente={handleEditarCliente}
            onEliminarCliente={handleEliminarCliente}
          />
        )}
        {seccionActiva === 'registros' && role === 'ADMIN' && (
          <SeccionHistorial 
            historialSemanas={historialSemanas} 
            onEliminarSemana={handleEliminarSemana}
          />
        )}
        {seccionActiva === 'bitacora' && (
          <SeccionBitacora 
            role={role} 
            bitacora={bitacora} 
            onResponder={handleResponderBitacora}
            onCerrarObservacion={handleCerrarObservacion}
          />
        )}
      </main>
    </div>
  );
}