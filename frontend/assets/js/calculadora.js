// =======================
// 🔧 Función principal de cálculo y envío
// =======================

// Variables contenedores
const initialContainer = document.getElementById('initialLoadsContainer');
const finalContainer = document.getElementById('finalLoadsContainer');
const totalInitialCost = document.getElementById('totalInitialCost');
const totalFinalCost = document.getElementById('totalFinalCost');
const statusMessage = document.getElementById('status-message');

// Función para crear una carga
function createLoadElement(tipo = 'Inicial') {
  const div = document.createElement('div');
  div.classList.add('load-group', 'mb-3');
  div.innerHTML = `
    <label class="form-label">Carga ${tipo}</label>
    <div class="input-group">
      <select class="form-select load-select" required>
        <option value="Trámite A">Trámite A</option>
        <option value="Trámite B">Trámite B</option>
        <option value="Trámite C">Trámite C</option>
      </select>
      <input type="number" class="form-control load-quantity" placeholder="Cantidad" min="1" value="1" required>
      <button type="button" class="btn btn-outline-danger btn-sm remove-load"><i class="fas fa-trash"></i></button>
    </div>
  `;
  return div;
}

// Añadir carga inicial/final
document.getElementById('addInitialLoad').addEventListener('click', () => {
  initialContainer.appendChild(createLoadElement('Inicial'));
});

document.getElementById('addFinalLoad').addEventListener('click', () => {
  finalContainer.appendChild(createLoadElement('Final'));
});

// Eliminar carga
document.addEventListener('click', e => {
  if (e.target.closest('.remove-load')) {
    e.target.closest('.load-group').remove();
    updateTotals();
  }
});

// Actualizar totales
function updateTotals() {
  let totalInitial = 0;
  let totalFinal = 0;

  initialContainer.querySelectorAll('.load-group').forEach(group => {
    const qty = Number(group.querySelector('.load-quantity').value) || 0;
    totalInitial += qty * 10; // Supongamos coste unitario 10€ para demo
  });

  finalContainer.querySelectorAll('.load-group').forEach(group => {
    const qty = Number(group.querySelector('.load-quantity').value) || 0;
    totalFinal += qty * 10; // Supongamos coste unitario 10€ para demo
  });

  totalInitialCost.textContent = totalInitial.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  totalFinalCost.textContent = totalFinal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

// Escuchar cambios en cantidad
initialContainer.addEventListener('input', updateTotals);
finalContainer.addEventListener('input', updateTotals);

// Función para enviar formulario
document.getElementById('btnCalcular').addEventListener('click', async () => {
  statusMessage.textContent = 'Enviando datos...';
  const data = {
    usuario: document.getElementById('userName').value,
    email: document.getElementById('userEmail').value,
    servicio: document.getElementById('userService').value,
    procedimiento: document.getElementById('procedimiento').value,
    parametros: {
      poblacion: Number(document.getElementById('poblacion').value),
      frecuencia: Number(document.getElementById('frecuencia').value)
    },
    cargasIniciales: [],
    cargasFinales: [],
    resultados: {},
    metadatos: { metodologia: "Método Simplificado (MS) - Manual AGE" }
  };

  // Cargas iniciales
  initialContainer.querySelectorAll('.load-group').forEach(group => {
    const tipo = group.querySelector('.load-select').value;
    const cantidad = Number(group.querySelector('.load-quantity').value) || 0;
    data.cargasIniciales.push({ tipo, coste: 10, cantidad }); // coste unitario demo 10€
  });

  // Cargas finales
  finalContainer.querySelectorAll('.load-group').forEach(group => {
    const tipo = group.querySelector('.load-select').value;
    const cantidad = Number(group.querySelector('.load-quantity').value) || 0;
    data.cargasFinales.push({ tipo, coste: 10, cantidad });
  });

  // Cálculo de ahorro
  const totalInicial = data.cargasIniciales.reduce((sum, c) => sum + c.coste * c.cantidad, 0) * data.parametros.frecuencia * data.parametros.poblacion;
  const totalFinal = data.cargasFinales.reduce((sum, c) => sum + c.coste * c.cantidad, 0) * data.parametros.frecuencia * data.parametros.poblacion;
  data.resultados.ahorroAnual = totalInicial - totalFinal;
  data.resultados.porcentajeReduccion = ((totalInicial - totalFinal) / totalInicial * 100).toFixed(2);

  // Envío al webhook de n8n
  try {
    // >>>>> LÍNEA ACTUALIZADA <<<<<
    const webhookURL = 'https://15m9j9k5z-5678.use2.devtunnels.ms/webhook/calculate';
    const response = await fetch(webhookURL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    statusMessage.textContent = `¡Análisis guardado con ID: ${result.id}!`;
    document.getElementById('btnDescargarPDF').classList.remove('d-none');
  } catch (err) {
    console.error(err);
    statusMessage.textContent = 'Error al enviar los datos. Revisa tu conexión.';
  }
});

// Inicializar totales al cargar
updateTotals();

