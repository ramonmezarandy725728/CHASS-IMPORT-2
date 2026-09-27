

interface Props {
  movimiento: any;
  onClose: () => void;
}

export default function ModalOperacion({ movimiento, onClose }: Props) {
  if (!movimiento) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: '#0a0e1a', border: '2px solid #eab308', borderRadius: '16px',
        padding: '30px', width: '90%', maxWidth: '480px', color: '#fff', fontFamily: 'sans-serif'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid #1e293b', paddingBottom: '12px' }}>
          <h3 style={{ margin: 0, color: '#fde047', fontSize: '15px' }}>🔍 DETALLE DE AUDITORÍA BANCARIA</h3>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ textAlign: 'center', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: '12px', padding: '15px', marginBottom: '20px' }}>
          <span style={{ fontSize: '10px', color: '#eab308', fontWeight: 'bold' }}>NÚMERO DE OPERACIÓN</span>
          <h1 style={{ margin: '5px 0 0 0', fontFamily: 'monospace', fontSize: '32px' }}>#{movimiento.numOperacion || 'SIN CÓDIGO'}</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', marginBottom: '25px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
            <span style={{ color: '#94a3b8' }}>Método de Pago:</span>
            <strong style={{ color: '#c084fc' }}>{movimiento.metodoPago}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
            <span style={{ color: '#94a3b8' }}>Monto Acreditado:</span>
            <strong style={{ color: '#4ade80', fontSize: '16px' }}>S/ {movimiento.monto?.toFixed(2)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
            <span style={{ color: '#94a3b8' }}>Cliente / Punto:</span>
            <strong>{movimiento.cliente}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '8px' }}>
            <span style={{ color: '#94a3b8' }}>Producto / Detalle:</span>
            <strong style={{ color: '#38bdf8' }}>{movimiento.modeloIphone ? `${movimiento.modeloIphone} (${movimiento.tipoCase})` : movimiento.concepto}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Registrado por:</span>
            <strong style={{ color: '#f472b6' }}>👤 {movimiento.usuario}</strong>
          </div>
        </div>

        <button onClick={onClose} style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          ✓ ENTENDIDO / CERRAR VISTA
        </button>
      </div>
    </div>
  );
}