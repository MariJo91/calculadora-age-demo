// La fórmula oficial es CA = CU × FR × PB (Coste Administrativo = Coste Unitario × Frecuencia × Población).
const COSTOS_AGE = {
    // Estos valores son ilustrativos. Debes rellenarlos con los
    // datos exactos del manual oficial (páginas 77-80)
    'Búsqueda y consulta de información': 0.88,
    'Presentación de solicitudes': 1.25,
    'Aportación de documentación': 3.75,
    'Comparecencia en sede electrónica': 5.00,
    'Comparecencia en oficina presencial': 8.50,
    'Pago de tasas': 2.00,
    'Notificación electrónica': 0.75,
    'Cumplimentación de formularios': 2.50
    // Añade más cargas aquí, si el manual las especifica
};

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('calculatorForm');
    const totalInitialCostSpan = document.getElementById('totalInitialCost');
    const totalFinalCostSpan = document.getElementById('totalFinalCost');
    const initialLoadsContainer = document.getElementById('initialLoadsContainer');
    const finalLoadsContainer = document.getElementById('finalLoadsContainer');

    function populateLoadSelects() {
        const selects = document.querySelectorAll('.load-select');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Seleccione la carga...</option>';
            for (const key in COSTOS_AGE) {
                const option = document.createElement('option');
                option.value = COSTOS_AGE[key];
                option.textContent = `${key} (€${COSTOS_AGE[key]})`;
                select.appendChild(option);
            }
        });
    }

    function addLoadRow(container, type) {
        const loadCount = container.querySelectorAll('.load-group').length + 1;
        const newGroup = document.createElement('div');
        newGroup.className = 'load-group mb-3';
        newGroup.innerHTML = `
            <label class="form-label">Carga ${type} ${loadCount}</label>
            <div class="input-group">
                <select class="form-select load-select" required></select>
                <input type="number" class="form-control load-quantity" placeholder="Cantidad" min="1" required>
            </div>
        `;
        container.appendChild(newGroup);
        populateLoadSelects();
    }

    document.getElementById('addInitialLoad').addEventListener('click', () => {
        addLoadRow(initialLoadsContainer, 'inicial');
    });

    document.getElementById('addFinalLoad').addEventListener('click', () => {
        addLoadRow(finalLoadsContainer, 'final');
    });

    function calculateTotalCost(containerId) {
        const loads = document.getElementById(containerId).querySelectorAll('.load-group');
        let total = 0;
        loads.forEach(group => {
            const selectElement = group.querySelector('.load-select');
            const cost = parseFloat(selectElement.value);
            const quantity = parseInt(group.querySelector('.load-quantity').value);
            if (!isNaN(cost) && !isNaN(quantity)) {
                total += cost * quantity;
            }
        });
        return total;
    }

    function updateCosts() {
        const initialCost = calculateTotalCost('initialLoadsContainer');
        const finalCost = calculateTotalCost('finalLoadsContainer');
        totalInitialCostSpan.textContent = `${initialCost.toFixed(2)} €`;
        totalFinalCostSpan.textContent = `${finalCost.toFixed(2)} €`;
    }

    form.addEventListener('input', updateCosts);
    form.addEventListener('change', updateCosts);

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
        const urlWebhook = 'http://localhost:5678/webhook/un-id-unico'; 
        try {
            const response = await fetch(urlWebhook, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
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

    function getLoadsData(containerId) {
        const loads = document.getElementById(containerId).querySelectorAll('.load-group');
        const dataArray = [];
        loads.forEach(group => {
            const selectElement = group.querySelector('.load-select');
            const quantity = parseInt(group.querySelector('.load-quantity').value);
            if (selectElement.value && !isNaN(quantity)) {
                const tipo = selectElement.options[selectElement.selectedIndex].text.split('(')[0].trim();
                dataArray.push({
                    tipo: tipo,
                    coste: parseFloat(selectElement.value),
                    cantidad: quantity
                });
            }
        });
        return dataArray;
    }

    function showStatusMessage(message, className) {
        const statusDiv = document.getElementById('status-message');
        if (statusDiv) {
            statusDiv.innerHTML = `<div class="alert ${className}" role="alert">${message}</div>`;
        }
    }

    // Inicializar los selects
    populateLoadSelects();
});