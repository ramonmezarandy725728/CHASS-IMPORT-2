const API_URL = 'http://localhost:3001/api';

async function loginUser(username, password) {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) throw new Error('Credenciales incorrectas');
  return await res.json();
}

async function getCajaData() {
  const res = await fetch(`${API_URL}/caja`);
  return await res.json();
}

async function postMovimiento(datos) {
  const res = await fetch(`${API_URL}/movimientos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return await res.json();
}

async function getClientes() {
  const res = await fetch(`${API_URL}/clientes`);
  return await res.json();
}

async function postCliente(datos) {
  const res = await fetch(`${API_URL}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return await res.json();
}

async function postCierreSemana(datos) {
  const res = await fetch(`${API_URL}/cierre-semana`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return await res.json();
}

async function getSemanas() {
  const res = await fetch(`${API_URL}/semanas`);
  return await res.json();
}