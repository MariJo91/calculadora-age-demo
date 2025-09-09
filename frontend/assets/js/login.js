const form = document.getElementById('loginForm');
const mensaje = document.getElementById('mensaje');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const correo = document.getElementById('correo').value;
  const password = document.getElementById('password').value;

  const response = await fetch('https://n8n.icc-e.org/webhook/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ correo, password })
  });

  const data = await response.json();

  if (data.status === 'ok') {
    window.location.href = '/calculadora.html'; // Redirige al módulo principal
  } else if (data.status === 'registro') {
    mensaje.textContent = 'Usuario no registrado. ¿Deseas crear una cuenta?';
    // Aquí podrías mostrar un botón para registrar
  } else {
    mensaje.textContent = data.mensaje;
  }
});