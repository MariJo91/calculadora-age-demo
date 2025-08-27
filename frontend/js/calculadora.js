// ... (código previo)

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Validar que los campos de contexto y parámetros estén llenos
    const userName = document.getElementById('userName').value.trim();
    const userEmail = document.getElementById('userEmail').value.trim();
    const procedimiento = document.getElementById('procedimiento').value.trim();
    const poblacion = parseInt(document.getElementById('poblacion').value);
    const frecuencia = parseInt(document.getElementById('frecuencia').value);

    if (!userName || !userEmail || !procedimiento || isNaN(poblacion) || isNaN(frecuencia)) {
        showStatusMessage('Por favor, complete todos los campos obligatorios.', 'alert-danger');
        return;
    }

    const initialCost = calculateTotalCost('initialLoadsContainer');
    const finalCost = calculateTotalCost('finalLoadsContainer');

    if (initialCost === 0 || finalCost === 0) {
        showStatusMessage('Asegúrese de seleccionar y especificar cantidades para las cargas iniciales y finales.', 'alert-danger');
        return;
    }

    const ahorroUnidad = initialCost - finalCost;
    const ahorroAnual = ahorroUnidad * frecuencia * poblacion;
    const porcentajeReduccion = (ahorroUnidad / initialCost) * 100;

    // Estructura de datos JSON conforme al plan
    const data = {
        procedimiento,
        servicio: document.getElementById('userService').value,
        usuario: userName,
        email: userEmail,
        cargasIniciales: getLoadsData('initialLoadsContainer'),
        cargasFinales: getLoadsData('finalLoadsContainer'),
        parametros: { poblacion, frecuencia },
        resultados: {
            ahorroAnual: parseFloat(ahorroAnual.toFixed(2)),
            porcentajeReduccion: parseFloat(porcentajeReduccion.toFixed(2))
        },
        metadatos: {
            metodologia: "Método Simplificado (MS) - Manual AGE"
        }
    };

    // Enviar a n8n
    showStatusMessage('Calculando... esto puede tomar unos segundos.', 'alert-info');
    // Reemplaza esta URL con la URL de tu webhook de n8n
    const urlWebhook = 'https://n8n.icc-e.org/webhook/calculate';
    try {
        const response = await fetch(urlWebhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body: data }),
        });

        if (response.ok) {
            showStatusMessage('Cálculo completado. Los resultados detallados han sido enviados a tu correo electrónico.', 'alert-success');
        } else {
            showStatusMessage('Error al enviar los datos. Inténtalo de nuevo.', 'alert-danger');
        }
    } catch (error) {
        showStatusMessage('Error de conexión. Asegúrate de que el servidor n8n esté activo.', 'alert-danger');
        console.error('Error:', error);
    }
});

// ... (resto de funciones)