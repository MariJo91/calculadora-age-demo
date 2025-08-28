function showStatusMessage(message, type) {
  const statusDiv = document.getElementById('status-message');
  statusDiv.innerHTML = `<div class="alert ${type}">${message}</div>`;
}

function calculateTotalCost(containerId) {
  const container = document.getElementById(containerId);
  const groups = container.querySelectorAll('.load-group');
  let total = 0;

  groups.forEach(group => {
    const tipo = group.querySelector('.load-select').value;
    const cantidad = parseInt(group.querySelector('.load-quantity').value) || 0;
    const costoUnitario = diccionarioCargas[tipo] || 0;
    total += cantidad * costoUnitario;
  });

  return total;
}

function getLoadsData(containerId) {
  const container = document.getElementById(containerId);
  const groups = container.querySelectorAll('.load-group');
  const cargas = [];

  groups.forEach(group => {
    const tipo = group.querySelector('.load-select').value;
    const cantidad = parseInt(group.querySelector('.load-quantity').value) || 0;
    const costoUnitario = diccionarioCargas[tipo] || 0;
    cargas.push({ tipo, cantidad, costoUnitario });
  });

  return cargas;
}

function generarID() {
  return 'AGE-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000);
}