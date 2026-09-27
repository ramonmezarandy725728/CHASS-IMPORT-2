// src/App.tsx - CHASS IMPORT CON MENÚ RESPONSIVE (3 RAYITAS)
import { useState } from 'react';
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

  // ESTADO PARA CONTROLAR EL MENÚ DESPLEGABLE EN CELULAR (3 RAYITAS)
  const [menuMovilAbierto, setMenuMovilAbierto] = useState<boolean>(false);

  // BASE DE DATOS LOCAL EN VIVO
  const [movimientos, setMovimientos] = useState<any[]>([
    { id: 1, tipo: 'ingreso', tipoVenta: 'Venta Tienda', cliente: 'Cliente Ocasional', modeloIphone: 'iPhone 15 Pro Max', tipoCase: 'Magsafe Transparente', cantidad: 1, concepto: 'Case Magsafe + Mica', monto: 45.00, metodoPago: 'Yape / Plin', numOperacion: '982134', usuario: 'María', fecha: '27/09/2026', hora: '10:15' },
    { id: 2, tipo: 'ingreso', tipoVenta: 'Punto de Venta', cliente: 'Punto Miraflores', modeloIphone: 'Varios (Lote)', tipoCase: 'Silicona Case', cantidad: 10, concepto: 'Lote de 10 Cases', monto: 180.00, metodoPago: 'Transferencia BCP/BBVA', numOperacion: '004921', usuario: 'María', fecha: '27/09/2026', hora: '11:30' },
    { id: 3, tipo: 'salida', categoriaGasto: 'Delivery', concepto: 'Envío de pedido Miraflores por Olva', monto: 15.00, metodoPago: 'Efectivo', usuario: 'María', fecha: '27/09/2026', hora: '12:00' }
  ]);
  
  const [clientes, setClientes] = useState<any[]>([
    { id: 1, nombre: 'Punto Miraflores (Tienda Aliada)', tipoCliente: 'Punto de Venta', dni: '20601234567', telefono: '912345678', direccion: 'Av. Larco 123' },
    { id: 2, nombre: 'Juan Pérez (Cliente Frecuente)', tipoCliente: 'Cliente Frecuente', dni: '72572819', telefono: '987654321', direccion: 'Calle Las Flores 456' }
  ]);

  const [bitacora, setBitacora] = useState<any[]>([
    {
      id: 1,
      semana: 4,
      fechaHora: '27/09/2026 18:30',
      montoFaltante: 20.00,
      adminNota: 'Falta dinero en el conteo de efectivo al momento del arqueo de caja.',
      empleadoRespuesta: '',
      estado: 'PENDIENTE',
      empleadoNombre: 'María'
    }
  ]);

  const [historialSemanas, setHistorialSemanas] = useState<any[]>([
    {
      numeroSemana: 3,
      fechaCierre: '20/09/2026',
      ingresos: 1250.00,
      salidas: 280.00,
      balance: 970.00,
      movimientos: [
        { tipo: 'ingreso', concepto: 'Lote 20 Cases iPhone 16 Pro Max', metodoPago: 'Transferencia BCP/BBVA', monto: 400.00 },
        { tipo: 'ingreso', concepto: '5 Cases Magsafe + Micas', metodoPago: 'Yape / Plin', monto: 225.00 },
        { tipo: 'ingreso', concepto: 'Ventas variadas mostrador', metodoPago: 'Efectivo', monto: 625.00 },
        { tipo: 'salida', concepto: 'Pago proveedor cases importación', metodoPago: 'Transferencia BCP/BBVA', monto: 220.00 },
        { tipo: 'salida', concepto: 'Envíos Olva Courier semana 3', metodoPago: 'Efectivo', monto: 60.00 }
      ]
    },
    {
      numeroSemana: 2,
      fechaCierre: '13/09/2026',
      ingresos: 980.00,
      salidas: 190.00,
      balance: 790.00,
      movimientos: [
        { tipo: 'ingreso', concepto: 'Venta lote Punto Miraflores', metodoPago: 'Transferencia BCP/BBVA', monto: 350.00 },
        { tipo: 'ingreso', concepto: 'Ventas tienda diaria', metodoPago: 'Yape / Plin', monto: 630.00 },
        { tipo: 'salida', concepto: 'Alimentación y pasajes tienda', metodoPago: 'Efectivo', monto: 190.00 }
      ]
    },
    {
      numeroSemana: 1,
      fechaCierre: '06/09/2026',
      ingresos: 820.00,
      salidas: 120.00,
      balance: 700.00,
      movimientos: [
        { tipo: 'ingreso', concepto: 'Apertura de ventas temporada', metodoPago: 'Efectivo', monto: 820.00 },
        { tipo: 'salida', concepto: 'Insumos de empaque y bolsas', metodoPago: 'Efectivo', monto: 120.00 }
      ]
    }
  ]);

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

  // FUNCIONALIDADES
  const handleAgregarMovimiento = (nuevo: any) => setMovimientos([nuevo, ...movimientos]);
  const handleAgregarCliente = (nuevo: any) => setClientes([...clientes, nuevo]);

  const handleEditarCliente = (id: number, clienteEditado: any) => {
    setClientes(clientes.map(c => c.id === id ? { ...c, ...clienteEditado } : c));
  };

  const handleEliminarCliente = (id: number) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  const handleRegistrarDiscordancia = (monto: number, nota: string) => {
    const nueva = {
      id: Date.now(),
      semana: numeroSemanaActual,
      fechaHora: new Date().toLocaleString('es-PE'),
      montoFaltante: monto,
      adminNota: nota || 'Se requiere revisión del efectivo en caja.',
      empleadoRespuesta: '',
      estado: 'PENDIENTE',
      empleadoNombre: 'María'
    };
    setBitacora([nueva, ...bitacora]);
    alert('🚨 Discordancia registrada en la bitácora.');
  };

  const handleResponderBitacora = (id: number, respuesta: string) => {
    setBitacora(bitacora.map(b => b.id === id ? { ...b, empleadoRespuesta: respuesta, estado: 'JUSTIFICADO' } : b));
    alert('✅ Justificación guardada y enviada a revisión.');
  };

  const handleCerrarObservacion = (id: number) => {
    setBitacora(bitacora.map(b => b.id === id ? { ...b, estado: 'RESUELTO' } : b));
    alert('🟢 Observación aprobada y caso cerrado.');
  };

  const handleCierreSemana = () => {
    if (confirm(`¿Desea cerrar la Semana ${numeroSemanaActual}? Se reiniciará la caja en S/ 0.00.`)) {
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
      setMovimientos([]);
      alert(`🔒 Semana ${numeroSemanaActual} cerrada con éxito.`);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#03050c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleLogin} style={{ background: '#080c18', border: '1px solid #3b82f6', borderRadius: '16px', padding: '35px', width: '320px', textAlign: 'center' }}>
          <h2 style={{ color: '#fff', margin: '0 0 5px 0' }}>CHASS IMPORT</h2>
          <span style={{ color: '#38bdf8', fontSize: '10px', display: 'block', marginBottom: '20px', fontWeight: 'bold' }}>CONTROL DE CAJA</span>
          <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '15px', background: '#0f172a', border: '1px solid #334155', color: '#fff', borderRadius: '6px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '10px', background: '#3b82f6', border: 'none', color: '#fff', fontWeight: 'bold', borderRadius: '6px', cursor: 'pointer' }}>INGRESAR</button>
        </form>
      </div>
    );
  }

  const cambiarSeccion = (seccion: string) => {
    setSeccionActiva(seccion);
    setMenuMovilAbierto(false); // Cierra el menú al seleccionar una opción en celular
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#03050c', color: '#f8fafc', fontFamily: 'sans-serif', position: 'relative' }}>
      
      <ModalOperacion movimiento={movimientoModal} onClose={() => setMovimientoModal(null)} />

      {/* BOTÓN FLOTANTE DE 3 RAYITAS (HAMBURGUESA) PARA CELULAR */}
      <div style={{
        position: 'fixed', top: '15px', left: '15px', zIndex: 1100,
        display: 'flex', alignItems: 'center', gap: '10px'
      }}>
        <button 
          onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
          style={{
            background: '#0f172a', border: '1px solid #3b82f6', color: '#fff',
            padding: '10px 14px', borderRadius: '8px', fontSize: '18px', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)', fontWeight: 'bold'
          }}
        >
          {menuMovilAbierto ? '✕' : '☰'}
        </button>
      </div>

      {/* FONDO OSCURO AL ABRIR EL MENÚ EN CELULAR */}
      {menuMovilAbierto && (
        <div 
          onClick={() => setMenuMovilAbierto(false)}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 999, backdropFilter: 'blur(3px)'
          }}
        />
      )}

      {/* BARRA LATERAL (COLAPSIBLE / DESPLEGABLE) */}
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
              <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 'bold', display: 'block' }}>SEMANA {numeroSemanaActual} ACTIVA</span>
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

      {/* ÁREA PRINCIPAL (OCUPA EL 100% DE LA PANTALLA CON UN PEQUEÑO MARGEN SUPERIOR PARA EL BOTÓN) */}
      <main style={{ flex: 1, padding: '75px 20px 25px 20px', overflowY: 'auto', boxSizing: 'border-box', width: '100%' }}>
        {seccionActiva === 'inicio' && <SeccionInicio role={role} numeroSemanaActual={numeroSemanaActual} movimientos={movimientos} onCierreSemana={handleCierreSemana} onRegistrarDiscordancia={handleRegistrarDiscordancia} />}
        {seccionActiva === 'entradas' && <SeccionEntradas role={role} nombreUsuario={nombreUsuario} movimientos={movimientos} clientes={clientes} onRegistrarIngreso={handleAgregarMovimiento} onAbrirModal={m => setMovimientoModal(m)} />}
        {seccionActiva === 'salidas' && <SeccionSalidas role={role} nombreUsuario={nombreUsuario} movimientos={movimientos} onRegistrarSalida={handleAgregarMovimiento} />}
        {seccionActiva === 'clientes' && (
          <SeccionClientes 
            clientes={clientes} 
            onAgregarCliente={handleAgregarCliente}
            onEditarCliente={handleEditarCliente}
            onEliminarCliente={handleEliminarCliente}
          />
        )}
        {seccionActiva === 'registros' && role === 'ADMIN' && <SeccionHistorial historialSemanas={historialSemanas} />}
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