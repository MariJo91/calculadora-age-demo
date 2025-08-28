// Archivo: dashboard.js
// Dashboard básico con Chart.js
async function loadDashboard() {
  try {
    // Simulación de datos (en producción, fetch al endpoint de n8n)
    const data = {
      total: 12,
      ahorroTotal: 45230,
      fechas: ['01/08', '02/08', '03/08', '04/08', '05/08', '06/08', '07/08'],
      ahorrosPorDia: [5000, 6000, 4000, 7000, 3000, 5000, 8000],
      topServicios: [
        { nombre: 'Catastro', ahorro: 15000 },
        { nombre: 'Licencias Urbanísticas', ahorro: 12000 },
        { nombre: 'Registro Civil', ahorro: 8000 },
        { nombre: 'Sanidad', ahorro: 6000 },
        { nombre: 'Educación', ahorro: 4200 }
      ],
      ultimosAnalisis: [
        { procedimiento: 'Solicitud licencia urbanística', ahorro: 4500 },
        { procedimiento: 'Trámite catastral', ahorro: 5000 },
        { procedimiento: 'Registro nacimiento', ahorro: 3000 },
        { procedimiento: 'Solicitud permiso obras', ahorro: 7000 },
        { procedimiento: 'Inscripción escuela', ahorro: 4000 }
      ]
    };

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

    // Últimos análisis
    const ultimosList = document.getElementById('ultimos-analisis');
    ultimosList.innerHTML = '';
    data.ultimosAnalisis.forEach(item => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.textContent = `${item.procedimiento} - €${item.ahorro.toLocaleString('es-ES')}`;
      ultimosList.appendChild(li);
    });

  } catch (error) {
    console.error('Error cargando dashboard:', error);
  }
}

// Auto-refresh cada 5 minutos
loadDashboard();
setInterval(loadDashboard, 5 * 60 * 1000);
