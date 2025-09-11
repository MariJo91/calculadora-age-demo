// Archivo: dashboard.js
// Dashboard institucional conectado a n8n + Google Sheets

async function loadDashboard() {
  const status = document.getElementById('status-message');
  status.textContent = '🔄 Cargando datos...';

  try {
    const response = await fetch('https://n8n.icc-e.org/webhook/dashboard');
    const data = await response.json();

    // Métricas básicas
    document.getElementById('total-analisis').textContent = data.total;
    document.getElementById('ahorro-total').textContent = '€' + data.ahorroTotal.toLocaleString('es-ES');
    document.getElementById('ultima-actualizacion').textContent = data.ultimaActualizacion || '—';

    // Gráfico temporal
    const ctx = document.getElementById('grafico-temporal').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.fechas,
        datasets: [{
          label: 'Ahorros por día (€)',
          data: data.ahorrosPorDia,
          borderColor: '#c41e3a',
          backgroundColor: 'rgba(196,30,58,0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: value => '€' + value.toLocaleString('es-ES')
            }
          }
        }
      }
    });

    // Top servicios
    const topContainer = document.getElementById('top-servicios');
    topContainer.innerHTML = '';
    data.topServicios.forEach(servicio => {
      const div = document.createElement('div');
      div.innerHTML = `<strong>${servicio.nombre}</strong>: €${servicio.ahorro.toLocaleString('es-ES')}`;
      topContainer.appendChild(div);
    });

    // Últimos análisis
    const ultimosList = document.getElementById('ultimos-analisis');
    ultimosList.innerHTML = '';
    data.ultimosAnalisis?.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    li.innerHTML = `
      <div>
       <strong>${item.servicio}</strong><br />
        <span>${item.procedimiento}</span>
      </div>
      <div>
         €${item.ahorro.toLocaleString('es-ES')}
        <span class="badge bg-${item.clasificacion === 'ALTO' ? 'danger' : item.clasificacion === 'MEDIO' ? 'warning' : 'success'} ms-2">
          ${item.clasificacion}
        </span>
      </div>
    `;
      ultimosList.appendChild(li);
    });

    status.textContent = ''; // Limpia mensaje de carga

  } catch (error) {
    console.error('Error cargando dashboard:', error);
    status.textContent = '⚠️ No se pudo cargar el dashboard institucional.';
  }
}

// Carga inicial + auto-refresh cada 5 minutos
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  setInterval(loadDashboard, 5 * 60 * 1000);

  // Botón de recarga manual
  const btnRecargar = document.getElementById('btn-recargar');
  if (btnRecargar) {
    btnRecargar.addEventListener('click', loadDashboard);
  }
});