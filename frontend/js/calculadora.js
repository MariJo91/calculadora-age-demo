// =======================
// 🔧 Función principal de cálculo y envío
// =======================

document.getElementById('calculatorForm').addEventListener('submit', async (event) => {
  event.preventDefault();

  // Captura de campos obligatorios
  const userName = document.getElementById('userName').value.trim();
  const userEmail = document.getElementById('userEmail').value.trim();
  const userService = document.getElementById('userService').value.trim();
  const procedimiento = document.getElementById('procedimiento').value.trim();
  const poblacion = parseInt(document.getElementById('poblacion').value);
  const frecuencia = parseInt(document.getElementById('frecuencia').value);

  // Validación básica
  if (!userName || !userEmail || !procedimiento || isNaN(poblacion) || isNaN(frecuencia)) {
    showStatusMessage('Por favor, complete todos los campos obligatorios.', 'alert-danger');
    return;
  }

  // Cálculo de costos
  const initialCost = calculateTotalCost('initialLoadsContainer');
  const finalCost = calculateTotalCost('finalLoadsContainer');

  if (initialCost === 0 || finalCost === 0) {
    showStatusMessage('Asegúrese de seleccionar y especificar cantidades para las cargas iniciales y finales.', 'alert-danger');
    return;
  }

  const ahorroUnidad = initialCost - finalCost;
  const ahorroAnual = ahorroUnidad * frecuencia * poblacion;
  const porcentajeReduccion = (ahorroUnidad / initialCost) * 100;

  // Construcción del objeto de solicitud
  const solicitud = {
    id: generarID(),
    procedimiento,
    servicio: userService,
    usuario: userName,
    email: userEmail,
    cargasIniciales: getLoadsData('initialLoadsContainer'),
    cargasFinales: getLoadsData('finalLoadsContainer'),
    parametros: { poblacion, frecuencia },
    resultados: {
      ahorroUnidad: parseFloat(ahorroUnidad.toFixed(2)),
      ahorroAnual: parseFloat(ahorroAnual.toFixed(2)),
      porcentajeReduccion: parseFloat(porcentajeReduccion.toFixed(2))
    },
    metadatos: {
      fecha: new Date().toISOString(),
      metodologia: "Método Simplificado (MS) - Manual AGE"
    }
  };

  // Envío al flujo n8n
  showStatusMessage('Calculando... esto puede tomar unos segundos.', 'alert-info');

  const urlWebhook = 'https://n8n.icc-e.org/webhook/calculate';

  try {
    const response = await fetch(urlWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: solicitud })
    });

    if (response.ok) {
      showStatusMessage('✅ Cálculo completado. Los resultados han sido enviados a tu correo electrónico.', 'alert-success');
    } else {
      showStatusMessage('❌ Error al enviar los datos. Inténtalo de nuevo.', 'alert-danger');
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    showStatusMessage('❌ Error de conexión. Verifica que el servidor n8n esté activo.', 'alert-danger');
  }
});