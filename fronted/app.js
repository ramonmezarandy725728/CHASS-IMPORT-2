let usuarioSesion = null;

document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('login-screen');
  const appScreen = document.getElementById('app-screen');
  const loginForm = document.getElementById('login-form');

  // LOGIN
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;

    try {
      usuarioSesion = await loginUser(u, p);
      loginScreen.classList.add('hidden');
      appScreen.classList.remove('hidden');

      // Configurar vista según ROL
      document.getElementById('role-badge').innerText = usuarioSesion.rol;
      document.getElementById('user-display').innerText = usuarioSesion.nombre;

      if (usuarioSesion.rol === 'TRABAJADOR') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
      }

      actualizarCaja();
      cargarClientesSelect();
    } catch (err) {
      alert('⚠️ Usuario o contraseña incorrecta');
    }
  });

  // LOGOUT
  document.getElementById('btn-logout').addEventListener('click', () => {
    location.reload();
  });

  // NAVEGACIÓN
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.view-sec');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navBtns.forEach(b => b.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));

      btn.classList.add('active');
      const target = btn.getAttribute('data-target');
      document.getElementById(`sec-${target}`).classList.add('active');

      if (target === 'historial') cargarHistorial();
    });
  });

  // ACTUALIZAR CAJA
  async function actualizarCaja() {
    const data = await getCajaData();
    document.getElementById('monto-caja').innerText = `S/ ${data.balance.toFixed(2)}`;
    document.getElementById('stat-ingresos').innerText = `S/ ${data.ingresos.toFixed(2)}`;
    document.getElementById('stat-salidas').innerText = `S/ ${data.salidas.toFixed(2)}`;
    document.getElementById('stat-balance').innerText = `S/ ${data.balance.toFixed(2)}`;
  }

  // CARGAR CLIENTES EN SELECT
  async function cargarClientesSelect() {
    const clientes = await getClientes();
    const select = document.getElementById('select-cliente-ingreso');
    select.innerHTML = '<option value="Cliente Ocasional">-- Cliente Ocasional / Ventas Varias --</option>';
    clientes.forEach(c => {
      select.innerHTML += `<option value="${c.nombre}">${c.nombre}</option>`;
    });
  }

  // REGISTRAR INGRESO
  document.getElementById('form-ingreso').addEventListener('submit', async (e) => {
    e.preventDefault();
    await postMovimiento({
      tipo: 'ingreso',
      cliente: document.getElementById('select-cliente-ingreso').value,
      concepto: document.getElementById('ingreso-concepto').value,
      monto: parseFloat(document.getElementById('ingreso-monto').value),
      usuario: usuarioSesion.nombre
    });

    alert('✅ Ingreso registrado');
    document.getElementById('form-ingreso').reset();
    actualizarCaja();
  });

  // REGISTRAR SALIDA
  document.getElementById('form-salida').addEventListener('submit', async (e) => {
    e.preventDefault();
    await postMovimiento({
      tipo: 'salida',
      motivo: document.getElementById('salida-motivo').value,
      concepto: document.getElementById('salida-concepto').value,
      monto: parseFloat(document.getElementById('salida-monto').value),
      usuario: usuarioSesion.nombre
    });

    alert('✅ Salida registrada');
    document.getElementById('form-salida').reset();
    actualizarCaja();
  });

  // REGISTRAR CLIENTE
  document.getElementById('form-cliente').addEventListener('submit', async (e) => {
    e.preventDefault();
    await postCliente({
      nombre: document.getElementById('cliente-nombre').value,
      dni: document.getElementById('cliente-dni').value,
      telefono: document.getElementById('cliente-tel').value
    });

    alert('✅ Cliente guardado');
    document.getElementById('form-cliente').reset();
    cargarClientesSelect();
  });

  // CIERRE DE SEMANA (ADMIN)
  document.getElementById('btn-cierre').addEventListener('click', async () => {
    const data = await getCajaData();
    if (confirm('¿Deseas cerrar la semana actual? La caja reiniciará en S/ 0.00 y los datos pasarán al historial.')) {
      await postCierreSemana({
        numero_semana: Date.now(),
        ingresos: data.ingresos,
        salidas: data.salidas,
        balance: data.balance,
        diferencia: 0
      });
      alert('🔒 Semana cerrada correctamente');
      actualizarCaja();
    }
  });

  // HISTORIAL
  async function cargarHistorial() {
    const semanas = await getSemanas();
    const contenedor = document.getElementById('historial-lista');
    contenedor.innerHTML = '';
    semanas.forEach(s => {
      contenedor.innerHTML += `
        <div style="background:#0f172a; padding:15px; border-radius:8px; margin-bottom:10px;">
          <strong>Cierre del ${s.fecha_cierre}</strong><br>
          <small>Ingresos: S/ ${s.total_ingresos.toFixed(2)} | Salidas: S/ ${s.total_salidas.toFixed(2)} | Resultado: S/ ${s.balance.toFixed(2)}</small>
        </div>
      `;
    });
  }
});