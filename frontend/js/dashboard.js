// Archivo: dashboard.js
// Dashboard básico con Chart.js

async function loadDashboard() {
    try {
        // Simular carga desde un endpoint API (en un entorno real, este endpoint leería del CSV)
        const response = await fetch('/api/dashboard');
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
                    label: 'Ahorros por día',
                    data: data.ahorrosPorDia,
                    borderColor: '#c41e3a',
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '€' + value.toLocaleString('es-ES');
                            }
                        }
                    }
                }
            }
        });
        
        // Top servicios
        const topServicios = document.getElementById('top-servicios');
        // Se itera sobre los datos y se crean elementos HTML para cada servicio
        data.topServicios.forEach(servicio => {
            const div = document.createElement('div');
            div.innerHTML = `
                <strong>${servicio.nombre}</strong>: 
                €${servicio.ahorro.toLocaleString('es-ES')}
            `;
            topServicios.appendChild(div);
        });
        
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
}

// Auto-refresh cada 5 minutos
setInterval(loadDashboard, 5 * 60 * 1000);
loadDashboard();