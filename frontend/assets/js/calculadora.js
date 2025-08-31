// =======================
// 📚 Datos de la Tabla de Costes Oficiales (Manual AGE, pp. 77-80)


// =======================
const costos_cargas_administrativas = [
  { nombre: "1.- Presentar una solicitud presencialmente", costo: 80.00 },
  { nombre: "2.- Presentar una solicitud electrónica", costo: 5.00 },
  { nombre: "3.- Tramitación mediante intermediarios (bancos, médicos, …)", costo: 35.00 },
  { nombre: "4.- Presentación convencional de documentos, facturas o requisitos", costo: 5.00 },
  { nombre: "5.- Presentación de una comunicación presencialmente", costo: 30.00 },
  { nombre: "6.- Presentación de una comunicación electrónicamente", costo: 2.00 },
  { nombre: "7.- Presentación electrónica de documentos, facturas o requisitos", costo: 4.00 },
  { nombre: "8.- Aportación de datos", costo: 2.00 },
  { nombre: "9.- Presentación de copias compulsadas", costo: 1.00 },
  { nombre: "10.- Presentación de un informe o memoria", costo: 500.00 },
  { nombre: "11.- Obligación de conservar documentos", costo: 20.00 },
  { nombre: "12.- Inscripción convencional en un registro", costo: 110.00 },
  { nombre: "13.- Inscripción electrónica en un registro", costo: 50.00 },
  { nombre: "14.- Llevanza de libros", costo: 300.00 },
  { nombre: "15.- Llevanza libros en vía electrónica", costo: 150.00 },
  { nombre: "16.- Auditoría o controles por organizaciones o profesionales externos", costo: 1500.00 },
  { nombre: "17.- Información a terceros", costo: 100.00 },
  { nombre: "18.- Formalización en documentos públicos de hechos o documentos", costo: 500.00 },
  { nombre: "19.- Obligación de comunicar o publicar alguna información", costo: 100.00 }
];

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
  div.classList.add('load-group', 'mb-3', 'd-flex', 'align-items-center');
  div.innerHTML = `
    <div class="input-group">
      <label class="form-label d-block me-3">Carga ${tipo} ${document.querySelectorAll('.load-group').length + 1}</label>
      <select class="form-select load-select" required></select>
      <input type="number" class="form-control load-quantity" placeholder="Cantidad" min="1" value="1" required>
      <button type="button" class="btn btn-outline-danger btn-sm remove-load"><i class="fas fa-trash"></i></button>
    </div>
    <div class="load-cost-display ms-3 fw-bold">0,00 €</div>
  `;
  
  // Rellenar el menú desplegable con datos del Manual AGE
  const select = div.querySelector('.load-select');
  costos_cargas_administrativas.forEach(carga => {
    const option = document.createElement('option');
    option.value = carga.costo;
    option.textContent = `${carga.nombre} (${carga.costo.toFixed(2)} €)`;
    select.appendChild(option);
  });
  
  // Agregar una opción por defecto
  const defaultOption = document.createElement('option');
  defaultOption.value = "";
  defaultOption.textContent = "Selecciona una carga";
  defaultOption.selected = true;
  defaultOption.disabled = true;
  select.prepend(defaultOption);

  return div;
}

// Función para actualizar el costo individual de una carga
function updateSingleLoadCost(event) {
  const group = event.target.closest('.load-group');
  const qty = Number(group.querySelector('.load-quantity').value) || 0;
  const costo = Number(group.querySelector('.load-select').value) || 0;
  const singleCostDisplay = group.querySelector('.load-cost-display');
  const total = qty * costo;
  singleCostDisplay.textContent = total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

// Añadir carga inicial/final
document.getElementById('addInitialLoad').addEventListener('click', () => {
  const newLoad = createLoadElement('Inicial');
  initialContainer.appendChild(newLoad);
  newLoad.querySelector('.load-select').addEventListener('change', updateSingleLoadCost);
  newLoad.querySelector('.load-quantity').addEventListener('input', updateSingleLoadCost);
  updateTotals();
});

document.getElementById('addFinalLoad').addEventListener('click', () => {
  const newLoad = createLoadElement('Final');
  finalContainer.appendChild(newLoad);
  newLoad.querySelector('.load-select').addEventListener('change', updateSingleLoadCost);
  newLoad.querySelector('.load-quantity').addEventListener('input', updateSingleLoadCost);
  updateTotals();
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
    const costo = Number(group.querySelector('.load-select').value) || 0;
    totalInitial += qty * costo;
  });

  finalContainer.querySelectorAll('.load-group').forEach(group => {
    const qty = Number(group.querySelector('.load-quantity').value) || 0;
    const costo = Number(group.querySelector('.load-select').value) || 0;
    totalFinal += qty * costo;
  });

  totalInitialCost.textContent = totalInitial.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
  totalFinalCost.textContent = totalFinal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

// Escuchar cambios en cantidad y selección
initialContainer.addEventListener('change', updateTotals);
finalContainer.addEventListener('change', updateTotals);

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
    const select = group.querySelector('.load-select');
    const tipo = select.options[select.selectedIndex].textContent;
    const coste = Number(select.value) || 0;
    const cantidad = Number(group.querySelector('.load-quantity').value) || 0;
    data.cargasIniciales.push({ tipo, coste, cantidad });
  });

  // Cargas finales
  finalContainer.querySelectorAll('.load-group').forEach(group => {
    const select = group.querySelector('.load-select');
    const tipo = select.options[select.selectedIndex].textContent;
    const coste = Number(select.value) || 0;
    const cantidad = Number(group.querySelector('.load-quantity').value) || 0;
    data.cargasFinales.push({ tipo, coste, cantidad });
  });

  // Cálculo de ahorro
  const totalInicial = data.cargasIniciales.reduce((sum, c) => sum + c.coste * c.cantidad, 0) * data.parametros.frecuencia * data.parametros.poblacion;
  const totalFinal = data.cargasFinales.reduce((sum, c) => sum + c.coste * c.cantidad, 0) * data.parametros.frecuencia * data.parametros.poblacion;
  data.resultados.ahorroAnual = totalInicial - totalFinal;
  data.resultados.porcentajeReduccion = ((totalInicial - totalFinal) / totalInicial * 100).toFixed(2);

  // Envío al webhook de n8n
  try {

    const webhookURL = 'https://n8n.icc-e.org/webhook/calculate'
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

// Inicializar la primera carga al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  const initialLoad = createLoadElement('Inicial');
  initialContainer.appendChild(initialLoad);
  initialLoad.querySelector('.load-select').addEventListener('change', updateSingleLoadCost);
  initialLoad.querySelector('.load-quantity').addEventListener('input', updateSingleLoadCost);

  const finalLoad = createLoadElement('Final');
  finalContainer.appendChild(finalLoad);
  finalLoad.querySelector('.load-select').addEventListener('change', updateSingleLoadCost);
  finalLoad.querySelector('.load-quantity').addEventListener('input', updateSingleLoadCost);

  updateTotals();
});