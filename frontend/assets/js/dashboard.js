// Archivo: dashboard.js
// Dashboard institucional conectado a n8n + Google Sheets

async function loadDashboard() {
  try {
    // Consulta al endpoint de n8n
    const response = await fetch('https://n8n.icc-e.org/webhook/dashboard');
    const data = await response.json();

    // Métricas básicas
    document.getElementById('total-analisis').textContent = data.total;
    document.getElementById('ahorro-total').textContent = '€' + data.ahorroTotal.toLocaleString('es-ES');

    // Gráfico temporal con Chart.js
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

    // Últimos análisis (si el campo existe)
    const ultimosList = document.getElementById('ultimos-analisis');
    ultimosList.innerHTML = '';
    if (data.ultimosAnalisis) {
      data.ultimosAnalisis.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = `${item.procedimiento} - €${item.ahorro.toLocaleString('es-ES')}`;
        ultimosList.appendChild(li);
      });
    }

    // Última actualización (opcional)
    if (data.ultimaActualizacion) {
      document.getElementById('ultima-actualizacion').textContent = data.ultimaActualizacion;
    }

  } catch (error) {
    console.error('Error cargando dashboard:', error);
    const status = document.getElementById('status-message');
    if (status) {
      status.textContent = '⚠️ No se pudo cargar el dashboard institucional.';
    }
  }
}

// Carga inicial + auto-refresh cada 5 minutos
loadDashboard();
setInterval(loadDashboard, 5 * 60 * 1000);