document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const contrasena = document.getElementById('contrasena').value;

            // Muestra un mensaje de carga mientras se procesa la solicitud
            showMessage('Iniciando sesión...', 'info');

            // URL del webhook de login en n8n
            // RECUERDA: Reemplaza esta URL con la tuya
            const n8nWebhookUrl = 'https://n8n.icc-e.org/webhook/login'; 

            try {
                const response = await fetch(n8nWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, contrasena })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Login exitoso
                    showMessage(`¡Hola, ${data.user.name}! Redirigiendo...`, 'success');
                    // Guarda el rol y redirige al dashboard
                    localStorage.setItem('userRole', data.user.rol);
                    window.location.href = 'dashboard.html'; 
                } else {
                    // Login fallido
                    showMessage(data.message || 'Error desconocido al iniciar sesión.', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('Ocurrió un error de conexión. Por favor, intenta de nuevo.', 'error');
            }
        });
    }

    // Función para mostrar mensajes de estado
    function showMessage(msg, type) {
        messageDiv.textContent = msg;
        messageDiv.style.display = 'block';
        messageDiv.className = `message ${type}`;
    }
});